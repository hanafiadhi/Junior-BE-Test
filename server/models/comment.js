const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Comment', CommentsSchema)