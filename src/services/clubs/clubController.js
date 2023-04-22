import * as clubModel from './clubModel.js';

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

const addClubDiscussionByClubHandler = async (req, res) => {
  const { username, mediaType, mediaId } = req.params;
  const result = await clubModel.createClubDiscussion(username, mediaType, mediaId);
  res.send(result);
}

const deleteClubDiscussionByClubHandler = async (req, res) => {
  // const { username, mediaType, mediaId } = req.params;
  // const result = await clubModel.createClubDiscussion(username, mediaType, mediaId);
  // res.send(result);
}

const clubController = (server) => {
  server.get('/clubs', getClubsHandler);
  server.get('/clubs/popular', getPopularClubsHandler);
  server.get('/clubs/:clubUsername', getClubByClubIdHandler);
  server.post('/clubs', createClubsHandler);
  server.delete('/clubs/:clubUsername', deleteClubsHandler);
  server.get('/profile/:username/clubs', getClubsByMemberUsernameHandler);
  server.get('/profile/:username/clubs/announcements', getClubAnnouncementsByUsernameHandler);
  server.get('/clubs/:clubUsername/newMembers', getNewMembersByClubHandler);
  server.post('/clubs/:username/discussions/:mediaType/:mediaId', addClubDiscussionByClubHandler);
  server.delete('/clubs/:username/discussions/:mediaType/:mediaId', deleteClubDiscussionByClubHandler);
};

export default clubController;
