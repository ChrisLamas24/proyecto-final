// main.js - desarrollado para pages: index, products, product detail, contact handling
const API_BASE = 'https://fakestoreapi.com';

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.id;
  if (page === 'page-products') initProductsPage();
  if (page === 'page-product-detail') initProductDetailPage();
  if (page === 'page-home') initHomePage();
  initContactForm();
});

// ---------- Home page hooks (opcional)
function initHomePage(){
  // nada crítico aquí, pero podemos usarlo si queremos dinamizar categorías
  // por ahora el index usa enlaces estáticos a products.html?category=
}

// ---------- Contact form (funciona sin backend; instrucciones para Formspree en README)
function initContactForm(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const alertBox = document.getElementById('contactAlert');

    if (!name || !email || !message) {
      showContactAlert('Por favor completa todos los campos.', 'danger');
      return;
    }

    // Opción 1: enviar a Formspree (debes crear una cuenta y reemplazar URL)
    // const FORMSPREE_URL = 'https://formspree.io/f/tu_codigo';
    // await fetch(FORMSPREE_URL, { method: 'POST', body: new FormData(form) });

    // Como fallback — simulamos envío y mostramos instrucciones:
    showContactAlert('Gracias, tu mensaje fue recibido (simulado). En README indico cómo conectar Formspree o Netlify Forms.', 'success');
    form.reset();
  });
}
function showContactAlert(msg, type='success'){
  const el = document.getElementById('contactAlert');
  el.className = `alert alert-${type}`;
  el.textContent = msg;
  el.classList.remove('d-none');
  setTimeout(()=> el.classList.add('d-none'), 5000);
}

// ---------- Products page
async function initProductsPage(){
  const select = document.getElementById('categorySelect');
  const grid = document.getElementById('productGrid');
  const loader = document.getElementById('productsLoader');
  const errorBox = document.getElementById('productsError');

  showElement(loader);

  try {
    const categories = await fetchJSON(`${API_BASE}/products/categories`);
    // categories is an array of strings
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = capitalize(cat);
      select.appendChild(opt);
    });

    // read category from URL ?category=
    const params = new URLSearchParams(location.search);
    const qCat = params.get('category') || '';
    if (qCat) select.value = qCat;

    // load products (all or by category)
    await loadAndShowProducts(qCat);

    // handlers
    select.addEventListener('change', () => {
      const cat = select.value;
      // update URL without reload
      const url = new URL(location);
      if (cat) url.searchParams.set('category', cat); else url.searchParams.delete('category');
      history.replaceState({}, '', url);
      loadAndShowProducts(cat);
    });
  } catch (err){
    console.error(err);
    showError('Error al cargar categorías. Intenta de nuevo más tarde.', errorBox);
  } finally {
    hideElement(loader);
  }

  async function loadAndShowProducts(category=''){
    grid.innerHTML = '';
    hideElement(errorBox);
    showElement(loader);
    try {
      const url = category ? `${API_BASE}/products/category/${encodeURIComponent(category)}` : `${API_BASE}/products`;
      const products = await fetchJSON(url);
      if (!Array.isArray(products) || products.length === 0){
        grid.innerHTML = '<p class="text-muted">No hay productos en esta categoría.</p>';
        return;
      }
      // render
      products.forEach(p => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-4 col-lg-3';
        col.innerHTML = productCardHTML(p);
        grid.appendChild(col);

        // attach click to open modal
        col.querySelector('.view-product')?.addEventListener('click', (e)=>{
          e.preventDefault();
          openProductModal(p);
        });
      });
    } catch (err){
      console.error(err);
      showError('Error al cargar productos. Intenta recargar la página.', errorBox);
    } finally {
      hideElement(loader);
    }
  }
}

// ---------- Product detail page
async function initProductDetailPage(){
  const loader = document.getElementById('productLoader');
  const errorBox = document.getElementById('productError');
  const container = document.getElementById('productDetail');
  showElement(loader);
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) {
    showError('ID de producto no especificado en la URL (?id=).', errorBox);
    hideElement(loader);
    return;
  }
  try {
    const product = await fetchJSON(`${API_BASE}/products/${encodeURIComponent(id)}`);
    container.innerHTML = `
      <div class="col-md-5">
        <img src="${product.image}" alt="${escapeHtml(product.title)}" class="img-fluid rounded">
      </div>
      <div class="col-md-7">
        <h2>${escapeHtml(product.title)}</h2>
        <p class="text-muted">Categoría: ${escapeHtml(product.category)}</p>
        <p>${escapeHtml(product.description)}</p>
        <p class="h4 fw-bold">$${product.price}</p>
        <a href="#" class="btn btn-success">Comprar</a>
      </div>
    `;
  } catch (err){
    console.error(err);
    showError('Error cargando el producto. Intenta recargar.', errorBox);
  } finally {
    hideElement(loader);
  }
}

// ---------- Utilities y helpers
async function fetchJSON(url){
  const res = await fetch(url);
  if (!res.ok) throw new Error('Fetch failed: ' + res.status);
  return await res.json();
}
function productCardHTML(p){
  return `
    <div class="card h-100">
      <img src="${p.image}" class="card-img-top" style="height:220px;object-fit:contain;padding:1rem;background:#fff;" alt="${escapeHtml(p.title)}">
      <div class="card-body d-flex flex-column">
        <h6 class="card-title">${escapeHtml(p.title)}</h6>
        <p class="card-text text-muted small mb-2">${escapeHtml(p.category)}</p>
        <div class="mt-auto d-flex justify-content-between align-items-center">
          <strong>$${p.price}</strong>
          <div>
            <a href="#" class="btn btn-sm btn-outline-primary view-product">Ver</a>
            <a href="product.html?id=${p.id}" class="btn btn-sm btn-primary">Detalle</a>
          </div>
        </div>
      </div>
    </div>
  `;
}
function openProductModal(p){
  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalImage').src = p.image;
  document.getElementById('modalDescription').textContent = p.description;
  document.getElementById('modalPrice').textContent = p.price;
  const pageLink = document.getElementById('modalProductPage');
  pageLink.href = `product.html?id=${p.id}`;
  modal.show();
}
function showError(msg, el){
  if (!el) return alert(msg);
  el.textContent = msg;
  el.classList.remove('d-none');
}
function hideElement(el){ if (el) el.classList.add('d-none'); }
function showElement(el){ if (el) el.classList.remove('d-none'); }
function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function escapeHtml(text){
  if (!text) return '';
  return text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}
