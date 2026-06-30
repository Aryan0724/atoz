import json
with open(r'd:\A to Z prints\scratch\import_data_id.json') as f:
    data = json.load(f)

print("Variants:", len(data["variants"]))
print("Mappings keys:", len(data["mappings"]))
print()
for i in range(3):
    m = data["mappings"][f"{i}_0"]
    print(f"Card {i+1} front fields: {sorted(m.keys())}")
    print(f"  name:  y={m.get('name', {}).get('y', 'N/A')}%")
    print(f"  desig: y={m.get('designation', {}).get('y', 'N/A')}%")
    print(f"  photo: y={m.get('photo', {}).get('y', 'N/A')}%")
    print(f"  logo:  y={m.get('logo', {}).get('y', 'N/A')}%")
    print()
