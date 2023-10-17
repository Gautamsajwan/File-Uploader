import mongoose, { Schema } from 'mongoose'

const DocSchema = new Schema({
    fileName: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    uploadTimestamp: {
        type: Date,
        required: true,
        default: Date.now,
    },
    storageLocation: {
        type: String,
        required: true,
    },
    assetURL: {
        type: String,
    },
    assetPublicId: {
        type: String,
    },
})

const Doc = new mongoose.model('ResumeData', DocSchema)
export default Doc