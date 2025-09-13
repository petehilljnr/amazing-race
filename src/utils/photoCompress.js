
import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file (including HEIC) and converts it to a base64 string.
 * @param {File} file - The image file from input.
 * @param {number} maxSizeKB - Maximum size in KB (default 100).
 * @returns {Promise<File>} - Compressed image file.
 */
export async function prepareImage(file, maxSizeKB = 100) {
  let convertedFile = file;

  // Convert HEIC to JPEG if needed
  if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
    try {
      const blob = await heic2any({ blob: file, toType: 'image/jpeg' });
      convertedFile = new File([blob], file.name.replace(/\.heic$/, '.jpg'), { type: 'image/jpeg' });
    } catch (error) {
      console.error('HEIC conversion failed:', error);
      throw error;
    }
  }

  // Compress the image
  const options = {
    maxSizeMB: maxSizeKB / 1024,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(convertedFile, options);
    return compressedFile;
  } catch (error) {
    console.error('Compression failed:', error);
    throw error;
  }
}
