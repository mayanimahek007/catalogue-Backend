import Category from '../models/Category.js';
import { convertToWebP, deleteFile } from '../utils/imageProcessor.js';
import path from 'path';

export const createCategory = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      // Convert image to WebP format
      const originalPath = req.file.path;
      const outputDir = path.dirname(originalPath);
      
      try {
        const webpPath = await convertToWebP(originalPath, outputDir, {
          quality: 85,
          effort: 4
        });
        
        // Update imageUrl to point to WebP file
        const webpFilename = path.basename(webpPath);
        data.imageUrl = '/images/' + webpFilename;
      } catch (conversionError) {
        console.error('WebP conversion failed:', conversionError);
        // Fallback to original file if conversion fails
        data.imageUrl = '/images/' + req.file.filename;
      }
    }
    
    const category = new Category({
      name: data.name,
      imageUrl: data.imageUrl,
      description: data.description
    });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      // Convert image to WebP format
      const originalPath = req.file.path;
      const outputDir = path.dirname(originalPath);
      
      try {
        const webpPath = await convertToWebP(originalPath, outputDir, {
          quality: 85,
          effort: 4
        });
        
        // Update imageUrl to point to WebP file
        const webpFilename = path.basename(webpPath);
        data.imageUrl = '/images/' + webpFilename;
      } catch (conversionError) {
        console.error('WebP conversion failed:', conversionError);
        // Fallback to original file if conversion fails
        data.imageUrl = '/images/' + req.file.filename;
      }
    }
    
    const update = {
      name: data.name,
      description: data.description
    };
    if (data.imageUrl) update.imageUrl = data.imageUrl;
    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    // First, get the category to access its image URL
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Delete the category from database
    await Category.findByIdAndDelete(req.params.id);
    
    // Delete the associated image file if it exists
    if (category.imageUrl) {
      try {
        await deleteFile(category.imageUrl);
        console.log(`Deleted category image: ${category.imageUrl}`);
      } catch (error) {
        console.error(`Failed to delete category image: ${category.imageUrl}`, error);
        // Don't fail the request if image deletion fails
      }
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
