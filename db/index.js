import { sequelize } from "../src/db/index.js";
import User from "../src/adminuser/models/adminuser.model.js";
import Teacher from "../src/teacher/models/teacher.models.js";
import Parent from "../src/parent/models/parent.models.js";
import Student from "../src/student/models/student.models.js";
import Class from "../src/school/models/class.models.js";
import Academicyear from "../src/school/models/academicyear.models.js";
import Academicyearconfig from "../src/school/models/academicconfig.models.js";
import Subject from "../src/subject/models/subject.models.js";
import Timetable from "../src/school/models/timetable.models.js";

// Collect all models
const models = {
  User,
  Teacher,
  Parent,
  Student,
  Class,
  Academicyear,
  Academicyearconfig,
  Subject,
  Timetable,
};

// Setup associations
console.log("Setting up associations...");
Object.values(models).forEach((model) => {
  if (model.associate) {
    console.log(`Associating model: ${model.name || "Unknown"}`);
    model.associate(models);
  }
});
console.log("All associations set up.");

// Debug: print which models are associated to Timetable
if (Timetable.associations) {
  console.log("Timetable associations:");
  Object.keys(Timetable.associations).forEach((key) => {
    console.log(`- ${key}`);
  });
} else {
  console.log("No associations found on Timetable!");
}

async function syncDatabase() {
  try {
    console.log("Starting database sync...");
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully");
  } catch (err) {
    console.error("Error syncing database:", err.message);
    throw err;
  }
}

syncDatabase()
  .then(() => console.log("Sync process finished"))
  .catch((err) => console.error("Sync process error", err));
