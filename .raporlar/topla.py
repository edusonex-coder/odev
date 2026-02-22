#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OdevGPT Proje Dosyalarını Topla ve tum.txt Dosyasına Yaz
"""

import os
from pathlib import Path
from datetime import datetime

# Proje kök dizini (.raporlar klasörünün bir üst dizini)
ROOT_DIR = Path(__file__).parent.parent

# İçerik toplanacak dosya uzantıları
INCLUDE_EXTENSIONS = {
    '.ts', '.tsx', '.js', '.jsx', 
    '.sql', '.json', '.md',
    '.css', '.html', '.py',
    '.yaml', '.yml', '.toml'
}

# Hariç tutulacak dizinler
EXCLUDE_DIRS = {
    'node_modules', '.git', 'dist', 'build', 
    '.vite', '.cache', 'coverage', '.gemini',
    '__pycache__', '.next', 'out', '.vercel',
    '.raporlar'  # Raporlar klasörünü hariç tut
}

# Hariç tutulacak dosyalar
EXCLUDE_FILES = {
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    'tum.txt', 'topla.py', '.DS_Store'
}

def should_include_file(file_path: Path) -> bool:
    """Dosyanın dahil edilip edilmeyeceğini kontrol et"""
    # Uzantı kontrolü
    if file_path.suffix not in INCLUDE_EXTENSIONS:
        return False
    
    # Dosya adı kontrolü
    if file_path.name in EXCLUDE_FILES:
        return False
    
    # Dizin kontrolü
    for part in file_path.parts:
        if part in EXCLUDE_DIRS:
            return False
    
    return True

def collect_files(root_dir: Path) -> list:
    """Tüm uygun dosyaları topla"""
    files = []
    for file_path in root_dir.rglob('*'):
        if file_path.is_file() and should_include_file(file_path):
            files.append(file_path)
    return sorted(files)

def write_summary(output_file: Path, files: list):
    """Dosyaları tum.txt'ye yaz"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("ODEVGPT PROJE DOSYALARI ÖZETİ\n")
        f.write(f"Oluşturulma Tarihi: {datetime.now().strftime('%d %B %Y - %H:%M')}\n")
        f.write("=" * 80 + "\n\n")
        
        # Dosya listesi
        f.write(f"TOPLAM {len(files)} DOSYA\n\n")
        
        # Kategorilere göre grupla
        categories = {}
        for file_path in files:
            rel_path = file_path.relative_to(ROOT_DIR)
            category = rel_path.parts[0] if len(rel_path.parts) > 1 else 'root'
            if category not in categories:
                categories[category] = []
            categories[category].append(rel_path)
        
        # Kategori özetleri
        f.write("KATEGORİLER:\n")
        for category, cat_files in sorted(categories.items()):
            f.write(f"  {category}: {len(cat_files)} dosya\n")
        f.write("\n" + "=" * 80 + "\n\n")
        
        # Her dosyanın içeriği
        for file_path in files:
            rel_path = file_path.relative_to(ROOT_DIR)
            f.write(f"\n{'=' * 80}\n")
            f.write(f"DOSYA: {rel_path}\n")
            f.write(f"{'=' * 80}\n\n")
            
            try:
                with open(file_path, 'r', encoding='utf-8') as source_file:
                    content = source_file.read()
                    f.write(content)
                    if not content.endswith('\n'):
                        f.write('\n')
            except Exception as e:
                f.write(f"[HATA: {e}]\n")
            
            f.write("\n")

def main():
    print("🔍 OdevGPT proje dosyaları toplanıyor...")
    
    files = collect_files(ROOT_DIR)
    output_file = Path(__file__).parent / 'tum.txt'
    
    print(f"📁 {len(files)} dosya bulundu")
    print(f"📝 {output_file} dosyasına yazılıyor...")
    
    write_summary(output_file, files)
    
    print(f"✅ Tamamlandı! Toplam boyut: {output_file.stat().st_size / 1024:.2f} KB")
    print(f"📄 Dosya: {output_file}")

if __name__ == '__main__':
    main()
