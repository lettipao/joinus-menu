let editingId = null;

function resetEditor() {

  editingId = null;

  nome.value = "";
  price.value = "";
  desc.value = "";
  image.value = "";

  category.selectedIndex = 0;

  toast.success("Modalità creazione");
}

/* LOGIN */
async function login() {

  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });

  if (!res.ok) return toast.error("Login errato");

  loginBox.classList.add("hidden");
  panel.classList.remove("hidden");

  toast.success("Login ok");
  load();
}

/* LOAD */
async function load() {

  const res = await fetch("/api/products/admin", {
    credentials: "include"
  });

  const data = await res.json();

  list.innerHTML = "";

  data.forEach(p => {

    const div = document.createElement("div");
    div.className = "admin-product";

    const left = document.createElement("div");
left.className = "admin-product-left";

left.innerHTML = `
  <img
    class="admin-thumb"
    src="${
      p.image
      ? `/uploads/${p.image}`
      : '/assets/logo.png'
    }"
  />

  <div>
    <h4>${p.name}</h4>
    <p>€${Number(p.price).toFixed(2)}</p>
  </div>
`;

const actions = document.createElement("div");
actions.className = "admin-actions";

const editBtn = document.createElement("button");
editBtn.textContent = "Edit";

const toggleBtn = document.createElement("button");
toggleBtn.textContent =
  p.visible
  ? "Hide"
  : "Show";

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete";

editBtn.addEventListener("click", () => {
  edit(p.id);
});

toggleBtn.addEventListener("click", () => {
  toggle(p.id, p.visible);
});

deleteBtn.addEventListener("click", () => {
  del(p.id);
});

actions.appendChild(editBtn);
actions.appendChild(toggleBtn);
actions.appendChild(deleteBtn);

div.appendChild(left);
div.appendChild(actions);

    list.appendChild(div);
  });
}

/* SAVE (CREATE + UPDATE) */
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

  const method = editingId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    credentials: "include",
    body: form
  });

  if (!res.ok) return toast.error("Errore");

  editingId = null;

  clear();

  toast.success("Salvato");

  load();
}

/* EDIT FIX */
async function edit(id) {

  const res = await fetch("/api/products/admin", {
    credentials: "include"
  });

  const data = await res.json();

  const p = data.find(x => x.id === id);

  editingId = id;

  nome.value = p.name;
  price.value = p.price;
  desc.value = p.description;
  category.value = p.category;

  toast.info("Editing mode");
}

/* DELETE */
async function del(id) {

  await fetch(`/api/products/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  load();
}

/* TOGGLE */
async function toggle(id, v) {

  await fetch(`/api/products/${id}/visibility`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ visible: v ? 0 : 1 })
  });

  load();
}

/* CLEAR */
function clear() {
  nome.value = "";
  price.value = "";
  desc.value = "";
  image.value = "";
}

/* INIT */
loginBtn.onclick = login;
addBtn.onclick = save;