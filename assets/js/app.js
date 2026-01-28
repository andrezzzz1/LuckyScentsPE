// Variables
let articulosCarrito = []; // Array para almacenar los productos agregados al carrito
const carritoContainer = document.querySelector(".offcanvas-body"); // Contenedor donde se renderiza el carrito
const offcanvas = document.querySelector(".offcanvas"); // Elemento del carrito (offcanvas)
const btn_shopping = document.querySelector(".btn_shopping"); // Botón para mostrar el carrito
const subtotalElement = document.getElementById("subtotal"); // Seleccionar el elemento del subtotal para mostrar el total
const contadorCarrito = document.querySelector("#contador-carrito"); // Elemento que muestra el número de productos en el carrito
const closeButton = document.querySelector(".btn-close"); // Botón para cerrar el carrito

// Espera a que el DOM se cargue
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("donas-container").addEventListener("click", agregarAlCarrito);
  renderizarCarrito();
});

// Función para agregar al carrito
function agregarAlCarrito(e) {
  const btn = e.target.closest(".btn-cart");

  if (btn) {
    // Muestra el offcanvas y aplica efecto visual
    offcanvas.classList.add("show");
    btn_shopping.classList.add("balanceo");
    setTimeout(() => {
      btn_shopping.classList.remove("balanceo");
    }, 500);

    const card = btn.closest(".card");
    const producto = {
      id: card.querySelector("img").alt,
      nombre: card.querySelector(".card-title").textContent,
      categoria: card.querySelector(".card-text strong").textContent,
      precio: parseFloat(card.querySelector(".price").textContent.slice(1)),
      cantidad: 1,
      imagen: card.querySelector("img").src,
    };

    const existe = articulosCarrito.find((item) => item.id === producto.id);
    if (existe) {
      existe.cantidad++;
    } else {
      articulosCarrito.push(producto);
    }

    renderizarCarrito();
    actualizarSubtotal();
    actualizarContadorCarrito();
    actualizarEstadoBotonWhatsApp();
  }
}

// Función para renderizar el carrito
function renderizarCarrito() {
  carritoContainer.innerHTML = "";

  if (articulosCarrito.length === 0) {
    carritoContainer.innerHTML = "<p class='text-center'>El carrito está vacío.</p>";
  }

  articulosCarrito.forEach((producto) => {
    const itemHTML = `
      <div class="container mb-3">
        <div class="row align-items-center border-bottom py-2">
          <div class="col-3">
            <img class="img-fluid rounded" src="${producto.imagen}" alt="${producto.nombre}" />
          </div>
          <div class="col-6">
            <h6 class="mb-1 title-product">${producto.nombre}</h6>
            <p class="mb-0 detalles-product">Categoría: ${producto.categoria}</p>
          </div>
          <div class="col-3 text-end">
            <span class="fw-bold"><span class="fs-6 color-gris">${producto.cantidad}x</span>
            <span class="fs-5 precio">$${(producto.precio * producto.cantidad).toFixed(2)}</span>
            </span>
            <button class="btn btn-danger mt-2 btn-borrar" data-id="${producto.id}">
                <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    carritoContainer.insertAdjacentHTML("beforeend", itemHTML);
  });

  agregarEventosBorrar();
}

// Función para eliminar un producto
function agregarEventosBorrar() {
  const botonesBorrar = document.querySelectorAll(".btn-borrar");

  botonesBorrar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const productoId = e.target.closest("button").dataset.id;

      articulosCarrito = articulosCarrito
        .map((producto) => {
          if (producto.id === productoId) {
            if (producto.cantidad > 1) {
              producto.cantidad--;
              return producto;
            }
            return null;
          }
          return producto;
        })
        .filter((producto) => producto !== null);

      renderizarCarrito();
      actualizarSubtotal();
      actualizarContadorCarrito();
      actualizarEstadoBotonWhatsApp();
    });
  });
}

// Función para calcular subtotal
function actualizarSubtotal() {
  const subtotal = articulosCarrito.reduce((total, producto) => {
    return total + producto.precio * producto.cantidad;
  }, 0);
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
}

// Función para actualizar contador
function actualizarContadorCarrito() {
  const totalProductos = articulosCarrito.length;
  contadorCarrito.textContent = totalProductos;
}

// --- FUNCIÓN WHATSAPP TIPO TICKET (Solución Definitiva) ---
function generarPedidoWhatsApp() {
  if (articulosCarrito.length === 0) {
    alert("El carrito está vacío. ¡Agrega productos antes de enviar el pedido!");
    return;
  }

  // Encabezado usando solo texto seguro (ASCII)
  let mensaje = "HOLA TÍO LUCKY VENGO DE LA WEB.\n";
  mensaje += "QUIERO REALIZAR ESTE PEDIDO:\n\n";
  
  mensaje += "=============================\n";
  mensaje += "       TICKET DE COMPRA      \n";
  mensaje += "=============================\n\n";

  // Cuerpo del pedido
  articulosCarrito.forEach((producto) => {
    const subtotal = (producto.precio * producto.cantidad).toFixed(2);
    
    // Formato limpio tipo factura
    mensaje += "+ " + producto.nombre.toUpperCase() + "\n";
    mensaje += "   Cant: " + producto.cantidad + "  x  S/." + producto.precio + "  =  S/." + subtotal + "\n";
    mensaje += "   --------------------------\n";
  });

  // Cálculo del total
  const total = articulosCarrito.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );

  // Pie del ticket
  mensaje += "\n=============================\n";
  mensaje += " TOTAL A PAGAR:  S/." + total.toFixed(2) + "\n";
  mensaje += "=============================\n\n";
  
  // Datos de entrega
  mensaje += "MIS DATOS DE ENTREGA:\n";
  mensaje += "> Nombre: \n";
  mensaje += "> Número: \n\n";
  mensaje += "(Quedo atento a la confirmacion)";

  // Enviar a WhatsApp
  const mensajeCodificado = encodeURIComponent(mensaje);
  const urlWhatsApp = `https://wa.me/51940815582?text=${mensajeCodificado}`;

  window.open(urlWhatsApp, "_blank");
}

// Función toggle del carrito
function toggleOffcanvas(show) {
  offcanvas.style.transition = "transform 0.6s ease, opacity 0.6s ease";
  if (show) {
    offcanvas.classList.add("show");
  } else {
    offcanvas.classList.remove("show");
    offcanvas.classList.add("hiding");
    setTimeout(() => offcanvas.classList.remove("hiding"), 600);
  }
}

// Eventos del botón de carrito
btn_shopping.addEventListener("click", () => {
  toggleOffcanvas(!offcanvas.classList.contains("show"));
  btn_shopping.classList.toggle("balanceo");
});

closeButton.addEventListener("click", () => toggleOffcanvas(false));

// Control del botón de WhatsApp
const btnWhatsApp = document.querySelector("button[onclick='generarPedidoWhatsApp()']");

function actualizarEstadoBotonWhatsApp() {
  if (btnWhatsApp) {
    if (articulosCarrito.length === 0) {
      btnWhatsApp.disabled = true;
    } else {
      btnWhatsApp.disabled = false;
    }
  }
}

actualizarEstadoBotonWhatsApp();