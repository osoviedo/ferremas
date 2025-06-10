const { WebpayPlus } = require("transbank-sdk");

WebpayPlus.configureForTesting();

async function crearTransaccion(buyOrder, sessionId, amount, returnUrl) {
  return await new WebpayPlus.Transaction().create(
    buyOrder,
    sessionId,
    amount,
    returnUrl
  );
}

module.exports = { crearTransaccion };
