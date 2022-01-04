const mongoose = require("mongoose");
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')

const config = require('config');
const bodyParser = require("body-parser");

mongoose.set('useFindAndModify', false);
mongoose.connect(
    config.get('DBHost'),
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: config.get('DBuserName'),
        pass: config.get('DBpass')
    },
    (err) => {
        if (err) {
            console.error(err);
            throw new Error("Error Connecting to Database");
        }
        console.log("Connected to DB " + config.get('DBHost'))
    }
);



const photoStorage = new GridFsStorage({
  db: mongoose.connection,
  file: (req, file) => {
    return {
      bucketName: "photos",
      disableMD5: true,
    };
  },
});


// Just add the photoUpload.single('field-name') middleware on POST endpoints which need photo upload
const photoUpload = multer({
  storage: photoStorage,
  fileFilter: (req, file, next) => {
    const allowedMimeTypes = ["image/jpeg", "image/png"];
    if (allowedMimeTypes.indexOf(file.mimetype) === -1)
      return next("not allowed mime", false);
    return next(null, true);
  },
});

module.exports = {
    photoUpload
};