package config

import (
	"fmt"
	"os"
	"strconv"
)

type AppConfig struct {
	CollectionName string
	QdrantHost     string
	QdrantPort     string
	QdrantKey      string
	QdrantHttps    bool
	Port           string
}

func LoadConfig() *AppConfig {
	collectionName, ok := os.LookupEnv("COLLECTION_NAME")
	if !ok {
		fmt.Println("Collection Name not set. Using default value: images")
		collectionName = "images"
	}

	qdrantHost, ok := os.LookupEnv("QDRANT_HOST")
	if !ok {
		fmt.Println("Use default Qdrant Hostname: localhost")
		qdrantHost = "localhost"
	}

	qdrantPort, ok := os.LookupEnv("QDRANT_PORT")
	if !ok {
		fmt.Println("Use default Qdrant Port: 6333")
		qdrantPort = "6333"
	}

	qdrantKey, ok := os.LookupEnv("QDRANT_API_KEY")
	if !ok {
		fmt.Println("Use default Key: None")
		qdrantKey = ""
	}

	qdrantHttpsEnv := os.Getenv("QDRANT_HTTPS")
	if qdrantHttpsEnv == "" {
		fmt.Println("QDRANT_HTTPS not set. Using default: true")
		qdrantHttpsEnv = "true"
	}

	qdrantHttps, err := strconv.ParseBool(qdrantHttpsEnv)
	if err != nil {
		fmt.Println("Failed to parse QDRANT_HTTPS. Using default value: true")
		qdrantHttps = true
	}

	port, ok := os.LookupEnv("PORT")
	if !ok {
		fmt.Println("Use default Key: None")
		port = "8080"
	}

	return &AppConfig{
		CollectionName: collectionName,
		QdrantHost:     qdrantHost,
		QdrantPort:     qdrantPort,
		QdrantKey:      qdrantKey,
		QdrantHttps:    qdrantHttps,
		Port:           port,
	}
}
