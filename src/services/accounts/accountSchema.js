import mongoose from 'mongoose';

const schema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  isMemberAccount: Boolean,
  firstName: String,
  lastName: String,
  orgName: String,
  bio: String,
  contacts: Array,
  watchMovies: Boolean,
  watchAnime: Boolean,
  watchTv: Boolean,
  virtualMeetings: {
    link: String,
    meetingWeekday: String,
    meetingTime: String,
  },
}, { collection: 'users' });

export default schema;
