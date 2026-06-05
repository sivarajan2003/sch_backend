//studentfees.controller.js
import feeService from "../service/studentfees.service.js";

const getStudentFees = async (
  req,
  res
) => {
  try {
    const { studentId } = req.params;

    const fees =
      await feeService.getStudentFees(
        studentId
      );

    return res.status(200).json({
      success: true,
      data: fees,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  getStudentFees,
};
