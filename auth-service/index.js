const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config(); // Cargar las variables de entorno desde el archivo .env

const app = express();
const port = process.env.PORT || 8080;

// Middleware para procesar JSON
app.use(express.json());

// Conexión a MongoDB
console.log("Mongo URI:", process.env.MONGO_URI); // Debug para verificar la URI

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

// Definir el esquema y modelo de usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", userSchema);

// Endpoint de salud
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "auth-service" });
});

// Endpoint para registrar usuarios
app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Validar campos requeridos
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Guardar usuario en MongoDB
    const newUser = new User({
      username,
      password_hash: passwordHash,
      email,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: savedUser });
  } catch (err) {
    console.error("Error inserting user:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Auth-service running on port ${port}`);
});

