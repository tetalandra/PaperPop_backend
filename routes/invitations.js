import express from 'express';
import jwt from 'jsonwebtoken';
import Invitation from '../models/invitation.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'paperpop_secret_key_change_me';

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// @desc    Get all user invitations
// @route   GET /api/invitations
router.get('/', protect, async (req, res) => {
    try {
        const invitations = await Invitation.find({ user: req.user }).sort({ createdAt: -1 });
        res.json({ success: true, count: invitations.length, data: invitations });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Create new invitation
// @route   POST /api/invitations
router.post('/', protect, async (req, res) => {
    try {
        const invitation = await Invitation.create({
            user: req.user,
            ...req.body
        });
        res.status(201).json({ success: true, data: invitation });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get single invitation
// @route   GET /api/invitations/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const invitation = await Invitation.findOne({ _id: req.params.id, user: req.user });
        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }
        res.json({ success: true, data: invitation });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update invitation
// @route   PUT /api/invitations/:id
router.put('/:id', protect, async (req, res) => {
    try {
        let invitation = await Invitation.findOne({ _id: req.params.id, user: req.user });
        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        invitation = await Invitation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: invitation });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Delete invitation
// @route   DELETE /api/invitations/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const invitation = await Invitation.findOne({ _id: req.params.id, user: req.user });
        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        await Invitation.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

export default router;
