import app from './src/index.js';
import dotenv from 'dotenv';
import { sequelize } from './src/db/index.js';
import authRoutes from "./auth/auth.routes.js";


const port = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log(`✅ Server is running on port ${port}`);
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
});
