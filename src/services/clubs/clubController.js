/* eslint-disable no-underscore-dangle */
import * as clubModel from './clubModel.js';
import * as accountModel from '../accounts/accountModel.js';
import * as mediaModel from '../media/mediaModel.js';
import logger from '../../logger.js';

const getClubsHandler = async (req, res, next) => {
  try {
    const clubs = await clubModel.getClubs();
    res.send(clubs);
  } catch (e) {
    next(e);
  }
};

const getClubByClubIdHandler = async (req, res, next) => {
  try {
    const result = await clubModel.getClubByClubUsername(req.params.clubUsername);
    if (!result) {
      res.sendStatus(404);
    } else {
      res.send(result);
    }
  } catch (e) {
    next(e);
  }
};

const createClubsHandler = async (req, res, next) => {
  try {
    const result = await clubModel.createClub(req.body);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const deleteClubsHandler = async (req, res, next) => {
  try {
    const result = await clubModel.deleteClub(req.params.clubId);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const getClubsByMemberUsernameHandler = async (req, res, next) => {
  try {
    const result = await clubModel.getClubsByMemberUsername(req.params.username);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const getNewMembersByClubHandler = async (req, res, next) => {
  try {
    const result = await clubModel.getNewMembersByClub(req.params.clubUsername);
    if (!result) {
      res.sendStatus(404);
    } else {
      res.send(result);
    }
  } catch (e) {
    next(e);
  }
};

const getPopularClubsHandler = async (req, res, next) => {
  try {
    const result = await clubModel.getPopularClubs();
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const getClubAnnouncementsByUsernameHandler = async (req, res, next) => {
  try {
    const { username } = req.params;
    const result = await clubModel.getClubAnnouncementsForUser(username);
    if (!result) {
      res.sendStatus(404);
    } else {
      res.send(result);
    }
  } catch (e) {
    next(e);
  }
};

const getClubDiscussionForMediaHandler = async (req, res, next) => {
  try {
    const { clubUsername, mediaType, mediaId } = req.params;
    const result = await clubModel.getClubDiscussionForMedia(clubUsername, mediaType, mediaId);
    if (!result) {
      res.sendStatus(404);
    } else {
      res.send(result);
    }
  } catch (e) {
    next(e);
  }
};

const createCommentForClubDiscussionHandler = async (req, res, next) => {
  try {
    const { clubUsername, mediaType, mediaId } = req.params;
    const newComment = req.body;
    const result = await clubModel.createDiscussionCommentForMedia(
      clubUsername,
      mediaType,
      mediaId,
      newComment,
    );
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const addClubDiscussionByClubHandler = async (req, res, next) => {
  try {
    const { username, mediaType, mediaId } = req.params;
    const club = await accountModel.getUserByUsername(username);
    await clubModel.createClubDiscussion(club._id, mediaType, mediaId);
    const result = await mediaModel.getMediaByUsernameMediaId(mediaType, mediaId, club._id);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const deleteClubDiscussionByClubHandler = async (req, res, next) => {
  try {
    const { username, mediaType, mediaId } = req.params;
    const club = await accountModel.getUserByUsername(username);
    await clubModel.deleteClubDiscussion(club._id, mediaType, mediaId);
    const result = await mediaModel.getMediaByUsernameMediaId(mediaType, mediaId, club._id);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const updateClubDiscussionByClubHandler = async (req, res, next) => {
  try {
    const updateDiscussionInfo = req.body;

    const updatedDiscussion = await clubModel.updateClubDiscussion(updateDiscussionInfo);

    logger.info(updatedDiscussion);
    res.send(updatedDiscussion);
  } catch (e) {
    next(e);
  }
};

const getRecentCommentsForClubHandler = async (req, res, next) => {
  try {
    const { clubUsername } = req.params;
    const result = await clubModel.getRecentComments(clubUsername);
    if (!result) {
      res.sendStatus(404);
    } else {
      res.send(result);
    }
  } catch (e) {
    next(e);
  }
};

const getClubMembersHandler = async (req, res, next) => {
  try {
    const { clubUsername } = req.params;
    const club = await clubModel.getClubByClubUsername(clubUsername);
    if (!club) {
      res.sendStatus(404);
      return;
    }
    const result = await clubModel.getClubMembers(club._id);
    const asyncRes = await Promise.all(result.map(async (m) => {
      const account = await accountModel.getAccountById(m.memberId);
      return {
        ...account,
        ...m,
      };
    }));
    res.send(asyncRes);
  } catch (e) {
    next(e);
  }
};

const getClubAnnouncementsHandler = async (req, res, next) => {
  try {
    const { clubUsername } = req.params;
    const club = await clubModel.getClubByClubUsername(clubUsername);
    if (!club) {
      res.sendStatus(404);
    }
    const result = await clubModel.getClubAnnouncements(club._id);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const createClubAnnouncement = async (req, res, next) => {
  try {
    const clubAnnouncement = req.body;

    const newAnnouncement = await clubModel.createClubAnnouncement(clubAnnouncement);
    res.send(newAnnouncement);
  } catch (e) {
    next(e);
  }
};

const deleteClubAnnouncement = async (req, res, next) => {
  try {
    const { announcementId } = req.params;

    const result = await clubModel.deleteClubAnnouncement(announcementId);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const createClubMember = async (req, res, next) => {
  try {
    const newMember = req.body;

    const result = await clubModel.createClubMember(newMember);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const deleteClubMember = async (req, res, next) => {
  try {
    const { memberId, clubId } = req.params;

    const result = await clubModel.deleteClubMember(memberId, clubId);
    res.send(result);
  } catch (e) {
    next(e);
  }
};

const clubController = (server) => {
  server.get('/clubs', getClubsHandler);
  server.get('/clubs/popular', getPopularClubsHandler);
  server.get('/clubs/:clubUsername', getClubByClubIdHandler);
  server.post('/clubs', createClubsHandler);
  server.delete('/clubs/:clubUsername', deleteClubsHandler);
  server.get('/profile/:username/clubs', getClubsByMemberUsernameHandler);
  server.get('/profile/:username/clubs/announcements', getClubAnnouncementsByUsernameHandler);
  server.get('/clubs/:clubUsername/newMembers', getNewMembersByClubHandler);
  server.get('/clubs/:clubUsername/discussion/:mediaType/:mediaId', getClubDiscussionForMediaHandler);
  server.post('/clubs/:clubUsername/discussion/:mediaType/:mediaId', createCommentForClubDiscussionHandler);
  server.post('/clubs/:username/discussions/:mediaType/:mediaId', addClubDiscussionByClubHandler);
  server.delete('/clubs/:username/discussions/:mediaType/:mediaId', deleteClubDiscussionByClubHandler);
  server.put('/clubs/discussions', updateClubDiscussionByClubHandler);
  server.post('/clubs/:clubUsername/discussion/:mediaType/:mediaId/comment', createCommentForClubDiscussionHandler);
  server.get('/clubs/:clubUsername/recentComments', getRecentCommentsForClubHandler);
  server.get('/clubs/:clubUsername/members', getClubMembersHandler);
  server.get('/clubs/:clubUsername/announcements', getClubAnnouncementsHandler);
  server.post('/clubs/announcement', createClubAnnouncement);
  server.delete('/clubs/announcement/:announcementId', deleteClubAnnouncement);
  server.post('/clubs/members', createClubMember);
  server.delete('/clubs/:clubId/members/:memberId', deleteClubMember);
};

export default clubController;
