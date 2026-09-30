const API = '/api/products';

const $ = (id) => document.getElementById(id);

const ui = {
  products: $('products'),
  loading: $('loading'),
  empty: $('empty'),
  search: $('search'),
  category: $('category'),
  clear: $('clearBtn'),
  add: $('addBtn'),
  modal: $('modal'),
  confirm: $('confirm'),
  form: $('form'),
  modalTitle: $('modalTitle'),
  id: $('id'),
  name: $('name'),
  description: $('description'),
  price: $('price'),
  stock: $('stockInput'),
  categoryInput: $('categoryInput'),
  formError: $('formError'),
  save: $('saveBtn'),
  confirmDelete: $('confirmDelete'),
  cancelDelete: $('cancelDelete'),
  toast: $('toast'),
  status: $('apiStatus'),
  count: $('count'),
  stockTotal: $('stock')
};

let products = [];
let deleteId = null;
let toastTimer;


/* ================================
   INITIALIZE APPLICATION
================================ */

document.addEventListener('DOMContentLoaded', () => {

  ui.add.addEventListener('click', () => openForm());

  ui.form.addEventListener('submit', saveProduct);

  ui.search.addEventListener('input', loadProducts);

  ui.category.addEventListener('change', loadProducts);


  ui.clear.addEventListener('click', () => {

    ui.search.value = '';

    ui.category.value = '';

    loadProducts();

  });


  document.querySelectorAll('[data-close]').forEach((button) => {

    button.addEventListener('click', closeForm);

  });


  ui.confirmDelete.addEventListener(
    'click',
    removeProduct
  );


  ui.cancelDelete.addEventListener(
    'click',
    closeConfirm
  );


  checkHealth();

  loadProducts();

});


/* ================================
   CHECK API CONNECTION
================================ */

async function checkHealth() {

  try {

    const response = await fetch('/api/health');

    if (!response.ok) {
      throw new Error();
    }


    ui.status.innerHTML =
      '<span style="background:#21a366"></span> API Connected';

  } catch {

    ui.status.innerHTML =
      '<span style="background:#c83e4d"></span> API Offline';

  }

}


/* ================================
   LOAD PRODUCTS
================================ */

async function loadProducts() {

  ui.loading.classList.remove('hidden');

  ui.empty.classList.add('hidden');


  const params = new URLSearchParams();

  const search = ui.search.value.trim();

  const category = ui.category.value;


  if (search) {
    params.set('search', search);
  }


  if (category) {
    params.set('category', category);
  }


  try {

    const response = await fetch(
      `${API}?${params}`
    );


    const result = await response.json();


    if (!response.ok) {
      throw new Error(
        result.message || 'Unable to load products'
      );
    }


    products = result.data || [];


    renderCategories(products);

    renderProducts(products);


    ui.count.textContent =
      `${products.length} product${
        products.length === 1 ? '' : 's'
      }`;


    ui.stockTotal.textContent =
      `Stock: ${
        products.reduce(
          (sum, p) => sum + Number(p.stock || 0),
          0
        )
      }`;


  } catch (error) {

    ui.products.innerHTML = '';

    ui.empty.textContent = error.message;

    ui.empty.classList.remove('hidden');

  } finally {

    ui.loading.classList.add('hidden');

  }

}


/* ================================
   CATEGORY FILTER
================================ */

function renderCategories(currentProducts) {

  const selected = ui.category.value;


  const categories = [
    ...new Set(
      currentProducts
        .map((p) => p.category)
        .filter(Boolean)
    )
  ].sort();


  ui.category.innerHTML =
    '<option value="">All categories</option>';


  categories.forEach((item) => {

    const option =
      document.createElement('option');

    option.value = item;

    option.textContent = item;

    ui.category.appendChild(option);

  });


  if (categories.includes(selected)) {
    ui.category.value = selected;
  }

}


/* ================================
   DISPLAY PRODUCTS
================================ */

function renderProducts(items) {

  ui.products.innerHTML = '';


  if (!items.length) {

    ui.empty.classList.remove('hidden');

    return;

  }


  items.forEach((product) => {

    const card =
      document.createElement('article');

    card.className = 'card';


    /*
      ONE IMAGE FOR ALL PRODUCTS

      The image is NOT stored in MongoDB.
      Every product uses the same local image.
    */

    const image = `
      <img
        class="card-image"
        src="/images/Cover.jpg"
        alt="Product"
      >
    `;


    const lowClass =
      Number(product.stock) <= 5
        ? 'low'
        : '';


    card.innerHTML = `

      ${image}

      <div class="card-body">

        <span class="category">
          ${escapeHtml(product.category)}
        </span>


        <h3>
          ${escapeHtml(product.name)}
        </h3>


        <p class="description">
          ${escapeHtml(product.description)}
        </p>


        <div class="meta">

          <span class="price">
            ₱${Number(product.price).toLocaleString(
              'en-PH',
              {
                minimumFractionDigits: 2
              }
            )}
          </span>


          <span class="stock ${lowClass}">
            Stock: ${Number(product.stock)}
          </span>

        </div>


        <div class="card-actions">

          <button
            class="btn secondary"
            data-edit="${product._id}"
          >
            Edit
          </button>


          <button
            class="btn danger"
            data-delete="${product._id}"
          >
            Delete
          </button>

        </div>

      </div>

    `;


    ui.products.appendChild(card);

  });


  /* ================================
     EDIT BUTTONS
  ================================= */

  ui.products
    .querySelectorAll('[data-edit]')
    .forEach((button) => {

      button.addEventListener(
        'click',
        () => {

          const product =
            products.find(
              (p) =>
                p._id === button.dataset.edit
            );


          if (product) {
            openForm(product);
          }

        }
      );

    });


  /* ================================
     DELETE BUTTONS
  ================================= */

  ui.products
    .querySelectorAll('[data-delete]')
    .forEach((button) => {

      button.addEventListener(
        'click',
        () =>
          openConfirm(
            button.dataset.delete
          )
      );

    });

}


