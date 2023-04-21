import * as mediaModel from './mediaModel.js';
import * as accountModel from '../accounts/accountModel.js';

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
      media.at(media.findIndex((m) => m.mediaId === watchedMedia.mediaId)).watched = true;
    }
  });
  reviews.forEach((reviewedMedia) => {
    if (!media.map((m) => m.mediaId).includes(reviewedMedia.mediaId)) {
      media.push({
        ...reviewedMedia, watched: false, liked: false, reviewed: true,
      });
    } else {
      const reviewed = media.at(media.findIndex((m) => m.mediaId === reviewedMedia.mediaId));
      reviewed.reviewed = true;
      reviewed.rating = reviewedMedia.rating;
      reviewed.comment = reviewedMedia.comment;
    }
  });
  res.send(media);
};

const mediaByMediaIdHandler = async (req, res) => {
  const { mediaType, mediaId } = req.params;
  const media = await mediaModel.getMediaByMediaId(mediaType, mediaId);
  res.send(media);
};

const mediaController = (server) => {
  server.get('/profile/:username/likes', likesByUserHandler);
  server.get('/profile/:username/watches', watchesByUserHandler);
  server.get('/profile/:username/media', mediaByUserHandler);
  server.get('/media/:mediaType/:mediaId', mediaByMediaIdHandler);
};

export default mediaController;
