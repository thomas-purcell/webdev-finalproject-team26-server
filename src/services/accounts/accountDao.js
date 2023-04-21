import mongoose from 'mongoose';
import accountSchema from './accountSchema.js';
import logger from '../../logger.js';

export const accountModel = mongoose.model('AccountModel', accountSchema);

// TODO: don't want to send passwords back from mongo
export const getAccountByEmail = async (email, getPassword) => {
  const project = getPassword ? { } : { password: 0 };
  const account = await accountModel.findOne({ email }, project).lean();
  return account;
};

// TODO: don't want to send passwords back from mongo
export const getAccountByUsername = async (username, getPassword) => {
  const project = getPassword ? { } : { password: 0 };
  const account = await accountModel.findOne({ username }, project).lean();
  return account;
};

export const registerUser = async (newAccountInfo) => {
  // TODO: passwords are stored as plaintext right now
  await accountModel.create(newAccountInfo);
};

<<<<<<< Updated upstream
export const updateUser = async (updateAccountInfo) => {
  const result = await accountModel.updateOne(updateAccountInfo).lean();
  logger.info(result);
=======
export const getClubAccounts = async () => {
  const clubs = await accountModel.find({ isMemberAccount: false }).lean();
  return clubs;
};

export const getAccountById = async (accountId) => {
  const result = await accountModel.findOne({ _id: accountId }).lean();
>>>>>>> Stashed changes
  return result;
};