/* ================================
   OPEN ADD / EDIT FORM
================================ */

function openForm(product = null) {

  ui.form.reset();

  ui.formError.classList.add('hidden');


  if (product) {

    ui.modalTitle.textContent =
      'Edit Product';

    ui.save.textContent =
      'Update Product';


    ui.id.value =
      product._id;

    ui.name.value =
      product.name;

    ui.description.value =
      product.description;

    ui.price.value =
      product.price;

    ui.stock.value =
      product.stock;

    ui.categoryInput.value =
      product.category;


  } else {

    ui.modalTitle.textContent =
      'Add Product';

    ui.save.textContent =
      'Save Product';

    ui.id.value = '';

  }


  ui.modal.classList.remove('hidden');

  ui.name.focus();

}


/* ================================
   CLOSE FORM
================================ */

function closeForm() {

  ui.modal.classList.add('hidden');

}


/* ================================
   SAVE / UPDATE PRODUCT
================================ */

async function saveProduct(event) {

  event.preventDefault();


  const id = ui.id.value;


  /*
    IMPORTANT:

    No imageUrl is sent to MongoDB.

    The database only receives:
    name
    description
    price
    category
    stock
  */

  const payload = {

    name: ui.name.value.trim(),

    description:
      ui.description.value.trim(),

    price:
      Number(ui.price.value),

    category:
      ui.categoryInput.value.trim(),

    stock:
      Number(ui.stock.value)

  };


  if (
    !payload.name ||
    !payload.description ||
    !payload.category
  ) {

    showFormError(
      'Please complete all required fields.'
    );

    return;

  }


  if (
    payload.price < 0 ||
    payload.stock < 0
  ) {

    showFormError(
      'Price and stock cannot be negative.'
    );

    return;

  }


  try {

    const response = await fetch(
      id
        ? `${API}/${id}`
        : API,
      {

        method:
          id
            ? 'PATCH'
            : 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify(payload)

      }
    );


    const result =
      await response.json();


    if (!response.ok) {

      showFormError(
        result.message ||
        'Request failed'
      );

      return;

    }


    closeForm();


    showToast(
      id
        ? 'Product updated.'
        : 'Product created.'
    );


    loadProducts();


  } catch (error) {

    showFormError(
      'Unable to connect to the API.'
    );

  }

}


/* ================================
   DELETE CONFIRMATION
================================ */

function openConfirm(id) {

  deleteId = id;

  ui.confirm.classList.remove(
    'hidden'
  );

}


function closeConfirm() {

  deleteId = null;

  ui.confirm.classList.add(
    'hidden'
  );

}


/* ================================
   DELETE PRODUCT
================================ */

async function removeProduct() {

  if (!deleteId) {
    return;
  }


  try {

    const response =
      await fetch(
        `${API}/${deleteId}`,
        {
          method: 'DELETE'
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      showToast(
        result.message ||
        'Unable to delete product'
      );

      return;

    }


    closeConfirm();


    showToast(
      'Product deleted.'
    );


    loadProducts();


  } catch (error) {

    showToast(
      'Unable to connect to the API.'
    );

  }

}


/* ================================
   FORM ERROR
================================ */

function showFormError(message) {

  ui.formError.textContent =
    message;

  ui.formError.classList.remove(
    'hidden'
  );

}


/* ================================
   TOAST
================================ */

function showToast(message) {

  clearTimeout(toastTimer);


  ui.toast.textContent =
    message;


  ui.toast.classList.remove(
    'hidden'
  );


  toastTimer =
    setTimeout(
      () =>
        ui.toast.classList.add(
          'hidden'
        ),
      2500
    );

}


/* ================================
   ESCAPE HTML
================================ */

function escapeHtml(value) {

  return String(value ?? '')

    .replaceAll(
      '&',
      '&amp;'
    )

    .replaceAll(
      '<',
      '&lt;'
    )

    .replaceAll(
      '>',
      '&gt;'
    )

    .replaceAll(
      '"',
      '&quot;'
    )

    .replaceAll(
      "'",
      '&#039;'
    );

}