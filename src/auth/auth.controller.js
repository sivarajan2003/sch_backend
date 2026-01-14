import jwt from "jsonwebtoken";

const USERS = [
  { id: 1, email: "admin@preskool.com", password: "admin123", role: "admin" },
  { id: 2, email: "student@preskool.com", password: "admin123", role: "student" },
  { id: 3, email: "teacher@preskool.com", password: "admin123", role: "teacher" },
  { id: 4, email: "parent@preskool.com", password: "admin123", role: "parent" },
  { id: 5, email: "receptionist@preskool.com", password: "admin123", role: "receptionist" },
];

export const login = async (req, res) => {
  const { email, password } = req.body;

  // ✅ DEBUG (KEEP THIS)
  console.log("LOGIN REQUEST RECEIVED:", email, password);

  // 🔍 FIND USER
  const user = USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    console.log("❌ LOGIN FAILED");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 🔐 CREATE TOKEN
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
  );

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
};
