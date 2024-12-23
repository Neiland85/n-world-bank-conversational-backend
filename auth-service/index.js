const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const app = express();
app.use(express.json());

// Cargar variables de entorno
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.resolve(__dirname, '../', envFile) });
console.log(`Using environment file: ${envFile}`);

/**
 * Cargar secretos desde Azure Key Vault
 */
async function loadSecrets() {
  if (process.env.NODE_ENV === 'production') {
    try {
      const keyVaultName = process.env.KEY_VAULT_NAME;
      if (!keyVaultName) {
        throw new Error('KEY_VAULT_NAME is not defined in environment variables.');
      }

      const credential = new DefaultAzureCredential();
      const url = `https://${keyVaultName}.vault.azure.net`;

      const client = new SecretClient(url, credential);

      const mongoUri = await client.getSecret('mongo-uri');
      const username = await client.getSecret('mongo-initdb-root-username');
      const password = await client.getSecret('mongo-initdb-root-password');

      process.env.MONGO_URI = mongoUri.value;
       process.env.MONGO_INITDB_ROOT_USERNAME = username.value;
       process.env.MONGO_INITDB_ROOT_PASSWORD = password.value;

      console.log('Secrets loaded from Azure Key Vault.');
    } catch (err) {
      console.error('Error loading secrets from Azure Key Vault:', err.message);
       process.exit(1);
    }
  } else {
    console.log(`Running in ${process.env.NODE_ENV || 'development'} mode. Secrets not loaded from Key Vault.`);
  }
}

/**
 * Conectar a MongoDB
 */
async function connectToDatabase() {
  try {
      if (!process.env.MONGO_URI) {
          throw new Error("MONGO_URI is not defined in environment variables.");
        }

    await mongoose.connect(process.env.MONGO_URI); // Removed useNewUrlParser y useUnifiedTopology
      console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
}

// Definir esquema y modelo de usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Endpoint de salud
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'auth-service' });
});

// Endpoint para registrar usuarios
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    const savedUser = await user.save();
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (err) {
    console.error('Error inserting user:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Arrancar el servidor
 */
async function startServer() {
  try {
    await loadSecrets(); // Cargar secretos desde Key Vault si es producción
    await connectToDatabase(); // Conectar a la base de datos

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Auth-service running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

// Iniciar la aplicación
startServer();
