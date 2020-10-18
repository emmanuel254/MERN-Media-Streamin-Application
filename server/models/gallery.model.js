import mongoose from 'mongoose'

const GallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is required'
    },
    views: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    },
    photos: [{
        data: Buffer,
        contentType: String
    }],
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
})

export default mongoose.model('Gallery', GallerySchema)