package vectorizer

import (
	"fmt"

	"github.com/disintegration/imaging"
	"github.com/yalue/onnxruntime_go"
)

// ImageNet Konstanten für Normalisierung
var (
	mean = []float32{0.485, 0.456, 0.406}
	std  = []float32{0.229, 0.224, 0.225}
)

func VectorizeImage(imagePath string) ([]float32, error) {

	modelName := "dinov2.onnx"

	// 1. ONNX Runtime initialisieren
	// Hinweis: Du musst die passende Shared Library (onnxruntime.dll/so/dylib)
	onnxruntime_go.SetSharedLibraryPath("/usr/lib/libonnxruntime.so")
	err := onnxruntime_go.InitializeEnvironment()
	if err != nil {
		return nil, fmt.Errorf("Fehler beim Starten der ONNX Runtime: %v", err)
	}
	defer onnxruntime_go.DestroyEnvironment()

	// 2. Session erstellen und Modell laden
	session, err := onnxruntime_go.NewDynamicAdvancedSession(
		modelName,
		[]string{"input", "masks"},
		[]string{"output"},
		nil,
	)
	if err != nil {
		return nil, fmt.Errorf("Fehler beim Laden des Modells: %v", err)
	}
	defer session.Destroy()

	// 3. Bild laden und Preprocessing
	imgData, err := preprocessImage(imagePath)
	if err != nil {
		return nil, fmt.Errorf("Bildfehler: %v", err)
	}

	num_patches := 1369 // aus Fehlermeldung
	maskData := make([]bool, num_patches)
	for i := range maskData {
		maskData[i] = false
	}

	maskTensor, err := onnxruntime_go.NewTensor(
		onnxruntime_go.Shape{1, int64(num_patches)}, // <— anpassen, falls andere Shape!
		maskData,
	)
	if err != nil {
		return nil, fmt.Errorf("Masken-Tensor Fehler: %v", err)
	}
	defer maskTensor.Destroy()

	// 4. Inference
	// Input Tensor erstellen (Shape: 1 Batch, 3 Channels, 518 Height, 518 Width)
	inputTensor, err := onnxruntime_go.NewTensor(
		onnxruntime_go.Shape{1, 3, 518, 518}, imgData)
	if err != nil {
		return nil, fmt.Errorf("Tensor Fehler: %v", err)
	}
	defer inputTensor.Destroy()

	inputs := []onnxruntime_go.Value{inputTensor, maskTensor}

	// Output Slot vorbereiten
	outputs := []onnxruntime_go.Value{nil}

	err = session.Run(inputs, outputs)
	if err != nil {
		return nil, fmt.Errorf("Inference Fehler: %v", err)
	}

	outputTensor := outputs[0]
	defer outputTensor.Destroy()

	t := outputTensor.(*onnxruntime_go.Tensor[float32])
	embedding := t.GetData()

	return embedding, nil
}

func preprocessImage(path string) ([]float32, error) {
	// Bild öffnen
	src, err := imaging.Open(path)
	if err != nil {
		return nil, err
	}

	// Analog zu transforms.Resize(518) + CenterCrop(518)
	// Wir resizen so, dass die kleinste Seite 518 ist, dann croppen wir.
	img := imaging.Fill(src, 518, 518, imaging.Center, imaging.Lanczos)

	bounds := img.Bounds()
	width, height := bounds.Max.X, bounds.Max.Y

	// Array für den Tensor vorbereiten (BatchSize * Channels * H * W)
	// Hier BatchSize=1
	tensorData := make([]float32, 1*3*518*518)

	// Iteration über Pixel
	// PyTorch erwartet Planar Format (CHW): Erst alle Rot, dann alle Grün, dann alle Blau
	// Go image ist Interleaved (HWC): RGB, RGB, RGB
	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			r, g, b, _ := img.At(x, y).RGBA()

			// Go RGBA ist 0-65535, wir brauchen 0-1 float
			rFloat := float32(r) / 65535.0
			gFloat := float32(g) / 65535.0
			bFloat := float32(b) / 65535.0

			// Normalisierung: (value - mean) / std
			rNorm := (rFloat - mean[0]) / std[0]
			gNorm := (gFloat - mean[1]) / std[1]
			bNorm := (bFloat - mean[2]) / std[2]

			// Indizes berechnen für CHW Format
			// Index = (Channel * Height * Width) + (y * Width) + x
			pixelIndex := y*width + x

			tensorData[pixelIndex] = rNorm                  // Channel 0 (R)
			tensorData[pixelIndex+(width*height)] = gNorm   // Channel 1 (G)
			tensorData[pixelIndex+(2*width*height)] = bNorm // Channel 2 (B)
		}
	}

	return tensorData, nil
}
