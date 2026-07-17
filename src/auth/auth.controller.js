// auth.controller.js — Real DB authentication only
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../adminuser/models/adminuser.model.js";
import Parent from "../parent/models/parent.models.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

/**
 * POST /login
 *
 * Looks up the user in the AdminUser table, verifies the bcrypt password,
 * and returns a JWT. No hardcoded users — every login must be in the DB.
 *
 * To create users, use the /adminusers endpoint or run the seed script.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user by email (case-insensitive)
    const dbUser = await User.findOne({
      where: { email: email.toLowerCase().trim() },
    });

    if (!dbUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password against bcrypt hash
    const match = await bcrypt.compare(password, dbUser.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Block inactive accounts
    if (!dbUser.is_active) {
      return res.status(403).json({ message: "Account is inactive. Contact admin." });
    }

    // Determine portal flag — Parents linked via user_id can access the parent portal
    let portal = false;
    if (dbUser.role === "Parent") {
      const parentRecord = await Parent.findOne({
        where: { user_id: dbUser.id },
        attributes: ["id"],
      });
      portal = !!parentRecord;
    }

    // Sign JWT
    const token = jwt.sign(
      { id: dbUser.id, role: dbUser.role, email: dbUser.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Persist token for refresh/logout invalidation
    dbUser.token = token;
    await dbUser.save();

    return res.status(200).json({
      token,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        name: dbUser.username || dbUser.email,
        portal,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
