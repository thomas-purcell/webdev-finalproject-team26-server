/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import accountSchema from './accountSchema.js';
import logger from '../../logger.js';

export const accountModel = mongoose.model('AccountModel', accountSchema);

export const getAccountByEmail = async (email, getPassword) => {
  const project = getPassword ? { } : { password: 0 };
  const account = await accountModel.findOne({ email }, project).lean();
  return account;
};

export const getAccountByUsername = async (username, getPassword) => {
  const project = getPassword ? { } : { password: 0 };
  const account = await accountModel.findOne({ username }, project).lean();
  return account;
};

export const registerUser = async (newAccountInfo) => {
  await accountModel.create(newAccountInfo);
};

export const updateUser = async (updateAccountInfo) => {
  const accountId = updateAccountInfo._id;
  // eslint-disable-next-line no-param-reassign
  delete updateAccountInfo._id;
  const result = await accountModel.updateOne({ _id: accountId }, updateAccountInfo).lean();
  logger.info(result);
  return result;
};

export const getClubAccounts = async () => {
  const clubs = await accountModel.find({ isMemberAccount: false }).lean();
  return clubs;
};

export const getAccountById = async (accountId) => {
  const result = await accountModel.findOne({ _id: accountId }).lean();
  return result;
};
