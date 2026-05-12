import syllabusService from
"../service/syllabus.service.js";

const createSyllabus =
  async (req, res) => {

    const result =
      await syllabusService.createSyllabus(
        req.body
      );

    res.json({
      success: true,
      data: result
    });
};

const getSyllabus =
  async (req, res) => {

    const result =
      await syllabusService.getSyllabus();

    res.json({
      success: true,
      data: result
    });
};

const deleteSyllabus =
  async (req, res) => {

    await syllabusService.deleteSyllabus(
      req.params.id
    );

    res.json({
      success: true
    });
};

export default {
  createSyllabus,
  getSyllabus,
  deleteSyllabus
};