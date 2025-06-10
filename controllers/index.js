const express = require('express');
const cors = require('cors');
const { WebpayPlus } = require('transbank-sdk');

WebpayPlus.configureForIntegration('597055555532', 'https://webpay3gint.transbank.cl');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/crear-transaccion', async (req, res) => {
  const { monto, ordenCompra, sesion } = req.body;

  const response = await WebpayPlus.Transaction.create(
    ordenCompra,
    sesion,
    monto,
    'http://localhost:3000/respuesta-webpay' // URL a la que volverá WebPay
  );

  res.json(response); // Esto incluye el token y la URL
});

app.post('/respuesta-webpay', async (req, res) => {
  const { token_ws } = req.body;

  const resultado = await WebpayPlus.Transaction.commit(token_ws);

  res.json(resultado); // Puedes redirigir a un HTML de éxito
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
