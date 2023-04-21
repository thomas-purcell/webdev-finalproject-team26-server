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

const clubController = (server) => {
  server.get('/clubs', getClubsHandler);
  server.get('/clubs/:clubUsername', getClubByClubIdHandler);
  server.post('/clubs', createClubsHandler);
  server.delete('/clubs/:clubUsername', deleteClubsHandler);
  server.get('/profile/:username/clubs', getClubsByMemberUsernameHandler);
};

export default clubController;
