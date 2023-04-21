import mongoose from 'mongoose';
import {
  clubAnnouncementsSchema, clubDiscussionsSchema, clubMembersSchema,
} from './clubSchema.js';
import logger from '../../logger.js';

export const clubAnnouncementsModel = mongoose.model('ClubAnnouncementsModel', clubAnnouncementsSchema);
export const clubDiscussionsModel = mongoose.model('ClubDiscussionsModel', clubDiscussionsSchema);
export const clubMembersModel = mongoose.model('ClubMembersModel', clubMembersSchema);

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
  logger.info(memberId);
  const clubs = await clubMembersModel.find({ memberId }).lean();
  logger.info(clubs);
  return clubs;
};
