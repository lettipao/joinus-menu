let editingId = null;
let products = [];
let searchTimeout = 0;

/* SHORTCUT */
const $ = id => document.getElementById(id);

/* RESET EDITOR */
function resetEditor() {

  editingId = null;

  nome.value = "";
  price.value = "";
  desc.value = "";
  image.value = "";

  category.selectedIndex = 0;

  $("preview").style.display = "none";

}

/* LOGIN */
async function login() {

  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });

  if (!res.ok) {
    return toast.error("Login errato");
  }

  loginBox.classList.add("hidden");
  panel.classList.remove("hidden");


  load();
}

/* LOAD */
async function load() {

  const res = await fetch("/api/products/admin", {
    credentials: "include"
  });

  products = await res.json();

  $("statTotal").textContent = products.length;

  $("statVisible").textContent =
    products.filter(p => p.visible === 1).length;

  renderList(products);

  products.forEach(p => {

    const imagePath = p.image
      ? `/uploads/${p.image}`
      : "/assets/logo.png";

    list.innerHTML += `
      <div class="admin-product">

        <div class="admin-product-left">

          <img
            class="admin-thumb"
            src="${imagePath}"
            alt="${p.name}"
          >

          <div>
            <h4>${p.name}</h4>
            <p>€${Number(p.price).toFixed(2)}</p>
          </div>

        </div>

        <div class="admin-actions">

          <button
            id="edit-${p.id}"
            data-action="edit"
            data-id="${p.id}">
            Edit
          </button>

          <button
            id="toggle-${p.id}"
            data-action="toggle"
            data-id="${p.id}"
            data-visible="${p.visible}">
            ${p.visible ? "Hide" : "Show"}
          </button>

          <button
            id="delete-${p.id}"
            data-action="delete"
            data-id="${p.id}">
            Delete
          </button>

        </div>

      </div>
    `;
  });
}

/* SAVE */
async function save() {

  const form = new FormData();

  form.append("name", nome.value);
  form.append("price", price.value);
  form.append("description", desc.value);
  form.append("category", category.value);

  if (image.files[0]) {
    form.append("image", image.files[0]);
  }

  const url = editingId
    ? `/api/products/${editingId}`
    : "/api/products";

  const method = editingId
    ? "PUT"
    : "POST";

  const res = await fetch(url, {
    method,
    credentials: "include",
    body: form
  });

  if (!res.ok) {
    return toast.error("Errore durante il salvataggio");
  }

  clear();

  editingId = null;

  toast.success(
    method === "POST"
      ? "Prodotto creato"
      : "Prodotto aggiornato"
  );
  $("modalOverlay").classList.remove("show");
  load();
}

/* EDIT */
async function edit(id) {

  const p = products.find(
    product => product.id == id
  );

  if (!p) {
    return toast.error("Prodotto non trovato");
  }

  editingId = id;

  nome.value = p.name;
  price.value = p.price;
  desc.value = p.description;
  category.value = p.category;

  $("newProduct").style.display = "block";
  $("modalOverlay").classList.add("show");

}

/* DELETE */
async function del(id) {

  if (!confirm("Eliminare il prodotto?")) {
    return;
  }

  await fetch(`/api/products/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  toast.success("Prodotto eliminato");

  load();
}

/* TOGGLE */
async function toggle(id, visible) {

  await fetch(`/api/products/${id}/visibility`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      visible: visible ? 0 : 1
    })
  });

  load();
}

/* CLEAR */
function clear() {

  nome.value = "";
  price.value = "";
  desc.value = "";
  image.value = "";

  $("preview").style.display = "none";
  $("newProduct").style.display = "none";
}
/* SEARCH */

$("searchInput").addEventListener("input", () => {

  const value = $("searchInput").value.toLowerCase().trim();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(value) ||
    p.description.toLowerCase().includes(value) ||
    p.category.toLowerCase().includes(value)
  );

  renderList(filtered);
});

$("searchInput").addEventListener("input", () => {

  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {

    const value = $("searchInput").value.toLowerCase().trim();

    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(value) ||
      p.description.toLowerCase().includes(value) ||
      p.category.toLowerCase().includes(value)
    );

    renderList(filtered);

  }, 150);

});

/* RENDER LIST */

function renderList(data) {

  list.innerHTML = "";

  data.forEach(p => {

    const imagePath = p.image
      ? `/uploads/${p.image}`
      : "/assets/logo.png";

    list.innerHTML += `
      <div class="admin-product">

        <div class="admin-product-left">

          <img
            class="admin-thumb"
            src="${imagePath}"
            alt="${p.name}"
          >

          <div>
            <h4>${p.name}</h4>
            <p>€${Number(p.price).toFixed(2)}</p>
          </div>

        </div>

        <div class="admin-actions">

          <button
            id="edit-${p.id}"
            data-action="edit"
            data-id="${p.id}">
            Edit
          </button>

          <button
            id="toggle-${p.id}"
            data-action="toggle"
            data-id="${p.id}"
            data-visible="${p.visible}">
            ${p.visible ? "Hide" : "Show"}
          </button>

          <button
            id="delete-${p.id}"
            data-action="delete"
            data-id="${p.id}">
            Delete
          </button>

        </div>

      </div>
    `;
  });
}

/* SHOW EDITOR */
$("showEditorBtn").onclick = () => {

  resetEditor();

  $("newProduct").style.display = "block";
  document.getElementById("modalOverlay").classList.add("show");
};

/* UNSHOW EDITOR */
function closeModal(){
    $("modalOverlay").classList.remove("show");
}

$("modalOverlay").addEventListener("click", e => {

    if(e.target === $("modalOverlay")){
        closeModal();
    }

});
/* LIST ACTIONS */
list.onclick = e => {

  const btn = e.target.closest("button");

  if (!btn) return;

  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;

  switch (action) {

    case "edit":
      edit(id);
      break;

    case "toggle":
      toggle(
        id,
        Number(btn.dataset.visible)
      );
      break;

    case "delete":
      del(id);
      break;
  }
};

/* IMAGE PREVIEW */
const imageInput = $("image");
const previewImg = $("previewImg");
const previewDiv = $("preview");

imageInput.onchange = e => {

  const file = e.target.files[0];

  if (!file || !file.type.startsWith("image/")) {

    previewDiv.style.display = "none";

    return;
  }

  previewImg.src = URL.createObjectURL(file);

  previewDiv.style.display = "block";
};

previewImg.onload = () => {
  URL.revokeObjectURL(previewImg.src);
};

/* INIT */
loginBtn.onclick = login;
addBtn.onclick = save;