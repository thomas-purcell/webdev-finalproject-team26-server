import logger from '../../logger.js';
import * as accountModel from './accountModel.js';

const cookieOptions = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // one week
  secure: true,
  httpOnly: true,
  sameSite: 'None',
};

// eslint-disable-next-line arrow-body-style
const validateNewUser = async (user) => {
  const existingUsername = await accountModel.getUserByUsername(user.username);
  const existingEmail = await accountModel.getUserByEmail(user.email);
  return (
    user.username?.length > 0
    && user.email?.length > 0
    && user.password?.length > 0
    && !existingEmail
    && !existingUsername
  );
};

const registrationHandler = async (req, res, next) => {
  try {
    if (!(await validateNewUser(req.body))) {
      res.sendStatus(400);
      return;
    }
    const cookie = await accountModel.registerNewUser(req.body);
    const user = await accountModel.getLoggedInUser(cookie);
    res.cookie('user_session', cookie, cookieOptions);
    res.send({ profile: user.account });
  } catch (e) {
    next(e);
  }
};

const loginHandler = async (req, res, next) => {
  try {
  // Check if the user is already logged in with a cookie
    const user = await accountModel.getLoggedInUser(req.cookies.user_session);
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
    const { account } = await accountModel.getLoggedInUser(cookie);

    // If the log in was successful, then send the user their cookie and a 200
    res.cookie('user_session', cookie, cookieOptions);
    res.send({ profile: account });
  } catch (e) {
    next(e);
  }
};

const logoutHandler = (req, res, next) => {
  try {
    accountModel.logUserOut(req.cookies.user_session);
    res.clearCookie('user_session', cookieOptions);
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

const profileHandler = async (req, res, next) => {
  try {
    const account = await accountModel.getUserByUsername(req.params.username);
    if (!account) {
      res.sendStatus(404);
    } else {
      res.send(account);
    }
  } catch (e) {
    next(e);
  }
};

const updateProfileHandler = async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!(await accountModel.checkCookie(req.cookies.user_session, username))) {
      res.sendStatus(403);
      return;
    }
    const updateAccountInfo = req.body;
    if (updateAccountInfo.password.length === 0) {
      delete updateAccountInfo.password;
    }
    const updatedAccount = await accountModel.updateUser(updateAccountInfo);
    logger.info(updatedAccount);
    res.send(updatedAccount);
  } catch (e) {
    next(e);
  }
};

const accountController = (server) => {
  server.post('/register', registrationHandler);
  server.post('/login', loginHandler);
  server.post('/logout', logoutHandler);
  server.put('/profile/:username', updateProfileHandler);
  server.get('/profile/:username', profileHandler);
};

export default accountController;
