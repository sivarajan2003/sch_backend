import jwt from "jsonwebtoken";

const USERS = [
  { id: 1, email: "admin@preskool.com", password: "admin123", role: "admin" },
  { id: 2, email: "student@preskool.com", password: "admin123", role: "student" },
  { id: 3, email: "teacher@preskool.com", password: "admin123", role: "teacher" },

  // Normal Parent
  { id: 4, email: "parent@preskool.com", password: "admin123", role: "parent" },

  {
    id: 6,
    email: "parentportal@preskool.com",
    password: "admin123",
    role: "parent",
    portal: true, // 🔥 KEY FLAG
  },
  { id: 5, email: "receptionist@preskool.com", password: "admin123", role: "receptionist" },
];


export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("🔥 LOGIN HIT");
  console.log("REQ BODY:", req.body);
  console.log("EMAIL:", email);
  console.log("PASSWORD:", password);

  console.log(
    "ALL USERS:",
    USERS.map((u) => ({
      email: u.email,
      password: u.password,
      role: u.role,
      portal: u.portal,
    }))
  );

  const user = USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    console.log("❌ NO MATCHING USER FOUND");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  console.log("✅ USER FOUND:", user.email);

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
      portal: user.portal || false,
    },
  });
};
