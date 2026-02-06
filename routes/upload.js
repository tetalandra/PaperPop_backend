import express from 'express';
import multer from 'multer';
import path from 'path';
import { mkdir } from 'fs/promises';

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        // In a real separate FE/BE, this might be a cloud storage
        // For local dev where FE and BE are in the same parent, 
        // we can still upload to the public folder if we want to keep it simple,
        // or a new backend uploads folder.
        // The user wants it to keep working, so let's use a path relative to the project.
        const uploadDir = path.join(process.cwd(), '..', 'frontend', 'public', 'uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) { }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`);
    }
});

const upload = multer({ storage });

// @desc    Upload file
// @route   POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(201).json({
        success: true,
        url: `/uploads/${req.file.filename}`
    });
});

export default router;
