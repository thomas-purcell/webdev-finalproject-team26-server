import * as mediaModel from './mediaModel.js';
import * as accountModel from '../accounts/accountModel.js';
// import logger from '../../logger.js';

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
  const [likes, watches, reviews] = await Promise.all([
    mediaModel.getLikesByUser(userId),
    mediaModel.getWatchesByUser(userId),
    mediaModel.getReviewsByUser(userId),
  ]);
  const media = likes.map((l) => ({
    ...l, liked: true, watched: false, reviewed: false,
  }));
  watches.forEach((watchedMedia) => {
    if (!media.map((m) => m.mediaId).includes(watchedMedia.mediaId)) {
      media.push({
        ...watchedMedia, watched: true, liked: false, reviewed: false,
      });
    } else {
      const watchedIdx = media.findIndex((m) => m.mediaId === watchedMedia.mediaId);
      media[watchedIdx].watched = true;
    }
  });
  reviews.forEach((reviewedMedia) => {
    if (!media.map((m) => m.mediaId).includes(reviewedMedia.mediaId)) {
      media.push({
        ...reviewedMedia, watched: false, liked: false, reviewed: true,
      });
    } else {
      const reviewedIdx = media.findIndex((m) => m.mediaId === reviewedMedia.mediaId);
      const reviewed = media[reviewedIdx];
      reviewed.reviewed = true;
      reviewed.rating = reviewedMedia.rating;
      reviewed.comment = reviewedMedia.comment;
    }
  });
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
  const [media, likes, watches, reviews] = await Promise.all([
    mediaModel.getMediaByMediaId(mediaType, mediaId),
    mediaModel.getLikesByUser(userId),
    mediaModel.getWatchesByUser(userId),
    mediaModel.getReviewsByUser(userId),
  ]);
  const review = reviews.find((l) => l.mediaId === mediaId);
  const result = {
    ...media,
    liked: !!likes.find((l) => l.mediaId === mediaId),
    watched: !!watches.find((l) => l.mediaId === mediaId),
    reviewed: !!review,
    rating: review?.rating,
    comment: review?.comment,
  };
  res.send(result);
};

const addWatchByUsernameMediaIdHandler = async (req, res) => {
  const { username, mediaType, mediaId } = req.params;
  if (!accountModel.checkCookie(req.cookies.user_session, username)) {
    res.sendStatus(403);
    return;
  }
  const { _id: userId } = await accountModel.getUserByUsername(username);
  await mediaModel.addWatchByUserIdMediaId(mediaType, mediaId, userId);
  res.sendStatus(200);
};

const deleteWatchByUsernameMediaIdHandler = async (req, res) => {
  const { username, mediaType, mediaId } = req.params;
  if (!accountModel.checkCookie(req.cookies.user_session, username)) {
    res.sendStatus(403);
    return;
  }
  const { _id: userId } = await accountModel.getUserByUsername(username);
  await mediaModel.deleteWatchByUserIdMediaId(mediaType, mediaId, userId);
  res.sendStatus(200);
};

const addLikeByUsernameMediaIdHandler = async (req, res) => {
  const { username, mediaType, mediaId } = req.params;
  if (!accountModel.checkCookie(req.cookies.user_session, username)) {
    res.sendStatus(403);
    return;
  }
  const { _id: userId } = await accountModel.getUserByUsername(username);
  await mediaModel.addLikeByUserIdMediaId(mediaType, mediaId, userId);
  res.sendStatus(200);
};

const deleteLikeByUsernameMediaIdHandler = async (req, res) => {
  const { username, mediaType, mediaId } = req.params;
  if (!accountModel.checkCookie(req.cookies.user_session, username)) {
    res.sendStatus(403);
    return;
  }
  const { _id: userId } = await accountModel.getUserByUsername(username);
  await mediaModel.deleteLikeByUserIdMediaId(mediaType, mediaId, userId);
  res.sendStatus(200);
};

const addMediaHandler = async (req, res) => {
  const media = req.body;
  await mediaModel.addMedia(media);
  res.sendStatus(200);
};

const mediaController = (server) => {
  server.get('/profile/:username/likes', likesByUserHandler);
  server.get('/profile/:username/watches', watchesByUserHandler);
  server.get('/profile/:username/media', mediaByUserHandler);
  server.get('/profile/:username/media/:mediaType/:mediaId', mediaByUsernameMediaIdHandler);
  server.post('/profile/:username/watches/:mediaType/:mediaId', addWatchByUsernameMediaIdHandler);
  server.delete('/profile/:username/watches/:mediaType/:mediaId', deleteWatchByUsernameMediaIdHandler);
  server.post('/profile/:username/likes/:mediaType/:mediaId', addLikeByUsernameMediaIdHandler);
  server.delete('/profile/:username/likes/:mediaType/:mediaId', deleteLikeByUsernameMediaIdHandler);
  server.post('/media', addMediaHandler);
  server.get('/media/:mediaType/:mediaId', mediaByMediaIdHandler);
};

export default mediaController;
