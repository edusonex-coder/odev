/**
 * ADVANCED OCR SERVICE
 * 
 * Hybrid OCR sistemi:
 * - Tesseract.js: Genel metin tanıma
 * - Mathpix API: Matematik formülleri ve denklemler
 * - Otomatik seçim: İçerik tipine göre en uygun OCR'ı kullanır
 */

import Tesseract from 'tesseract.js';

// Mathpix API configuration
const MATHPIX_APP_ID = import.meta.env.VITE_MATHPIX_APP_ID;
const MATHPIX_APP_KEY = import.meta.env.VITE_MATHPIX_APP_KEY;
const MATHPIX_API_URL = 'https://api.mathpix.com/v3/text';

export interface OCRResult {
    text: string;
    latex?: string;
    confidence: number;
    method: 'tesseract' | 'mathpix';
    processingTime: number;
}

export interface OCROptions {
    preferMath?: boolean; // Matematik içerik bekleniyor mu?
    language?: string; // 'tur', 'eng', 'auto'
    enhanceImage?: boolean; // Görüntü iyileştirme yapılsın mı?
}

/**
 * Görüntüde matematik içeriği olup olmadığını tespit eder
 */
function detectMathContent(file: File): boolean {
    // Basit heuristik: Dosya adında "math", "matematik", "formül" gibi kelimeler var mı?
    const fileName = file.name.toLowerCase();
    const mathKeywords = ['math', 'matematik', 'formül', 'denklem', 'equation', 'formula'];

    return mathKeywords.some(keyword => fileName.includes(keyword));
}

/**
 * Görüntüyü ön işleme tabi tutar (kontrast, parlaklık, gürültü azaltma)
 */
async function preprocessImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Canvas context not available'));
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;

                // Görüntüyü çiz
                ctx.drawImage(img, 0, 0);

                // Kontrast ve parlaklık ayarı
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                const contrast = 1.2; // %20 kontrast artışı
                const brightness = 10; // 10 birim parlaklık artışı

                for (let i = 0; i < data.length; i += 4) {
                    // RGB kanallarını ayarla
                    data[i] = Math.min(255, Math.max(0, contrast * (data[i] - 128) + 128 + brightness));
                    data[i + 1] = Math.min(255, Math.max(0, contrast * (data[i + 1] - 128) + 128 + brightness));
                    data[i + 2] = Math.min(255, Math.max(0, contrast * (data[i + 2] - 128) + 128 + brightness));
                }

                ctx.putImageData(imageData, 0, 0);

                // Base64 olarak döndür
                resolve(canvas.toDataURL('image/png'));
            };

            img.onerror = () => reject(new Error('Image loading failed'));
            img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('File reading failed'));
        reader.readAsDataURL(file);
    });
}

/**
 * Tesseract.js ile OCR yapar
 */
async function runTesseractOCR(file: File, language: string = 'tur'): Promise<OCRResult> {
    const startTime = Date.now();

    try {
        const { data } = await Tesseract.recognize(file, language, {
            logger: (m) => console.log('[Tesseract]', m),
        });

        const processingTime = Date.now() - startTime;

        return {
            text: data.text,
            confidence: data.confidence,
            method: 'tesseract',
            processingTime,
        };
    } catch (error) {
        console.error('Tesseract OCR error:', error);
        throw new Error('Tesseract OCR failed');
    }
}

/**
 * Mathpix API ile matematik OCR yapar
 */
async function runMathpixOCR(file: File): Promise<OCRResult> {
    const startTime = Date.now();

    if (!MATHPIX_APP_ID || !MATHPIX_APP_KEY) {
        throw new Error('Mathpix API credentials not configured');
    }

    try {
        // Dosyayı base64'e çevir
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // "data:image/png;base64," kısmını kaldır
                const base64Data = result.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        // Mathpix API'ye istek gönder
        const response = await fetch(MATHPIX_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'app_id': MATHPIX_APP_ID,
                'app_key': MATHPIX_APP_KEY,
            },
            body: JSON.stringify({
                src: `data:image/png;base64,${base64}`,
                formats: ['text', 'latex_styled'],
                ocr: ['math', 'text'],
            }),
        });

        if (!response.ok) {
            throw new Error(`Mathpix API error: ${response.status}`);
        }

        const data = await response.json();
        const processingTime = Date.now() - startTime;

        return {
            text: data.text || '',
            latex: data.latex_styled || data.latex || undefined,
            confidence: data.confidence || 0.95,
            method: 'mathpix',
            processingTime,
        };
    } catch (error) {
        console.error('Mathpix OCR error:', error);
        throw new Error('Mathpix OCR failed');
    }
}

/**
 * Hybrid OCR: En uygun yöntemi seçer ve OCR yapar
 */
export async function performOCR(
    file: File,
    options: OCROptions = {}
): Promise<OCRResult> {
    const {
        preferMath = false,
        language = 'tur',
        enhanceImage = true,
    } = options;

    // Görüntü iyileştirme
    let processedFile = file;
    if (enhanceImage) {
        try {
            const enhancedDataUrl = await preprocessImage(file);
            const blob = await fetch(enhancedDataUrl).then(r => r.blob());
            processedFile = new File([blob], file.name, { type: 'image/png' });
        } catch (error) {
            console.warn('Image preprocessing failed, using original:', error);
        }
    }

    // Matematik içeriği tespiti
    const hasMathContent = preferMath || detectMathContent(file);

    // Mathpix kullanılabilir mi?
    const mathpixAvailable = !!(MATHPIX_APP_ID && MATHPIX_APP_KEY);

    // Strateji seçimi
    if (hasMathContent && mathpixAvailable) {
        console.log('🔢 Using Mathpix OCR for math content');
        try {
            return await runMathpixOCR(processedFile);
        } catch (error) {
            console.warn('Mathpix failed, falling back to Tesseract:', error);
            return await runTesseractOCR(processedFile, language);
        }
    } else {
        console.log('📝 Using Tesseract OCR for general text');
        return await runTesseractOCR(processedFile, language);
    }
}

/**
 * Çoklu dosya için OCR yapar
 */
export async function performBatchOCR(
    files: File[],
    options: OCROptions = {}
): Promise<OCRResult[]> {
    const results: OCRResult[] = [];

    for (const file of files) {
        try {
            const result = await performOCR(file, options);
            results.push(result);
        } catch (error) {
            console.error(`OCR failed for ${file.name}:`, error);
            results.push({
                text: '',
                confidence: 0,
                method: 'tesseract',
                processingTime: 0,
            });
        }
    }

    return results;
}

/**
 * OCR sonucunu formatlar (LaTeX varsa gösterir)
 */
export function formatOCRResult(result: OCRResult): string {
    let formatted = result.text;

    if (result.latex) {
        formatted += '\n\n--- LaTeX Formatı ---\n' + result.latex;
    }

    formatted += `\n\n[OCR Yöntemi: ${result.method.toUpperCase()}, Güven: ${(result.confidence * 100).toFixed(1)}%, Süre: ${result.processingTime}ms]`;

    return formatted;
}
