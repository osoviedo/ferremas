const express = require('express');
const cors = require('cors');
const path = require('path');
const { crearTransaccion } = require('./controllers/creartransaccion');

const app = express();
const PORT = 3000; // Cambia a otro puerto si 3000 está ocupado

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para crear transacción
app.post('/crear-transaccion', async (req, res) => {
  try {
    const { monto, ordenCompra, sesion } = req.body;
    const returnUrl = 'http://localhost:3000/retorno'; // Puedes ajustar si tienes otra URL

    const response = await crearTransaccion(ordenCompra, sesion, monto, returnUrl);
    res.json(response);
  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({ error: 'Error al crear transacción' });
  }
});

// Endpoint de retorno de pago
app.post('/retorno', (req, res) => {
  res.send('Pago procesado. Gracias por su compra.');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado en http://localhost:${PORT}`);
});
