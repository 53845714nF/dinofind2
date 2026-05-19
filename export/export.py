import torch
from torch import hub

# 1. Modell laden
dinov2 = hub.load('facebookresearch/dinov2', 'dinov2_vitb14_reg')
dinov2.eval()

# 2. Dummy Input erstellen
dummy_input = torch.randn(1, 3, 518, 518)

# HIER WIRD ES ALS TUPEl VERPACKT
model_inputs = (dummy_input,) 

# 3. Export zu ONNX
output_file = "dinov2_3.onnx"
torch.onnx.export(
    dinov2,
    model_inputs,  # <--- Verwende das explizite Tupel hier
    output_file,
    export_params=True,
    opset_version=23,
    do_constant_folding=True,
    input_names=['input', 'masks'],
    output_names=['output'],
    dynamic_axes={
        'input': {0: 'batch_size'}, 
        'output': {0: 'batch_size'}
    },
    dynamo=False  # Wichtig, um den alten Exporter zu nutzen und den Fehler zu umgehen
)

print(f"Modell gespeichert als {output_file}")