import { randomUUID } from 'crypto';
import logger from '../../logger.js';
import * as accountDao from './accountDao.js';

// Store logged in users on the server only, not in the database
// This means if server restarts then all users will need to log in again
const loggedInUsers = [];

export const logUserIn = async ({ email, username, password }) => {
  let account;
  if (email) {
    // try to login using email if one was provided
    account = await accountDao.getAccountByEmail(email, true);
  }
  if (!account && username) {
    // try to login using username if one was provided
    account = await accountDao.getAccountByUsername(username, true);
  }
  // if we didn't find an account then we can't compare passwords
  // if we did get an account, see if they have the right password
  // TODO: passwords are stored as plaintext right now
  if (!account || account.password !== password) {
    return undefined;
  }
  // if all checks were successful, then give the user a cookie and log them in
  // this is kinda insecure but works for now
  const cookie = randomUUID();
  loggedInUsers.push({ cookie, account });
  logger.info('Logging in:', account.email);
  return cookie;
};

export const registerNewUser = async (newAccountInfo) => {
  const newAccount = {
    ...newAccountInfo,
    watchAnime: false,
    watchMovies: false,
    watchTv: false,
    bio: '',
    contacts: [],
  };
  await accountDao.registerUser(newAccount);
  logger.info('Registering:', newAccount.email);
  // log the user in after creating their account
  const cookie = await logUserIn({
    email: newAccount.email,
    password: newAccount.password,
  });
  return cookie;
};

export const logUserOut = (cookie) => {
  const idx = loggedInUsers.findIndex((account) => account.cookie === cookie);
  if (idx !== -1) {
    logger.info('Logging out:', loggedInUsers[idx].account.email);
    loggedInUsers.splice(idx, 1);
  }
};

export const getLoggedInUser = (cookie) => {
  const account = loggedInUsers.find((user) => user.cookie === cookie);
  return account;
};

export const getUserByUsername = async (username) => {
  const account = await accountDao.getAccountByUsername(username, false);
  logger.info(account);
  return account;
};

export const checkCookie = (cookie, username) => {
  const user = getLoggedInUser(cookie);
  return user?.account.username === username;
};
