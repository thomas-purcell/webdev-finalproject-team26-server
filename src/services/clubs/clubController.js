/* eslint-disable no-underscore-dangle */
import * as clubModel from './clubModel.js';
import * as accountModel from '../accounts/accountModel.js';
import logger from '../../logger.js';

const getClubsHandler = async (req, res) => {
  const clubs = await clubModel.getClubs();
  res.send(clubs);
};

const getClubByClubIdHandler = async (req, res) => {
  const club = await clubModel.getClubByClubUsername(req.params.clubUsername);
  res.send(club);
};

const createClubsHandler = async (req, res) => {
  const result = await clubModel.createClub(req.body);
  res.send(result);
};

const deleteClubsHandler = async (req, res) => {
  const result = await clubModel.deleteClub(req.params.clubId);
  res.send(result);
};

const getClubsByMemberUsernameHandler = async (req, res) => {
  const result = await clubModel.getClubsByMemberUsername(req.params.username);
  res.send(result);
};

const getNewMembersByClubHandler = async (req, res) => {
  const result = await clubModel.getNewMembersByClub(req.params.clubUsername);
  res.send(result);
};

const getPopularClubsHandler = async (req, res) => {
  const result = await clubModel.getPopularClubs();
  res.send(result);
};

const getClubAnnouncementsByUsernameHandler = async (req, res) => {
  const { username } = req.params;
  const result = await clubModel.getClubAnnouncementsForUser(username);
  res.send(result);
};

const getClubDiscussionForMediaHandler = async (req, res) => {
  const { clubUsername, mediaType, mediaId } = req.params;
  try {
    const result = await clubModel.getClubDiscussionForMedia(clubUsername, mediaType, mediaId);
    res.send(result);
  } catch {
    res.sendStatus(400);
  }
};

const createCommentForClubDiscussionHandler = async (req, res) => {
  const { clubUsername, mediaType, mediaId } = req.params;
  const newComment = req.body;
  const result = await clubModel.createDiscussionCommentForMedia(
    clubUsername,
    mediaType,
    mediaId,
    newComment,
  );
  res.send(result);
};

const addClubDiscussionByClubHandler = async (req, res) => {
  const { username, mediaType, mediaId } = req.params;
  const result = await clubModel.createClubDiscussion(username, mediaType, mediaId);
  res.send(result);
};

const deleteClubDiscussionByClubHandler = async (req, res) => {
  const { username, mediaType, mediaId } = req.params;
  const result = await clubModel.deleteClubDiscussion(username, mediaType, mediaId);
  res.send(result);
};

const updateClubDiscussionByClubHandler = async (req, res) => {
  const updateDiscussionInfo = req.body;

  const updatedDiscussion = await clubModel.updateClubDiscussion(updateDiscussionInfo);

  logger.info(updatedDiscussion);
  res.send(updatedDiscussion);
};

const getRecentCommentsForClubHandler = async (req, res) => {
  const { clubUsername } = req.params;
  const result = await clubModel.getRecentComments(clubUsername);
  res.send(result);
};

const getClubMembersHandler = async (req, res) => {
  const { clubUsername } = req.params;
  const club = await clubModel.getClubByClubUsername(clubUsername);
  const result = await clubModel.getClubMembers(club._id);
  const asyncRes = await Promise.all(result.map(async (m) => {
    const account = await accountModel.getAccountById(m.memberId);
    return {
      ...account,
      ...m,
    };
  }));
  res.send(asyncRes);
};

const getClubAnnouncementsHandler = async (req, res) => {
  const { clubUsername } = req.params;
  const club = await clubModel.getClubByClubUsername(clubUsername);
  const result = await clubModel.getClubAnnouncements(club._id);
  res.send(result);
};

const createClubAnnouncement = async (req, res) => {
  const clubAnnouncement = req.body;

  const newAnnouncement = await clubModel.createClubAnnouncement(clubAnnouncement);
  res.send(newAnnouncement);
};

const deleteClubAnnouncement = async (req, res) => {
  const { announcementId } = req.params;

  const result = await clubModel.deleteClubAnnouncement(announcementId);
  res.send(result);
};

const createClubMember = async (req, res) => {
  const newMember = req.body;

  const result = await clubModel.createClubMember(newMember);
  res.send(result);
};

const deleteClubMember = async (req, res) => {
  const { memberId, clubId } = req.params;

  logger.info(`Member id: ${memberId}`);
  logger.info(`Club id: ${clubId}`);

  const result = await clubModel.deleteClubMember(memberId, clubId);
  res.send(result);
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
