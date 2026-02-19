import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 0.8, // 1MB'ın altında tutmaya çalışalım
        maxWidthOrHeight: 1600, // HD kalitesi yeterli
        useWebWorker: true,
        initialQuality: 0.8
    };

    try {
        const compressedFile = await imageCompression(file, options);
        console.log(`[Image Compression] Original size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
        return compressedFile;
    } catch (error) {
        console.error("[Image Compression Error]", error);
        return file; // Hata durumunda orijinali döndür
    }
}
