with open(r'd:\A to Z prints\src\components\design\modes\TemplateFormDesigner.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

stack = []
pairs = {')': '(', '}': '{', ']': '['}
lines = code.split('\n')

for line_idx, line in enumerate(lines):
    line_num = line_idx + 1
    # Simple character scanning (ignoring strings and comments for a basic check, or just scan everything first)
    in_string = False
    string_char = None
    in_comment = False
    in_multiline_comment = False
    
    i = 0
    while i < len(line):
        char = line[i]
        
        # Multiline comments
        if in_multiline_comment:
            if char == '*' and i + 1 < len(line) and line[i+1] == '/':
                in_multiline_comment = False
                i += 2
                continue
            i += 1
            continue
            
        if not in_string and not in_comment:
            if char == '/' and i + 1 < len(line) and line[i+1] == '*':
                in_multiline_comment = True
                i += 2
                continue
            if char == '/' and i + 1 < len(line) and line[i+1] == '/':
                in_comment = True
                i += 2
                continue
                
        # String literals
        if char in ('\"', '\'', '`') and not in_comment and not in_multiline_comment:
            # Check if escaped
            escaped = False
            k = i - 1
            while k >= 0 and line[k] == '\\':
                escaped = not escaped
                k -= 1
            if not escaped:
                if in_string:
                    if char == string_char:
                        in_string = False
                else:
                    in_string = True
                    string_char = char
            i += 1
            continue
            
        if in_string or in_comment or in_multiline_comment:
            i += 1
            continue
            
        # Braces
        if char in ('(', '{', '['):
            stack.append((char, line_num, i + 1))
        elif char in (')', '}', ']'):
            if not stack:
                print(f"Extra closing '{char}' at line {line_num}:{i+1}")
            else:
                top_char, top_line, top_col = stack.pop()
                if pairs[char] != top_char:
                    print(f"Mismatch: '{char}' at line {line_num}:{i+1} matches '{top_char}' from line {top_line}:{top_col}")
                    
        i += 1

if stack:
    print("\nUnclosed brackets:")
    for char, line, col in stack:
        print(f"  '{char}' opened at line {line}:{col}")
