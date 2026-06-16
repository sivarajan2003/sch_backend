//teacherAttendance.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";

const TeacherAttendance = sequelize.define(
  "TeacherAttendance",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    teacher_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    attendance_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "Present",
        "Absent",
        "Late",
        "Half Day"
      ),
      allowNull: false,
    },
  },
  {
    tableName: "teacher_attendance",
    timestamps: true,
  }
);

export default TeacherAttendance;