function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const tbody = document.querySelector('#tabla-carrito tbody');
  const totalSpan = document.getElementById('total-carrito');

  tbody.innerHTML = '';
  let total = 0;

  carrito.forEach((producto, index) => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td><img src="${producto.imagen}" alt="${producto.nombre}" style="width: 80px;"></td>
      <td>$${producto.precio.toLocaleString()}</td>
      <td><input type="number" min="1" class="cantidad-input" data-index="${index}" value="${producto.cantidad}"></td>
      <td>$${subtotal.toLocaleString()}</td>
      <td><button class="btn-eliminar" data-index="${index}">Eliminar</button></td>
    `;
    tbody.appendChild(fila);
  });

  totalSpan.textContent = total.toLocaleString();

  document.querySelectorAll('.cantidad-input').forEach(input => {
    input.addEventListener('change', e => {
      const index = e.target.getAttribute('data-index');
      let nuevaCantidad = parseInt(e.target.value);
      if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
        nuevaCantidad = 1;
        e.target.value = 1;
      }
      actualizarCantidad(index, nuevaCantidad);
    });
  });

  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = e.target.getAttribute('data-index');
      eliminarProducto(index);
    });
  });
}

function actualizarCantidad(index, cantidad) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito[index].cantidad = cantidad;
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

function eliminarProducto(index) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

function vaciarCarrito() {
  localStorage.removeItem('carrito');
  mostrarCarrito();
}

document.getElementById('vaciar-carrito').addEventListener('click', () => {
  if (confirm('¿Vaciar carrito?')) {
    vaciarCarrito();
  }
});

window.addEventListener('load', mostrarCarrito);

// ✅ Función para iniciar la transacción con Transbank
function pagar() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const monto = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  const ordenCompra = "orden" + Date.now();
  const sesion = "usuario-" + Math.floor(Math.random() * 100000);

  fetch('/crear-transaccion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ monto, ordenCompra, sesion })
  })
  .then(res => res.json())
  .then(data => {
    // Redirige al formulario Webpay automáticamente
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = data.url;

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'token_ws';
    input.value = data.token;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  })
  .catch(error => {
    console.error("Error al crear transacción:", error);
    alert("Error al procesar el pago.");
  });
}

// ✅ Escucha el botón "Pagar ahora"
document.getElementById('btn-pagar').addEventListener('click', pagar);
