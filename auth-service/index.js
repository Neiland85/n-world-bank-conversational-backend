const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Crear la aplicación de Express
const app = express();
const port = process.env.PORT || 8080;

// Middleware para procesar JSON
app.use(express.json());

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI;
console.log("Mongo URI:", MONGO_URI); // Debug para verificar la URI

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

// Definir el esquema y modelo de usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", userSchema);

// Endpoint de salud
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "auth-service" });
});

// Endpoint para registrar usuarios
app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Guardar usuario en MongoDB
    const newUser = new User({
      username,
      passwordHash,
      email,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (err) {
    console.error("Error inserting user:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Auth-service running on port ${port}`);
});
