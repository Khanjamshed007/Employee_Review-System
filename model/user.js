const mongoose = require('mongoose');

// Creating the user Data
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee',
        required: true
    },
    assignedReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    ],
    reviewsFromOthers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);
module.exports = User;