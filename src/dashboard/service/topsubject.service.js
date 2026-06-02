//topsubject.service.js
import Subject from "../../subject/models/subject.models.js";

const getTopSubjects = async () => {
  return await Subject.findAll({
    where: {
      is_active: true,
    },
    attributes: ["id", "name"],
    order: [["createdAt", "DESC"]],
    limit: 10,
  });
};

export default {
  getTopSubjects,
};