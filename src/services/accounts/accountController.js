import * as accountModel from './accountModel.js';

const cookieOptions = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // one week
  secure: true,
  httpOnly: true,
  sameSite: 'None',
};

const registrationHandler = async (req, res) => {
  const cookie = await accountModel.registerNewUser(req.body);
  const user = accountModel.getLoggedInUser(cookie);
  res.cookie('user_session', cookie, cookieOptions);
  res.send({ profile: user.account });
};

const loginHandler = async (req, res) => {
  // Check if the user is already logged in with a cookie
  const user = accountModel.getLoggedInUser(req.cookies.user_session);
  if (user) {
    res.send({ profile: user.account });
    return;
  }
  // If the user wasn't logged in, try to log them in with credentials
  // User can login with an email or a username
  const cookie = await accountModel.logUserIn({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });
  // If we didn't get a cookie, the log in was unsuccessful so send 403
  if (!cookie) {
    res.sendStatus(403);
    return;
  }
  const { account } = accountModel.getLoggedInUser(cookie);

  // If the log in was successful, then send the user their cookie and a 200
  res.cookie('user_session', cookie, cookieOptions);
  res.send({ profile: account });
};

const logoutHandler = (req, res) => {
  accountModel.logUserOut(req.cookies.user_session);
  res.clearCookie('user_session', cookieOptions);
  res.sendStatus(200);
};

const profileHandler = async (req, res) => {
  const account = await accountModel.getUserByUsername(req.params.username);
  res.send(account);
};

const accountController = (server) => {
  server.post('/register', registrationHandler);
  server.post('/login', loginHandler);
  server.post('/logout', logoutHandler);
  server.get('/profile/:username', profileHandler);
};

export default accountController;
