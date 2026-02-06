import mongoose from 'mongoose';

const InvitationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
    },
    subtitle: {
        type: String,
        trim: true,
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    location: {
        type: String,
    },
    phone: {
        type: String,
    },
    message: {
        type: String,
    },
    templateType: {
        type: String,
        required: true,
        enum: ['birthday', 'assembly', 'announcement', 'achievement', 'remembering', 'valentine'],
        default: 'birthday',
    },
    variant: {
        type: Number,
        required: true,
        default: 1,
    },
    image: {
        type: String,
    },
    backgroundImage: {
        type: String,
    },
    backgroundType: {
        type: String,
        default: 'color',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Invitation || mongoose.model('Invitation', InvitationSchema);
