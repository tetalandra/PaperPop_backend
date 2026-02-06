import express from 'express';
import jwt from 'jsonwebtoken';
import Invitation from '../models/invitation.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'paperpop_secret_key_change_me';

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized' });
    }
};

// @desc    Get all user templates (aliases for invitations)
// @route   GET /api/templates
router.get('/', protect, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const [templates, total] = await Promise.all([
            Invitation.find({ user: req.user })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip),
            Invitation.countDocuments({ user: req.user })
        ]);

        res.json({
            success: true,
            count: templates.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: templates
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @desc    Search templates
// @route   GET /api/templates/search
router.get('/search', protect, async (req, res) => {
    try {
        const { q, type, variant } = req.query;
        let query = { user: req.user };

        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { subtitle: { $regex: q, $options: 'i' } }
            ];
        }

        if (type) query.templateType = type;
        if (variant) query.variant = parseInt(variant);

        const templates = await Invitation.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: templates.length, data: templates });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

export default router;
