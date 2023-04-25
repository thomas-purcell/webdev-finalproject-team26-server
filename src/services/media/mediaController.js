/* eslint-disable no-underscore-dangle */
import * as mediaModel from './mediaModel.js';
import * as accountModel from '../accounts/accountModel.js';
// eslint-disable-next-line no-unused-vars
import logger from '../../logger.js';

const likesByUserHandler = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await accountModel.getUserByUsername(username);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    const likes = await mediaModel.getLikesByUser(user._id);
    res.send(likes);
  } catch (e) {
    next(e);
  }
};

const watchesByUserHandler = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await accountModel.getUserByUsername(username);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    const watches = await mediaModel.getWatchesByUser(user._id);
    res.send(watches);
  } catch (e) {
    next(e);
  }
};

const mediaByUserHandler = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await accountModel.getUserByUsername(username);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    const [likes, watches, reviews, discussing] = await Promise.all([
      mediaModel.getLikesByUser(user._id),
      mediaModel.getWatchesByUser(user._id),
      mediaModel.getReviewsByUser(user._id),
      mediaModel.getDiscussingByUser(user._id),
    ]);
    const media = likes.map((l) => ({
      ...l, liked: true, watched: false, reviewed: false, discussing: false,
    }));
    watches.forEach((watchedMedia) => {
      if (!media.map((m) => m.mediaId).includes(watchedMedia.mediaId)) {
        media.push({
          ...watchedMedia, watched: true, liked: false, reviewed: false, discussing: false,
        });
      } else {
        const watchedIdx = media.findIndex((m) => m.mediaId === watchedMedia.mediaId);
        media[watchedIdx].watched = true;
      }
    });
    reviews.forEach((reviewedMedia) => {
      if (!media.map((m) => m.mediaId).includes(reviewedMedia.mediaId)) {
        media.push({
          ...reviewedMedia, watched: false, liked: false, reviewed: true, discussing: false,
        });
      } else {
        const reviewedIdx = media.findIndex((m) => m.mediaId === reviewedMedia.mediaId);
        const reviewed = media[reviewedIdx];
        reviewed.reviewed = true;
        reviewed.rating = reviewedMedia.rating;
        reviewed.comment = reviewedMedia.comment;
      }
    });
    discussing.forEach((discussingMedia) => {
      if (!media.map((m) => m.mediaId).includes(discussingMedia.mediaId)) {
        media.push({
          ...discussingMedia, watched: false, liked: false, reviewed: false, discussing: true,
        });
      } else {
        const discussingIdx = media.findIndex((m) => m.mediaId === discussingMedia.mediaId);
        media[discussingIdx].discussing = true;
        media[discussingIdx].discussionDate = discussingMedia.discussionDate;
      }
    });
    res.send(media);
  } catch (e) {
    next(e);
  }
};

const mediaByMediaIdHandler = async (req, res, next) => {
  try {
    const { mediaType, mediaId } = req.params;
    const [media, rating] = await Promise.all([
      mediaModel.getMediaByMediaId(mediaType, mediaId),
      mediaModel.getAverageRatingByMediaId(mediaType, mediaId),
    ]);
    if (!media) {
      res.sendStatus(404);
    } else {
      res.send({ ...media, avgRating: rating });
    }
  } catch (e) {
    next(e);
  }
};

