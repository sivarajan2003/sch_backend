//noticeboard.service.js
import NoticeBoard from "../models/noticeboard.model.js";

const createNotice = async (payload) => {
  return await NoticeBoard.create(payload);
};

const getNotices = async () => {
  return await NoticeBoard.findAll({
    where: {
      is_active: true,
    },
    order: [["createdAt", "DESC"]],
  });
};

const deleteNotice = async (id) => {
  const notice = await NoticeBoard.findByPk(id);

  if (!notice) {
    throw new Error("Notice not found");
  }

  await notice.destroy();

  return true;
};

export default {
  createNotice,
  getNotices,
  deleteNotice,
};