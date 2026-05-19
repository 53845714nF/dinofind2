package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"dinofind/internal/config"
	"dinofind/internal/search"

	"github.com/qdrant/go-client/qdrant"
)

func healthHandler(w http.ResponseWriter, r *http.Request) {
	status := "Running"

	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	fmt.Fprint(w, status)
}

func main() {
	cfg := config.LoadConfig()

	if err := os.MkdirAll("uploads", 0755); err != nil {
		log.Fatalf("Konnte Upload-Ordner nicht erstellen: %v", err)
	}

	qdrantPort, err := strconv.Atoi(cfg.QdrantPort)
	if err != nil {
		qdrantPort = 6333 // Default Fallback, if port not specified
	}

	qdrantClient, err := qdrant.NewClient(&qdrant.Config{
		Host:   cfg.QdrantHost,
		Port:   qdrantPort,
		APIKey: cfg.QdrantKey,
		UseTLS: cfg.QdrantHttps,
	})
	if err != nil {
		log.Fatalf("Konnte Qdrant Client nicht erstellen: %v", err)
	}
	defer qdrantClient.Close()

	mux := http.NewServeMux()

	// Routen
	mux.HandleFunc("/", healthHandler)
	mux.HandleFunc("/search", search.ImageSearchHandler(qdrantClient, cfg))

	port := cfg.Port
	if port == "" {
		port = "10000"
	}
	log.Printf("Server startet auf http://localhost:%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("Serverfehler: %v", err)
	}
}