const mediaByUsernameMediaIdHandler = async (req, res, next) => {
  try {
    const { mediaType, mediaId, username } = req.params;
    const user = await accountModel.getUserByUsername(username);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    const result = await mediaModel.getMediaByUsernameMediaId(mediaType, mediaId, user._id);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const addWatchByUsernameMediaIdHandler = async (req, res, next) => {
  try {
    const { username, mediaType, mediaId } = req.params;
    if (!(await accountModel.checkCookie(req.cookies.user_session, username))) {
      res.sendStatus(403);
      return;
    }
    const user = await accountModel.getUserByUsername(username);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    await mediaModel.addWatchByUserIdMediaId(mediaType, mediaId, user._id);
    const result = await mediaModel.getMediaByUsernameMediaId(mediaType, mediaId, user._id);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const deleteWatchByUsernameMediaIdHandler = async (req, res, next) => {
  try {
    const { username, mediaType, mediaId } = req.params;
    if (!(await accountModel.checkCookie(req.cookies.user_session, username))) {
      res.sendStatus(403);
      return;
    }
    const user = await accountModel.getUserByUsername(username);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    await mediaModel.deleteWatchByUserIdMediaId(mediaType, mediaId, user._id);
    const result = await mediaModel.getMediaByUsernameMediaId(mediaType, mediaId, user._id);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const addLikeByUsernameMediaIdHandler = async (req, res, next) => {
  try {
    const { username, mediaType, mediaId } = req.params;
    if (!(await accountModel.checkCookie(req.cookies.user_session, username))) {
      res.sendStatus(403);
      return;
    }
    const user = await accountModel.getUserByUsername(username);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    await mediaModel.addLikeByUserIdMediaId(mediaType, mediaId, user._id);
    const result = await mediaModel.getMediaByUsernameMediaId(mediaType, mediaId, user._id);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const deleteLikeByUsernameMediaIdHandler = async (req, res, next) => {
  try {
    const { username, mediaType, mediaId } = req.params;
    if (!(await accountModel.checkCookie(req.cookies.user_session, username))) {
      res.sendStatus(403);
      return;
    }
    const user = await accountModel.getUserByUsername(username);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    await mediaModel.deleteLikeByUserIdMediaId(mediaType, mediaId, user._id);
    const result = await mediaModel.getMediaByUsernameMediaId(mediaType, mediaId, user._id);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const addMediaHandler = async (req, res, next) => {
  try {
    const media = req.body;
    const existingMedia = await mediaModel.getMediaByMediaId(media.mediaType, media.mediaId);
    if (existingMedia) {
      res.send(existingMedia);
      return;
    }
    const addedMedia = await mediaModel.addMedia(media);
    res.send(addedMedia);
  } catch (e) {
    next(e);
  }
};

const addReviewByUsernameMediaIdHandler = async (req, res, next) => {
  try {
    const { username, mediaType, mediaId } = req.params;
    if (!(await accountModel.checkCookie(req.cookies.user_session, username))) {
      res.sendStatus(403);
      return;
    }
    const user = await accountModel.getUserByUsername(username);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    await mediaModel.addReviewByUserIdMediaId(mediaType, mediaId, user._id, req.body);
    const result = await mediaModel.getMediaByUsernameMediaId(mediaType, mediaId, user._id);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const getReviewsByMediaIdHandler = async (req, res, next) => {
  try {
    const { mediaType, mediaId } = req.params;
    const result = await mediaModel.getReviewsByMediaId(mediaType, mediaId);
    if (!result) {
      res.sendStatus(404);
    } else {
      res.send(result);
    }
  } catch (e) {
    next(e);
  }
};

const getRecentReviewsHandler = async (req, res, next) => {
  try {
    const result = await mediaModel.getRecentReviews();
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const recentlyReviewedByLikedHandler = async (req, res, next) => {
  try {
    const { username } = req.params;
    const result = await mediaModel.getRecentlyReviewedByLiked(username);
    if (!result) {
      res.sendStatus(404);
    } else {
      res.send(result);
    }
  } catch (e) {
    next(e);
  }
};

const getAverageRatingByMediaIdHandler = async (req, res, next) => {
  try {
    const { mediaType, mediaId } = req.params;
    const result = await mediaModel.getAverageRatingByMediaId(mediaType, mediaId);
    if (!result) {
      res.sendStatus(404);
    } else {
      res.send({ rating: result });
    }
  } catch (e) {
    next(e);
  }
};

const mediaController = (server) => {
  server.get('/profile/:username/likes', likesByUserHandler);
  server.get('/profile/:username/likes/recentlyReviewed', recentlyReviewedByLikedHandler);
  server.get('/profile/:username/watches', watchesByUserHandler);
  server.get('/profile/:username/media', mediaByUserHandler);
  server.get('/profile/:username/media/:mediaType/:mediaId', mediaByUsernameMediaIdHandler);
  server.post('/profile/:username/watches/:mediaType/:mediaId', addWatchByUsernameMediaIdHandler);
  server.delete('/profile/:username/watches/:mediaType/:mediaId', deleteWatchByUsernameMediaIdHandler);
  server.post('/profile/:username/likes/:mediaType/:mediaId', addLikeByUsernameMediaIdHandler);
  server.delete('/profile/:username/likes/:mediaType/:mediaId', deleteLikeByUsernameMediaIdHandler);
  server.post('/profile/:username/reviews/:mediaType/:mediaId', addReviewByUsernameMediaIdHandler);
  server.post('/media', addMediaHandler);
  server.get('/media/reviews/recent', getRecentReviewsHandler);
  server.get('/media/:mediaType/:mediaId', mediaByMediaIdHandler);
  server.get('/media/:mediaType/:mediaId/rating', getAverageRatingByMediaIdHandler);
  server.get('/media/:mediaType/:mediaId/reviews', getReviewsByMediaIdHandler);
};

export default mediaController;
