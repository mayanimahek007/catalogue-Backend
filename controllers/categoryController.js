import Category from '../models/Category.js';

export const createCategory = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.imageUrl = '/images/' + req.file.filename;
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
      data.imageUrl = '/images/' + req.file.filename;
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
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
