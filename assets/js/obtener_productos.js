document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("perfume-container");

  if (!container) return;

  const buscador = document.getElementById("buscador-productos");
  const filtroCategoria = document.getElementById("filtro-categoria");

  let productosFiltrados = [];

  // =========================
  // CREAR TARJETA DE PRODUCTO
  // =========================
function createPerfumeCard(
  { sku, name, price, image, category, brand, size, type, concentration, description },
  index = 0
) {
  const precio = Number(price) || 0;

  const productoId = sku || `${category}-${name}-${size}`
    .toLowerCase()
    .replace(/\s+/g, "-");

  const meta = [concentration, size, type]
    .filter(Boolean)
    .join(" · ");

  const esDecant = category === "Decant";

  let overlayDecant = "";

  if (esDecant) {
    const sizeNormalizado = String(size || "").toLowerCase().replace(/\s/g, "");

    let claseTamano = "decant-default-size";

    if (sizeNormalizado.includes("5ml")) {
      claseTamano = "decant-5ml-size";
    }

    if (sizeNormalizado.includes("10ml")) {
      claseTamano = "decant-10ml-size";
    }

    overlayDecant = `
      <div class="decant-badge ${claseTamano}">
        <img 
          src="assets/imgs/decant-default.png" 
          class="decant-overlay" 
          alt=""
          onerror="this.parentElement.style.display='none'"
        >
      </div>
    `;
  }

  return `
    <div class="col-md-3 reveal" data-delay="${index * 35}">
      <div class="card h-100 border-0 custom-card">

        <div class="product-image-wrapper">
          <img 
            src="assets/img-products/${image}.jpg" 
            class="card-img-top product-image-main" 
            alt="${name}"
          >

          ${overlayDecant}
        </div>

        <div class="card-body d-flex flex-column">

          <div class="card-brand">${brand || "Lucky Scents"}</div>

          <h5 class="card-title">${name}</h5>

          <p class="card-meta">
            ${meta}
          </p>

          <p class="card-description">
            ${description || "Fragancia exclusiva seleccionada para Lucky Scents PE."}
          </p>

          <p class="price mt-auto">
            S/ ${precio.toFixed(2)}
          </p>

          <button 
            class="btn btn-cart w-100 mt-2" 
            data-id="${productoId}"
            data-name="${name}"
            data-category="${category}"
            data-size="${size}"
            data-price="${precio}"
            data-image="assets/img-products/${image}.jpg"
          >
            <i class="bi bi-cart-plus"></i>
            Agregar al carrito
          </button>

        </div>
      </div>
    </div>
  `;
}

  // =========================
  // RENDERIZAR PRODUCTOS
  // =========================
  function renderProductos(lista) {
    if (!lista || lista.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-white fs-5">No se encontraron productos.</p>
        </div>
      `;
      return;
    }

    const html = lista
      .map((producto, index) => createPerfumeCard(producto, index))
      .join("");

    container.innerHTML = html;

    activarAnimacionesProductos();
  }

  // =========================
  // ACTIVAR ANIMACIONES
  // =========================
  function activarAnimacionesProductos() {
    const elementos = container.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("active"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = Number(entry.target.dataset.delay) || 0;

            setTimeout(() => {
              entry.target.classList.add("active");
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    elementos.forEach((el) => observer.observe(el));
  }

  // =========================
  // APLICAR BUSCADOR Y FILTROS
  // =========================
  function aplicarFiltros() {
    const texto = buscador ? buscador.value.toLowerCase().trim() : "";
    const categoria = filtroCategoria ? filtroCategoria.value : "Todos";

    const productosBuscados = productosFiltrados.filter((producto) => {
      const nombre = producto.name ? producto.name.toLowerCase() : "";
      const marca = producto.brand ? producto.brand.toLowerCase() : "";

      const coincideTexto =
        nombre.includes(texto) ||
        marca.includes(texto);

      const coincideCategoria =
        categoria === "Todos" || producto.category === categoria;

      return coincideTexto && coincideCategoria;
    });

    renderProductos(productosBuscados);
  }

  // =========================
  // CARGAR DATOS DESDE JSON
  // =========================
  async function loadPerfume() {
    try {
      const response = await fetch("assets/data/data_perfumes.json");

      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }

      const productos = await response.json();

      const pathname = window.location.pathname.toLowerCase();

      productosFiltrados = productos;

      if (pathname.includes("perfumes.html")) {
        productosFiltrados = productos.filter(
          (producto) => producto.category === "Perfume"
        );
      } else if (pathname.includes("decants.html")) {
        productosFiltrados = productos.filter(
          (producto) => producto.category === "Decant"
        );
      } else if (pathname.includes("sorteos.html")) {
        productosFiltrados = productos.filter(
          (producto) => producto.category === "Sorteo"
        );
      }

      renderProductos(productosFiltrados);

    } catch (error) {
      console.error("Error al cargar los datos:", error);

      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-danger fs-5">
            Hubo un error al cargar los productos.
          </p>
        </div>
      `;
    }
  }

  // =========================
  // EVENTOS
  // =========================
  if (buscador) {
    buscador.addEventListener("input", aplicarFiltros);
  }

  if (filtroCategoria) {
    filtroCategoria.addEventListener("change", aplicarFiltros);
  }

  loadPerfume();
});