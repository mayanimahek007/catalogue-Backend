import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

/**
 * Converts an image to WebP format and deletes the original file
 * @param {string} inputPath - Path to the original image file
 * @param {string} outputDir - Directory where WebP file should be saved
 * @param {Object} options - Sharp processing options
 * @returns {Promise<string>} - Path to the converted WebP file
 */
export const convertToWebP = async (inputPath, outputDir, options = {}) => {
  try {
    // Generate output filename with .webp extension
    const originalName = path.basename(inputPath, path.extname(inputPath));
    const outputFilename = `${originalName}.webp`;
    const outputPath = path.join(outputDir, outputFilename);

    // Default Sharp options for WebP conversion
    const defaultOptions = {
      quality: 85, // Good balance between quality and file size
      effort: 4,   // Compression effort (0-6, higher = better compression but slower)
      ...options
    };

    // Convert image to WebP
    await sharp(inputPath)
      .webp(defaultOptions)
      .toFile(outputPath);

    // Delete the original file
    await fs.unlink(inputPath);

    console.log(`Successfully converted ${inputPath} to WebP and deleted original`);
    
    return outputPath;
  } catch (error) {
    console.error('Error converting image to WebP:', error);
    throw new Error(`Failed to convert image to WebP: ${error.message}`);
  }
};

/**
 * Processes multiple images and converts them to WebP
 * @param {Array} imagePaths - Array of image file paths
 * @param {string} outputDir - Directory where WebP files should be saved
 * @param {Object} options - Sharp processing options
 * @returns {Promise<Array>} - Array of converted WebP file paths
 */
export const convertMultipleToWebP = async (imagePaths, outputDir, options = {}) => {
  const convertedPaths = [];
  
  for (const imagePath of imagePaths) {
    try {
      const convertedPath = await convertToWebP(imagePath, outputDir, options);
      convertedPaths.push(convertedPath);
    } catch (error) {
      console.error(`Failed to convert ${imagePath}:`, error);
      // Continue with other images even if one fails
    }
  }
  
  return convertedPaths;
};

/**
 * Validates if a file is a supported image format
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - True if file is a supported image
 */
export const isSupportedImage = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    return ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'webp'].includes(metadata.format);
  } catch (error) {
    return false;
  }
};

/**
 * Gets image metadata
 * @param {string} filePath - Path to the image file
 * @returns {Promise<Object>} - Image metadata
 */
export const getImageMetadata = async (filePath) => {
  try {
    return await sharp(filePath).metadata();
  } catch (error) {
    throw new Error(`Failed to get image metadata: ${error.message}`);
  }
};
