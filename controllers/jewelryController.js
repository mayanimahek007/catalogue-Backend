import Jewelry from '../models/Jewelry.js';
import Category from '../models/Category.js';

export const createJewelry = async (req, res) => {
  try {
    const data = req.body;
    let imageUrl = null;
    let videoUrl = null;
    
    if (req.files) {
      // Only set one media type based on what was uploaded
      if (req.files.image && req.files.image[0]) {
        imageUrl = '/images/' + req.files.image[0].filename;
      } else if (req.files.video && req.files.video[0]) {
        videoUrl = '/videos/' + req.files.video[0].filename;
      }
    }
    
    // Get category name from category ID
    let categoryname = '';
    if (data.category) {
      const category = await Category.findById(data.category);
      categoryname = category ? category.name : '';
    }

    const item = new Jewelry({
      name: data.name,
      categoryname: categoryname,
      category: data.category, // This should be the ObjectId of the category
      sku: data.sku,
      price: data.price,
      imageUrl: imageUrl,
      videoUrl: videoUrl
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const items = await Jewelry.find().populate('category').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getByCategory = async (req, res) => {
  try {
    const items = await Jewelry.find({ category: req.params.categoryId }).populate('category').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getByCategoryName = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const items = await Jewelry.find({ categoryname: categoryName }).populate('category').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const item = await Jewelry.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateJewelry = async (req, res) => {
  try {
    const data = req.body;
    let imageUrl = null;
    let videoUrl = null;
    
    if (req.files) {
      // Only set one media type based on what was uploaded
      if (req.files.image && req.files.image[0]) {
        imageUrl = '/images/' + req.files.image[0].filename;
      } else if (req.files.video && req.files.video[0]) {
        videoUrl = '/videos/' + req.files.video[0].filename;
      }
    }
    
    // Get category name from category ID
    let categoryname = '';
    if (data.category) {
      const category = await Category.findById(data.category);
      categoryname = category ? category.name : '';
    }

    const update = {
      name: data.name,
      categoryname: categoryname,
      category: data.category, // This should be the ObjectId of the category
      sku: data.sku,
      price: data.price,
    };
    
    // Only update media if new media was uploaded
    if (imageUrl) {
      update.imageUrl = imageUrl;
      update.videoUrl = null; // Clear video if image is uploaded
    } else if (videoUrl) {
      update.videoUrl = videoUrl;
      update.imageUrl = null; // Clear image if video is uploaded
    }
    
    const item = await Jewelry.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteJewelry = async (req, res) => {
  try {
    await Jewelry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
