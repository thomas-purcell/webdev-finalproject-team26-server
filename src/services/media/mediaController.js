import * as mediaModel from './mediaModel.js';
import * as accountModel from '../accounts/accountModel.js';
// eslint-disable-next-line no-unused-vars
import logger from '../../logger.js';

const likesByUserHandler = async (req, res) => {
  const { username } = req.params;
  const { _id: userId } = await accountModel.getUserByUsername(username);
  const likes = await mediaModel.getLikesByUser(userId);
  res.send(likes);
};

const watchesByUserHandler = async (req, res) => {
  const { username } = req.params;
  const { _id: userId } = await accountModel.getUserByUsername(username);
  const likes = await mediaModel.getWatchesByUser(userId);
  res.send(likes);
};

const mediaByUserHandler = async (req, res) => {
  const { username } = req.params;
  const { _id: userId } = await accountModel.getUserByUsername(username);
  const [likes, watches, reviews, discussing] = await Promise.all([
    mediaModel.getLikesByUser(userId),
    mediaModel.getWatchesByUser(userId),
    mediaModel.getReviewsByUser(userId),
    mediaModel.getDiscussingByUser(userId),
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
    }
  })
  res.send(media);
};

const mediaByMediaIdHandler = async (req, res) => {
  const { mediaType, mediaId } = req.params;
  const [media, rating] = await Promise.all([
    mediaModel.getMediaByMediaId(mediaType, mediaId),
    mediaModel.getAverageRatingByMediaId(mediaType, mediaId),
  ]);
  if (!media) {
    res.sendStatus(404);
    return;
  }
  res.send({
    ...media,
    avgRating: rating,
  });
};

const mediaByUsernameMediaIdHandler = async (req, res) => {
  const { mediaType, mediaId, username } = req.params;
  const { _id: userId } = await accountModel.getUserByUsername(username);
  const [media, likes, watches, reviews, discussing] = await Promise.all([
    mediaModel.getMediaByMediaId(mediaType, mediaId),
    mediaModel.getLikesByUser(userId),
    mediaModel.getWatchesByUser(userId),
    mediaModel.getReviewsByUser(userId),
    mediaModel.getDiscussingByUser(userId),
  ]);
  if (!media) {
    res.sendStatus(403);
    return;
  }
  const review = reviews.find((l) => l.mediaId === mediaId);
  const result = {
    ...media,
    liked: !!likes.find((l) => l.mediaId === mediaId),
    watched: !!watches.find((l) => l.mediaId === mediaId),
    discussing: !!discussing.find((l) => l.mediaId === mediaId),
    reviewed: !!review,
    rating: review?.rating,
    comment: review?.comment,
  };
  res.send(result);
};

const addWatchByUsernameMediaIdHandler = async (req, res) => {
  const { username, mediaType, mediaId } = req.params;
  if (!(await accountModel.checkCookie(req.cookies.user_session, username))) {
    res.sendStatus(403);
    return;
  }
  const { _id: userId } = await accountModel.getUserByUsername(username);
  await mediaModel.addWatchByUserIdMediaId(mediaType, mediaId, userId);
  res.sendStatus(200);
};

const deleteWatchByUsernameMediaIdHandler = async (req, res) => {
  const { username, mediaType, mediaId } = req.params;
  if (!(await accountModel.checkCookie(req.cookies.user_session, username))) {
    res.sendStatus(403);
    return;
  }
  const { _id: userId } = await accountModel.getUserByUsername(username);
  await mediaModel.deleteWatchByUserIdMediaId(mediaType, mediaId, userId);
  res.sendStatus(200);
};

const addLikeByUsernameMediaIdHandler = async (req, res) => {
  const { username, mediaType, mediaId } = req.params;
  if (!(await accountModel.checkCookie(req.cookies.user_session, username))) {
    res.sendStatus(403);
    return;
  }
  const { _id: userId } = await accountModel.getUserByUsername(username);
  await mediaModel.addLikeByUserIdMediaId(mediaType, mediaId, userId);
  res.sendStatus(200);
};

const deleteLikeByUsernameMediaIdHandler = async (req, res) => {
  const { username, mediaType, mediaId } = req.params;
  if (!(await accountModel.checkCookie(req.cookies.user_session, username))) {
    res.sendStatus(403);
    return;
  }
  const { _id: userId } = await accountModel.getUserByUsername(username);
  await mediaModel.deleteLikeByUserIdMediaId(mediaType, mediaId, userId);
  res.sendStatus(200);
};

const addMediaHandler = async (req, res) => {
  const media = req.body;
  const existingMedia = await mediaModel.getMediaByMediaId(media.mediaType, media.mediaId);
  if (existingMedia) {
    res.send(existingMedia);
    return;
  }
  const addedMedia = await mediaModel.addMedia(media);
  res.send(addedMedia);
};

const addReviewByUsernameMediaIdHandler = async (req, res) => {
  const { username, mediaType, mediaId } = req.params;
  if (! (await accountModel.checkCookie(req.cookies.user_session, username))) {
    res.sendStatus(403);
    return;
  }
  const { _id: userId } = await accountModel.getUserByUsername(username);
  await mediaModel.addReviewByUserIdMediaId(mediaType, mediaId, userId, req.body);
  res.sendStatus(200);
};

const getReviewsByMediaIdHandler = async (req, res) => {
  const { mediaType, mediaId } = req.params;
  const result = await mediaModel.getReviewsByMediaId(mediaType, mediaId);
  res.send(result);
};

const getRecentReviewsHandler = async (req, res) => {
  const result = await mediaModel.getRecentReviews();
  res.send(result);
};

const recentlyReviewedByLikedHandler = async (req, res) => {
  const { username } = req.params;
  const result = await mediaModel.getRecentlyReviewedByLiked(username);
  res.send(result);
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
  server.get('/media/:mediaType/:mediaId/reviews', getReviewsByMediaIdHandler);
};

export default mediaController;
