const mongoose = require("mongoose");

const ChunkSchema = new mongoose.Schema({
    files_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'photos.files'
    },
    data: {
        type: mongoose.Schema.Types.Buffer
    }
})

const PhotoSchema = new mongoose.Schema({
    filename: {
        type: String
    },
    contentType: {
        type: String
    },
    _id: {
        type: mongoose.Schema.Types.ObjectId
    }
});

const PhotoCol = mongoose.model('photos.files', PhotoSchema);
const ChunkCol = mongoose.model('photos.chunks', ChunkSchema);

module.exports = {
    PhotoCol,
    ChunkCol
}