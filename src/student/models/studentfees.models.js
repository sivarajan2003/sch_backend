//studentfees.models.js
import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";
import Student from "./student.models.js";

const StudentFees = sequelize.define(
  "StudentFees",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    fee_type: {
      type: DataTypes.ENUM(
        "Transport Fees",
        "Book Fees",
        "Exam Fees",
        "Mess Fees",
        "Hostel Fees"
      ),
      allowNull: false,
    },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    due_date: {
      type: DataTypes.DATEONLY,
    },

    status: {
      type: DataTypes.ENUM(
        "Paid",
        "Pending"
      ),
      defaultValue: "Pending",
    },
  },
  {
    tableName: "student_fees",
    timestamps: true,
  }
);

StudentFees.belongsTo(Student, {
  foreignKey: "student_id",
  as: "student",
});

export default StudentFees;