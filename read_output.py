import sys

with open('doctor_output.txt', 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if 'KRİTİK HATA' in line or 'Mismatch' in line or 'HATA' in line:
            print(line.strip())
