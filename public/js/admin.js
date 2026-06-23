let editingId = null;

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

    div.innerHTML = `
      <div class="admin-product-left">

        <img class="admin-thumb"
          src="${p.image ? '/uploads/' + p.image : '/assets/logo.png'}"
        />

        <div>
          <h4>${p.name}</h4>
          <p>€${Number(p.price).toFixed(2)}</p>
        </div>

      </div>

      <div class="admin-actions">

        <button onclick="edit(${p.id})">Edit</button>

        <button onclick="toggle(${p.id}, ${p.visible})">
          ${p.visible ? "Hide" : "Show"}
        </button>

        <button onclick="del(${p.id})">Delete</button>

      </div>
    `;

    list.appendChild(div);
  });
}

/* SAVE (CREATE + UPDATE) */
async function save() {

  const form = new FormData();

  form.append("name", name.value);
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

  name.value = p.name;
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
  name.value = "";
  price.value = "";
  desc.value = "";
  image.value = "";
}

/* INIT */
loginBtn.onclick = login;
addBtn.onclick = save;