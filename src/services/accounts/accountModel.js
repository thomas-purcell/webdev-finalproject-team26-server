/* eslint-disable no-underscore-dangle */
import { randomUUID, randomBytes, pbkdf2Sync } from 'crypto';
import logger from '../../logger.js';
import * as accountDao from './accountDao.js';

// Store logged in users on the server only, not in the database
// This means if server restarts then all users will need to log in again
const loggedInUsers = [];

const hashPassword = (password, salt) => {
  const hashed = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  // logger.info(hashed);
  return hashed;
};

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
  if (!account || account.password !== hashPassword(password, account.salt)) {
    logger.info('Failed login attempt for:', username);
    return undefined;
  }
  // if all checks were successful, then give the user a cookie and log them in
  // this is kinda insecure but works for now
  const cookie = randomUUID();
  loggedInUsers.push({ cookie, account });
  logger.info('Logging in:', account.username);
  return cookie;
};

export const registerNewUser = async (newAccountInfo) => {
  const salt = randomBytes(16).toString('hex');
  const newAccount = {
    ...newAccountInfo,
    password: hashPassword(newAccountInfo.password, salt),
    salt,
    watchAnime: false,
    watchMovies: false,
    watchTv: false,
    bio: '',
    contacts: [],
    virtualMeetings: {},
  };
  await accountDao.registerUser(newAccount);
  logger.info('Registering:', newAccount.email);
  // log the user in after creating their account
  // use the supplied username and password because the db object will be hashed already
  const cookie = await logUserIn({
    username: newAccountInfo.username,
    password: newAccountInfo.password,
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

export const getLoggedInUser = async (cookie) => {
  const accountFound = loggedInUsers.find((user) => user.cookie === cookie);

  if (accountFound) {
    const accountId = accountFound.account._id.toString();
    const account = await accountDao.getAccountById(accountId);
    return { cookie, account };
  }
  return accountFound;
};

export const getUserByUsername = async (username) => {
  const account = await accountDao.getAccountByUsername(username, false);
  return account;
};

export const getUserByEmail = async (email) => {
  const account = await accountDao.getAccountByEmail(email, false);
  return account;
};

export const checkCookie = async (cookie, username) => {
  const user = await getLoggedInUser(cookie);
  return user?.account.username === username;
};

export const updateUser = async (updateAccountInfo) => {
  await accountDao.updateUser(updateAccountInfo);
  const account = await accountDao.getAccountByUsername(updateAccountInfo.username, false);
  return account;
};

export const getClubs = async () => {
  const clubs = await accountDao.getClubAccounts();
  return clubs;
};

export const getAccountById = async (accountId) => {
  const account = await accountDao.getAccountById(accountId);
  return account;
};
