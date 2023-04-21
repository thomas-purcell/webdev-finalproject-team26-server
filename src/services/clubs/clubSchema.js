import mongoose from 'mongoose';

export const clubAnnouncementsSchema = mongoose.Schema({
  clubId: String,
  message: String,
  timestamp: String,
}, { collection: 'clubAnnouncements' });

export const clubDiscussionsSchema = mongoose.Schema({
  clubId: String,
  discussionDate: String,
  mediaType: String,
  mediaId: String,
  avgRating: Number,
}, { collection: 'clubDiscussions' });

export const clubMembersSchema = mongoose.Schema({
  clubId: String,
  memberId: String,
  joinedDate: String,
}, { collection: 'clubMembers' });
