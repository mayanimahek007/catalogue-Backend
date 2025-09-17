import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createJewelry,
  getAll,
  getByCategory,
  getByCategoryName,
  getOne,
  updateJewelry,
  deleteJewelry
} from '../controllers/jewelryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) { 
    // Determine destination based on file type
    if (file.fieldname === 'image') {
      cb(null, path.join(path.resolve(), 'public', 'images')); 
    } else if (file.fieldname === 'video') {
      cb(null, path.join(path.resolve(), 'public', 'videos')); 
    } else {
      cb(null, path.join(path.resolve(), 'public', 'images')); // default to images
    }
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + ext;
    cb(null, uniqueName);
  }
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    // Allow only image files (including WebP)
    if (file.mimetype.startsWith('image/') || file.mimetype === 'image/webp') {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for image field'), false);
    }
  } else if (file.fieldname === 'video') {
    // Allow only video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed for video field'), false);
    }
  } else {
    cb(new Error('Invalid field name'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

const multiUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Public routes (for catalog display)
router.get('/', getAll);
router.get('/category/:categoryId', getByCategory);
router.get('/category-name/:categoryName', getByCategoryName);
router.get('/:id', getOne);

// Protected admin routes
router.post('/', authenticateToken, multiUpload, handleMulterError, createJewelry);
router.put('/:id', authenticateToken, multiUpload, handleMulterError, updateJewelry);
router.delete('/:id', authenticateToken, deleteJewelry);

export default router;
