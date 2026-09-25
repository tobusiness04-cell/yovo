/**
 * Client-side Image Optimization and Compression Utility
 * Reads images from local device, resizes them proportionally,
 * and converts them into optimized WebP/JPEG data URLs suitable
 * for instant storage in Firestore without external hosting dependencies.
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  mimeType?: 'image/webp' | 'image/jpeg' | 'image/png';
}

/**
 * Compresses and resizes an image file from user's device
 */
export async function compressAndOptimizeImage(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<{ dataUrl: string; sizeBytes: number; originalSizeBytes: number; width: number; height: number }> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.82,
    mimeType = 'image/webp',
  } = options;

  return new Promise((resolve, reject) => {
    // Basic file validation
    if (!file.type.startsWith('image/')) {
      return reject(new Error('الملف المختار ليس صورة صالحة. يرجى اختيار ملف صورة (PNG, JPG, WEBP, SVG).'));
    }

    // If SVG, read as text/dataURL directly without canvas rasterization
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve({
          dataUrl: result,
          sizeBytes: file.size,
          originalSizeBytes: file.size,
          width: 400,
          height: 400,
        });
      };
      reader.onerror = () => reject(new Error('فشل قراءة ملف SVG.'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('تعذر معالجة الصورة على جهازك.'));
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to WebP, fallback to JPEG if browser doesn't support WebP
        let compressedDataUrl = canvas.toDataURL(mimeType, quality);
        if (!compressedDataUrl.startsWith('data:image/webp') && mimeType === 'image/webp') {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // Estimate size in bytes
        const stringLength = compressedDataUrl.length - 'data:image/webp;base64,'.length;
        const sizeBytes = Math.round((stringLength * 3) / 4);

        resolve({
          dataUrl: compressedDataUrl,
          sizeBytes,
          originalSizeBytes: file.size,
          width,
          height,
        });
      };

      img.onerror = () => reject(new Error('تعذر فك تشفير بيانات الصورة.'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('فشل تحميل الصورة من جهازك.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes into human-readable text (e.g. 45 KB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}
