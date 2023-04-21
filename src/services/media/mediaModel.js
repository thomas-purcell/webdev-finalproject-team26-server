import * as mediaDao from './mediaDao.js';

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
