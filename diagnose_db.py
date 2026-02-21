import re
import os

def analyze_dump(file_path):
    output_lines = []
    if not os.path.exists(file_path):
        output_lines.append(f"File not found: {file_path}")
        return

    output_lines.append(f"Analyzing {file_path}...")
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Find all CREATE INDEX statements
    index_pattern = r'CREATE INDEX\s+(?:IF NOT EXISTS\s+)?(\w+)\s+ON\s+(?:ONLY\s+)?([\w.]+)\s+(?:USING\s+\w+\s+)?\((.*?)\)'
    indices = re.findall(index_pattern, content)

    table_indices = {}
    for name, table, cols in indices:
        cols_norm = ",".join([c.strip() for c in cols.split(",")])
        if table not in table_indices:
            table_indices[table] = []
        table_indices[table].append((name, cols_norm))

    output_lines.append("\n--- DUPLICATE INDEX ANALYSIS ---")
    for table, idx_list in table_indices.items():
        col_map = {}
        for name, cols in idx_list:
            if cols not in col_map:
                col_map[cols] = []
            col_map[cols].append(name)
        
        for cols, names in col_map.items():
            if len(names) > 1:
                output_lines.append(f"Table {table}: Duplicate indices found on columns ({cols}): {names}")

    # Find all CREATE POLICY statements
    policy_pattern = r'CREATE POLICY\s+"(.*?)"\s+ON\s+([\w.]+)'
    policies = re.findall(policy_pattern, content)
    
    table_policies = {}
    for name, table in policies:
        if table not in table_policies:
            table_policies[table] = []
        table_policies[table].append(name)

    output_lines.append("\n--- POLICY ANALYSIS ---")
    for table, pol_names in table_policies.items():
        if len(pol_names) > 1:
            output_lines.append(f"Table {table}: Multiple policies found: {pol_names}")

    with open("diagnose_results.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(output_lines))
    print("Results written to diagnose_results.txt")

if __name__ == "__main__":
    analyze_dump(r"c:\Users\eduso\Desktop\1\postgres_2026-02-21_142243.sql")
