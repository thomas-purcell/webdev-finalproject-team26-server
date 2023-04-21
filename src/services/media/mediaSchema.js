import mongoose from 'mongoose';

export const likesSchema = mongoose.Schema({
  mediaId: String,
  mediaType: String,
  userId: String,
}, { collection: 'likes' });

export const watchesSchema = mongoose.Schema({
  mediaId: String,
  mediaType: String,
  userId: String,
}, { collection: 'watches' });

export const reviewsSchema = mongoose.Schema({
  mediaId: String,
  mediaType: String,
  userId: String,
  comment: String,
  rating: Number,
  timestamp: String,
}, { collection: 'reviews' });

export const mediaSchema = mongoose.Schema({
  mediaId: String,
  mediaType: String,
  title: String,
  poster: String,
  year: Number,
}, { collection: 'media' });
