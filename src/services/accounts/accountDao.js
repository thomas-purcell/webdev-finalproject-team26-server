import mongoose from 'mongoose';
import accountSchema from './accountSchema.js';

export const accountModel = mongoose.model('AccountModel', accountSchema);

export const getAccountByEmail = async (email) => {
  const account = await accountModel.findOne({ email });
  return account;
};

export const getAccountByUsername = async (username) => {
  const account = await accountModel.findOne({ username });
  return account;
};

export const registerUser = async (newAccountInfo) => {
  // TODO: passwords are stored as plaintext right now
  await accountModel.create(newAccountInfo);
};
