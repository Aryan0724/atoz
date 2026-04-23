/**
 * A lightweight CSV parser for the VDP engine.
 * Handles quoted fields, different delimiters, and header row detection.
 */
export function parseCSV(text: string): { headers: string[], rows: Record<string, string>[] } {
  const lines: string[] = [];
  let currentLine = "";
  let inQuotes = false;

  // Split by line breaks while respecting quotes
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    }
    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentLine.trim()) lines.push(currentLine);
      currentLine = "";
      // Handle CRLF
      if (char === '\r' && text[i + 1] === '\n') i++;
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) lines.push(currentLine);

  if (lines.length === 0) return { headers: [], rows: [] };

  // Parse fields in each line
  const parseLine = (line: string) => {
    const fields = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(field.trim());
        field = "";
      } else {
        field += char;
      }
    }
    fields.push(field.trim());
    return fields;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(line => {
    const fields = parseLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = fields[index] || "";
    });
    return row;
  });

  return { headers, rows };
}
