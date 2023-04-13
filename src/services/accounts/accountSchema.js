import mongoose from 'mongoose';

const schema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  isMemberAccount: Boolean,
  firstName: String,
  lastName: String,
  orgName: String,
}, { collection: 'users' });

export default schema;
