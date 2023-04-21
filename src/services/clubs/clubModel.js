/* eslint-disable no-underscore-dangle */
import * as clubDao from './clubDao.js';
import * as accountModel from '../accounts/accountModel.js';

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
