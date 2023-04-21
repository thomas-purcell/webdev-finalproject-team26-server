import mongoose from 'mongoose';
import {
  likesSchema, mediaSchema, reviewsSchema, watchesSchema,
} from './mediaSchema.js';
import logger from '../../logger.js';

export const likesModel = mongoose.model('LikesModel', likesSchema);
export const watchesModel = mongoose.model('WatchesModel', watchesSchema);
export const reviewsModel = mongoose.model('ReviewsModel', reviewsSchema);
export const mediaModel = mongoose.model('MediaModel', mediaSchema);

export const getLikesByUserId = async (userId) => {
  const likes = await likesModel.find({ userId }).lean();
  return likes;
};

export const getWatchesByUserId = async (userId) => {
  const watches = await watchesModel.find({ userId }).lean();
  return watches;
};

export const getReviewsByUserId = async (userId) => {
  const reviews = await reviewsModel.find({ userId }).lean();
  return reviews;
};

export const getMediaByMediaId = async (mediaType, mediaId) => {
  const media = await mediaModel.findOne({ mediaType, mediaId }).lean();
  logger.info(media);
  return media;
};
