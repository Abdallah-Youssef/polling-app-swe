const mongoose = require("mongoose");
const { PhotoCol, ChunkCol } = require("./models/photo_schema");

const downloadPhoto = async (photoId) => {
    if(!photoId) return null;

  const doc = await PhotoCol.findOne({ _id: photoId });
  if(!doc) return null;

  const chunksRecords = await ChunkCol.find({ files_id: photoId });
    if(!chunksRecords) return null;
  let arr = [];

  for (let rec of chunksRecords) {
    arr.push(rec.data.toString("base64"));
  }

  let data = "data:" + doc.contentType + ";base64," + arr.join("");
  return data;
};

module.exports = {
    downloadPhoto
}