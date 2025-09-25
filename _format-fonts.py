# Read fonts.txt (each font on its own line)
with open("fonts.txt", "r", encoding="utf-8") as f:
    fonts = [line.strip() for line in f if line.strip()]

# Save as JSON
import json
with open("fonts.json", "w", encoding="utf-8") as f:
    json.dump(fonts, f, indent=2, ensure_ascii=False)

print("fonts.json created with", len(fonts), "fonts.")

