import * as mediaDao from './mediaDao.js';
import * as accountModel from '../accounts/accountModel.js';
import logger from '../../logger.js';

export const getLikesByUser = async (userId) => {
  const likes = await mediaDao.getLikesByUserId(userId);
  return likes.map((l) => ({ ...l, liked: true }));
};

export const getWatchesByUser = async (userId) => {
  const watches = await mediaDao.getWatchesByUserId(userId);
  return watches.map((w) => ({ ...w, watched: true }));
};

export const getReviewsByUser = async (userId) => {
  const reviews = await mediaDao.getReviewsByUserId(userId);
  return reviews.map((w) => ({ ...w, reviewed: true }));
};

export const getMediaByMediaId = async (mediaType, mediaId) => {
  const media = await mediaDao.getMediaByMediaId(mediaType, mediaId);
  return media;
};

export const getAverageRatingByMediaId = async (mediaType, mediaId) => {
  const reviews = await mediaDao.getReviewsByMediaId(mediaType, mediaId);
  const ratingTotal = reviews.reduce((sum, r) => sum + r.rating, 0);
  return ratingTotal / reviews.length;
};

export const addWatchByUserIdMediaId = async (mediaType, mediaId, userId) => {
  const result = await mediaDao.addWatchByUserIdMediaId(mediaType, mediaId, userId);
  return result;
};

export const deleteWatchByUserIdMediaId = async (mediaType, mediaId, userId) => {
  const result = await mediaDao.deleteWatchByUserIdMediaId(mediaType, mediaId, userId);
  return result;
};

export const addLikeByUserIdMediaId = async (mediaType, mediaId, userId) => {
  const result = await mediaDao.addLikeByUserIdMediaId(mediaType, mediaId, userId);
  return result;
};

export const deleteLikeByUserIdMediaId = async (mediaType, mediaId, userId) => {
  const result = await mediaDao.deleteLikeByUserIdMediaId(mediaType, mediaId, userId);
  return result;
};

export const addReviewByUserIdMediaId = async (mediaType, mediaId, userId, review) => {
  const newReview = {
    mediaId,
    mediaType,
    rating: 0,
    comment: '',
    userId,
    ...review,
    timestamp: (new Date()).getTime().toString(),
  };
  logger.info(newReview);
  const result = await mediaDao.addReviewByUserIdMediaId(mediaType, mediaId, userId, newReview);
  return result;
};

export const addMedia = async (media) => {
  const result = await mediaDao.addMedia(media);
  return result;
};

export const getReviewsByMediaId = async (mediaType, mediaId) => {
  const result = await mediaDao.getReviewsByMediaId(mediaType, mediaId);
  const enrichedResults = await Promise.all(result.map(async (media) => {
    const { username } = await accountModel.getAccountById(media.userId);
    return {
      ...media,
      username,
    };
  }));
  return enrichedResults;
};
