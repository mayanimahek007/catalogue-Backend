import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) { 
    cb(null, path.join(path.resolve(), 'public', 'images')); 
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
const singleUpload = upload.single('image');

// Public routes (for catalog display)
router.get('/', getAllCategories);
router.get('/:id', getCategory);

// Protected admin routes
router.post('/', authenticateToken, singleUpload, createCategory);
router.put('/:id', authenticateToken, singleUpload, updateCategory);
router.delete('/:id', authenticateToken, deleteCategory);

export default router;
