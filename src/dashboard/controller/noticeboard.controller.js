//noticeboard.controller.js
import noticeService from "../service/noticeboard.service.js";

const createNotice = async (req, res) => {
  try {
    const notice = await noticeService.createNotice(req.body);

    res.status(201).json({
      success: true,
      data: notice,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getNotices = async (req, res) => {
  try {
    const notices = await noticeService.getNotices();

    res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteNotice = async (req, res) => {
  try {
    await noticeService.deleteNotice(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  createNotice,
  getNotices,
  deleteNotice,
};