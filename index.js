require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Crear servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseop del body
app.use(express.json());

// Rutas
app.use('/api/items', require('./routes/items.route'));

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
