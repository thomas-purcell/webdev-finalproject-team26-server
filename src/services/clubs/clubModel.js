/* eslint-disable no-underscore-dangle */
import * as clubDao from './clubDao.js';
import * as accountModel from '../accounts/accountModel.js';
// eslint-disable-next-line no-unused-vars
import logger from '../../logger.js';

export const getClubAnnouncements = async (clubId) => {
  const announcements = await clubDao.getClubAnnouncements(clubId);
  return announcements;
};

export const createClubAnnouncement = async (announcement) => {
  const result = await clubDao.createClubAnnouncement(announcement);
  return result;
};

export const deleteClubAnnouncement = async (announcementId) => {
  const result = await clubDao.deleteClubAnnouncement(announcementId);
  return result;
};

export const getClubDiscussions = async (clubId) => {
  const discussions = await clubDao.getClubDiscussions(clubId);
  return discussions;
};

export const createClubDiscussion = async (discussion) => {
  const result = await clubDao.createClubDiscussion(discussion);
  return result;
};

export const deleteClubDiscussion = async (discussionId) => {
  const result = await clubDao.deleteClubDiscussion(discussionId);
  return result;
};

export const getClubMembers = async (clubId) => {
  const members = await clubDao.getClubMembers(clubId);
  return members;
};

export const createClubMember = async (member) => {
  const result = await clubDao.createClubMember(member);
  return result;
};

export const deleteClubMember = async (memberId, clubId) => {
  const result = await clubDao.deleteClubMember(memberId, clubId);
  return result;
};

const getMoreClubData = async (club) => {
  const [announcements, discussions, members] = await Promise.all([
    getClubAnnouncements(club._id),
    getClubDiscussions(club._id),
    getClubMembers(club._id),
  ]);
  return {
    ...club,
    announcements,
    discussions,
    members,
  };
};

export const getClubs = async () => {
  const clubs = await accountModel.getClubs();
  const clubPromises = clubs.map(async (club) => getMoreClubData(club));
  const result = await Promise.all(clubPromises);
  return result;
};

export const getClubByClubUsername = async (clubUsername) => {
  const club = await accountModel.getUserByUsername(clubUsername);
  const result = await getMoreClubData(club);
  return result;
};

export const getClubsByMemberUsername = async (memberUsername) => {
  const { _id: memberId } = await accountModel.getUserByUsername(memberUsername);
  const clubs = await clubDao.getClubsByMemberId(memberId);

  const clubAccounts = await Promise.all(
    clubs.map((club) => accountModel.getAccountById(club.clubId)),
  );

  const clubPromises = clubAccounts.map(async (club) => getMoreClubData(club));
  const result = await Promise.all(clubPromises);
  return result;
};

export const getNewMembersByClub = async (clubUsername) => {
  const club = await accountModel.getUserByUsername(clubUsername);
  const members = await clubDao.getClubMembers(club._id);
  const sortedMembers = members.sort((a, b) => new Date(b) - new Date(a)).splice(0, 3);
  const enrichedMembers = await Promise.all(sortedMembers.map(async (member) => {
    const profile = await accountModel.getAccountById(member.memberId);
    return {
      ...member,
      username: profile.username,
    };
  }));
  return enrichedMembers;
};

export const getPopularClubs = async () => {
  const clubs = await getClubs();
  const enrichedClubs = await Promise.all(clubs.map(async (club) => ({
    username: club.username,
    orgName: club.orgName,
    numMembers: club.members.length,
  })));
  const sortedClubs = enrichedClubs.sort((a, b) => b.numMembers - a.numMembers);
  return sortedClubs.splice(0, 3);
};

export const getClubAnnouncementsForUser = async (username) => {
  const { _id: memberId } = await accountModel.getUserByUsername(username);
  const clubs = await clubDao.getClubsByMemberId(memberId);
  const announcements = await Promise.all(clubs.map(async (club) => {
    const clubInfo = await accountModel.getAccountById(club.clubId);
    const clubAnnouncements = await clubDao.getClubAnnouncements(club.clubId);
    return clubAnnouncements.map((announcement) => ({
      orgName: clubInfo.orgName,
      username: clubInfo.username,
      ...announcement,
    }));
  }));
  return announcements.flat();
};

const getReplies = (parent, comments) => {
  const replies = comments.filter((child) => parent._id.toString() === child.replyToId);
  if (replies) {
    return replies.map((c) => ({
      ...c,
      replies: getReplies(c, comments),
    }));
  }
  return replies;
};

const transformComments = (comments) => {
  const parents = comments.filter((c) => c.replyToId === null);
  const result = parents.map((parent) => ({
    ...parent,
    replies: getReplies(parent, comments),
  }));
  return result;
};

export const getClubDiscussionForMedia = async (clubUsername, mediaType, mediaId) => {
  const { _id: clubId } = await accountModel.getUserByUsername(clubUsername);
  const discussion = await clubDao.getClubDiscussionByMedia(clubId, mediaType, mediaId);
  const comments = await clubDao.getDiscussionCommentsByDiscussion(discussion._id);
  const transformedComments = transformComments(comments);
  return {
    ...discussion,
    comments: transformedComments,
  };
};
