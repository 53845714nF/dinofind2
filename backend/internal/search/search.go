package search

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"dinofind/internal/config"
	"dinofind/internal/vectorizer"
	
	"github.com/qdrant/go-client/qdrant"
)

var (
	allowedExtensions = map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
	}
)

const (
	maxFileSizeMB = 32
	maxFileSize   = maxFileSizeMB << 20
	uploadFolder  = "uploads"
)

type SearchResponse struct {
	Results []string `json:"results"`
	Count   int      `json:"count"`
	Error   string   `json:"error,omitempty"`
}

type QdrantSearchRequest struct {
	Vector      []float32 `json:"vector"`
	Limit       int       `json:"limit"`
	WithPayload bool      `json:"with_payload"`
}

type QdrantSearchResponse struct {
	Result []struct {
		Payload map[string]interface{} `json:"payload"`
	} `json:"result"`
}

func sendJSONResponse(w http.ResponseWriter, statusCode int, resp SearchResponse) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(resp)
}

func searchQdrantHTTP(cfg *config.AppConfig, vector []float32, limit int) ([]string, error) {
	reqBody := QdrantSearchRequest{
		Vector:      vector,
		Limit:       limit,
		WithPayload: true,
	}
	bodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}

	scheme := "http"
	if cfg.QdrantHttps {
		scheme = "https"
	}

	url := fmt.Sprintf("%s://%s:%s/collections/%s/points/search", scheme, cfg.QdrantHost, cfg.QdrantPort, cfg.CollectionName)

	req, err := http.NewRequest("POST", url, bytes.NewReader(bodyBytes))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	if cfg.QdrantKey != "" {
		req.Header.Set("api-key", cfg.QdrantKey)
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyErr, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("HTTP %d: %s", resp.StatusCode, string(bodyErr))
	}

	var qResp QdrantSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&qResp); err != nil {
		return nil, err
	}

	var results []string
	for _, r := range qResp.Result {
		if r.Payload != nil {
			if urlVal, ok := r.Payload["image_url"].(string); ok {
				results = append(results, urlVal)
			}
		}
	}
	return results, nil
}

// getLimit holt den 'limit'-Parameter aus dem Formular.
func getLimit(r *http.Request) int {
	limitStr := r.FormValue("limit")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		return 1 // Standardwert wie in der Python-Logik
	}
	return limit
}

func ImageSearchHandler(qdrantClient *qdrant.Client, cfg *config.AppConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			sendJSONResponse(w, http.StatusOK, SearchResponse{Error: "Please use POST to upload a file."})
			return
		}

		if r.Method != "POST" {
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		tempImagePath, err := saveUploadedImage(r)
		if err != nil {
			log.Printf("Upload error: %v", err)
			sendJSONResponse(w, http.StatusBadRequest, SearchResponse{Error: err.Error()})
			return
		}
		defer func() {
			if rErr := os.Remove(tempImagePath); rErr != nil {
				log.Printf("Error removing temporary file %s: %v", tempImagePath, rErr)
			}
		}()

		limit := getLimit(r)

		vector, err := vectorizer.VectorizeImage(tempImagePath)
		if err != nil {
			log.Printf("Vector generation error: %v", err)
			sendJSONResponse(w, http.StatusInternalServerError, SearchResponse{Error: "Fehler beim Generieren des Vektors."})
			return
		}

		// Qdrant Suche durchführen
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		searchResult, err := qdrantClient.Query(ctx, &qdrant.QueryPoints{
			CollectionName: cfg.CollectionName,
			Query:          qdrant.NewQuery(vector...),
			Limit:          func(i uint64) *uint64 { return &i }(uint64(limit)),
		})
		
		var resultImages []string

		if err != nil {
			log.Printf("gRPC Qdrant search error: %v, falling back to HTTP...", err)
			resultImages, err = searchQdrantHTTP(cfg, vector, limit)
			if err != nil {
				log.Printf("HTTP Qdrant search error: %v", err)
				sendJSONResponse(w, http.StatusInternalServerError, SearchResponse{Error: "Fehler bei der Qdrant-Suche (gRPC & HTTP fehlgeschlagen)."})
				return
			}
		} else {
			resultImages = make([]string, 0, len(searchResult))
			for _, result := range searchResult {
				// Extract ImageUrl from payload if it exists
				var imageUrl string
				if payloadVal, ok := result.Payload["image_url"]; ok {
					imageUrl = payloadVal.GetStringValue()
				}
				resultImages = append(resultImages, imageUrl)
			}
		}

		if len(resultImages) == 0 {
			sendJSONResponse(w, http.StatusOK, SearchResponse{Error: "Entschuldigung, es wurde kein passendes Bild in der Datenbank gefunden."})
			return
		}

		sendJSONResponse(w, http.StatusOK, SearchResponse{
			Results: resultImages,
			Count:   len(resultImages),
		})
	}
}

// saveUploadedImage validiert den Upload und speichert das Bild temporär.
func saveUploadedImage(r *http.Request) (string, error) {
	// Das Limit wird von Go automatisch gehandhabt, aber wir setzen es explizit für das Parsen
	// 32MB ist der Standard, wir brauchen das nicht zu ändern, da wir die Größe später prüfen.
	r.ParseMultipartForm(32 << 20)

	file, handler, err := r.FormFile("file")
	if err != nil {
		return "", fmt.Errorf("bitte wählen Sie ein Bild zur Suche aus (FormFile error: %w)", err)
	}
	defer file.Close()

	// 1. Dateinamen und Extension prüfen
	filename := handler.Filename
	if filename == "" {
		return "", fmt.Errorf("bitte wählen Sie ein Bild zur Suche aus")
	}

	ext := strings.ToLower(filepath.Ext(filename))
	if !allowedExtensions[ext] {
		return "", fmt.Errorf("bitte wählen Sie ein gültiges Bildformat (.jpg, .jpeg, .png, .gif)")
	}

	// 2. MIME-Type prüfen (optional, da wir die Extension geprüft haben, aber gut für Sicherheit)
	// Go's http.DetectContentType kann hier verwendet werden, aber da wir den Handler haben,
	// vertrauen wir vorerst auf die Dateiendung für die Fehlerbehandlung, wie es im Python-Code impliziert war.

	// 3. Dateigröße prüfen
	file.Seek(0, io.SeekStart) // Setze den Zeiger zurück zum Anfang

	// Wir verwenden handler.Size für die Größe, die genauer ist
	if handler.Size > maxFileSize {
		return "", fmt.Errorf("das Bild ist zu groß. Die maximale Größe beträgt %d MB", maxFileSizeMB)
	}

	// 4. Temporäre Speicherung
	// Um Namenskollisionen zu vermeiden, fügen wir einen Zeitstempel hinzu.
	tempFilename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filename)
	tempPath := filepath.Join(uploadFolder, tempFilename)

	dst, err := os.Create(tempPath)
	if err != nil {
		return "", fmt.Errorf("fehler beim Erstellen der temporären Datei: %w", err)
	}
	defer dst.Close()

	file.Seek(0, io.SeekStart) // Setze den Zeiger erneut zurück

	if _, err := io.Copy(dst, file); err != nil {
		os.Remove(tempPath)
		return "", fmt.Errorf("fehler beim Speichern der Datei: %w", err)
	}

	return tempPath, nil
}
