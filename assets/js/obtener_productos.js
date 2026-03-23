document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("perfume-container");

  if (!container) return;

  // 🔥 Crear tarjeta
function createPerfumeCard({ name, price, image, category, brand, size, type, concentration, description,  }) {
  return `
    <div class="col-md-3">
      <div class="card h-100 border-0 custom-card">
        
        <img src="assets/img-products/${image}.jpg" 
             class="card-img-top" 
             alt="${name}">

        <div class="card-body d-flex flex-column">

          <h5 class="card-title">${name}</h5>

          <p class="mb-1"><strong>${brand}</strong></p>
          <p class="mb-1 text-muted">${type} • ${size} • ${concentration}</p>

          <p class="small text-muted">${description}</p>

          <p class="price mt-auto fw-bold fs-5">
            S/ ${price.toFixed(2)}
          </p>

          <button class="btn btn-cart w-100 mt-2" data-id="${name}">
            Agregar al carrito <i class="bi bi-cart-plus"></i>
          </button>

        </div>
      </div>
    </div>
  `;
}

  // 🔥 Cargar datos
  async function loadPerfume() {
    try {
      const response = await fetch("assets/data/data_perfumes.json");

      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }

      const productos = await response.json(); // ✅ CORREGIDO

      const pathname = window.location.pathname;

      let productosFiltrados = productos;

      if (pathname.includes("perfumes.html")) {
        productosFiltrados = productos.filter(p => p.category === "Perfume");
      } else if (pathname.includes("decants.html")) {
        productosFiltrados = productos.filter(p => p.category === "Decant");
      } else if (pathname.includes("sorteos.html")) {
        productosFiltrados = productos.filter(p => p.category === "Sorteo");
      }

      const perfumeCards = productosFiltrados
        .map(p => createPerfumeCard(p))
        .join("");

      container.innerHTML = perfumeCards;

    } catch (error) {
      console.error("Error al cargar los datos:", error);
      container.innerHTML = `<p class="text-danger text-center">Hubo un error al cargar los datos.</p>`;
    }
  }

  loadPerfume();
});