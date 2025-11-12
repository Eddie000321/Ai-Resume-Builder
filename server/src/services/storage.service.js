import { mongo } from 'mongoose';
import mongoose from 'mongoose';

let bucket;

function getBucket() {
  if (!bucket) {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'resumes' });
  }
  return bucket;
}

export async function saveFile(filename, stream) {
  return new Promise((resolve, reject) => {
    const uploadStream = getBucket().openUploadStream(filename);
    stream.pipe(uploadStream).on('finish', () => resolve(uploadStream.id.toString())).on('error', reject);
  });
}

export async function deleteFile(fileId) {
  return getBucket().delete(new mongo.ObjectId(fileId));
}
