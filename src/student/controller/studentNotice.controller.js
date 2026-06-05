//studentNotice.controller.js
import noticeService from "../service/studentNotice.service.js";

const createNotice = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by_name: req.user?.name,
    };

    const notice =
      await noticeService.createNotice(payload);

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

const getStudentNotices = async (req, res) => {
  try {
    const { studentId } = req.params;

const notices =
  await noticeService.getStudentNotices(
    studentId
  );

    return res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export default {
  createNotice,
  getStudentNotices,
};