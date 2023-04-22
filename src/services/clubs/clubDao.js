import mongoose from 'mongoose';
import {
  clubAnnouncementsSchema, clubDiscussionsSchema, clubMembersSchema, discussionCommentsSchema,
} from './clubSchema.js';
// eslint-disable-next-line no-unused-vars
import logger from '../../logger.js';

export const clubAnnouncementsModel = mongoose.model('ClubAnnouncementsModel', clubAnnouncementsSchema);
export const clubDiscussionsModel = mongoose.model('ClubDiscussionsModel', clubDiscussionsSchema);
export const clubMembersModel = mongoose.model('ClubMembersModel', clubMembersSchema);
export const discussionCommentsModel = mongoose.model('DiscussionCommentsModel', discussionCommentsSchema);

export const getClubAnnouncements = async (clubId) => {
  const announcements = await clubAnnouncementsModel.find({ clubId }).lean();
  return announcements;
};

export const createClubAnnouncement = async (announcement) => {
  const result = await clubAnnouncementsModel.create(announcement);
  return result;
};

export const deleteClubAnnouncement = async (announcementId) => {
  const result = await clubAnnouncementsModel.deleteOne({ _id: announcementId });
  return result;
};

export const getClubDiscussions = async (clubId) => {
  const discussions = await clubDiscussionsModel.find({ clubId }).lean();
  return discussions;
};

export const createClubDiscussion = async (discussion) => {
  const result = await clubDiscussionsModel.create(discussion);
  return result;
};

export const deleteClubDiscussion = async (discussionId) => {
  const result = await clubDiscussionsModel.deleteOne({ _id: discussionId });
  return result;
};

export const updateDiscussion = async (updateDiscussionInfo) => {
  // eslint-disable-next-line no-underscore-dangle
  const discussionId = updateDiscussionInfo._id;
  // eslint-disable-next-line no-underscore-dangle, no-param-reassign
  delete updateDiscussionInfo._id;
  const result = await clubDiscussionsModel.updateOne(
    { _id: discussionId },
    updateDiscussionInfo,
  ).lean();
  logger.info(result);
  return result;
};

export const getClubMembers = async (clubId) => {
  const members = await clubMembersModel.find({ clubId }).lean();
  return members;
};

export const createClubMember = async (member) => {
  const result = await clubMembersModel.create(member);
  return result;
};

export const deleteClubMember = async (memberId, clubId) => {
  const result = await clubMembersModel.deleteOne({ memberId, clubId });
  return result;
};

export const getClubsByMemberId = async (memberId) => {
  const clubs = await clubMembersModel.find({ memberId }).lean();
  return clubs;
};

export const getClubDiscussionByMedia = async (clubId, mediaType, mediaId) => {
  const result = await clubDiscussionsModel.findOne({ clubId, mediaType, mediaId }).lean();
  return result;
};

export const getDiscussionCommentsByDiscussion = async (discussionId) => {
  const result = await discussionCommentsModel.find({ discussionId }).lean();
  return result;
};

export const createDiscussionComment = async (newComment) => {
  const result = await discussionCommentsModel.create(newComment);
  return result;
};

export const getCommentsForClub = async (clubId) => {
  const result = await discussionCommentsModel.find({ clubId }).lean();
  return result;
};

export const getDiscussionByDiscussionId = async (discussionId) => {
  const result = await clubDiscussionsModel.findOne({ _id: discussionId }).lean();
  return result;
};
