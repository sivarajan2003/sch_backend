//performance.service,js
import Student from "../../student/models/student.models.js";
//import StudentMark from "../../marks/models/studentMarks.models.js";
//import Class from "../../class/models/class.models.js";

const getBestPerformers = async () => {

  const students =
    await StudentMark.findAll({

      include: [
        {
          model: Student,
          attributes: [
            "id",
            "name",
            "profile_image"
          ] 
        },
        {
          model: Class,
          attributes: [
            "class_name",
            "section"
          ]
        }
      ],

      order: [
        ["percentage", "DESC"]
      ]
    });

  const grouped = {};

  students.forEach((s) => {

    const cls =
      `${s.Class.class_name}, ${s.Class.section}`;

    if (!grouped[cls]) {
      grouped[cls] = [];
    }

    grouped[cls].push({
      id: s.Student.id,
      name: s.Student.name,
      image:
        s.Student.profile_image,
      percentage:
        s.percentage
    });
  });

  return grouped;
};

const getStudentProgress = async () => {

  const students =
    await StudentMark.findAll({

      include: [
        {
          model: Student,
          attributes: [
            "id",
            "name",
            "profile_image"
          ]
        },
        {
          model: Class,
          attributes: [
            "class_name",
            "section"
          ]
        }
      ],

      order: [
        ["percentage", "DESC"]
      ],

      limit: 5
    });

  return students.map((s) => ({
    id: s.Student.id,
    name: s.Student.name,
    image:
      s.Student.profile_image,
    percentage:
      s.percentage,
    class:
      `${s.Class.class_name}, ${s.Class.section}`
  }));
};

export default {
  getBestPerformers,
  getStudentProgress
};