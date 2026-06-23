let draggedId = null;

async function login() {

 const username = document.getElementById("user").value;
 const password = document.getElementById("pass").value;

 const res = await fetch("/api/admin/login", {
  method:"POST",
  headers:{ "Content-Type":"application/json" },
  body: JSON.stringify({ username, password })
 });

 if(res.ok){
  document.getElementById("loginBox").style.display="none";
  document.getElementById("panel").classList.remove("hidden");
  load();
 }
}

async function load() {
 const res = await fetch("/api/products/admin");
 const data = await res.json();

 const list = document.getElementById("list");
 list.innerHTML = "";

 const total = data.length;
 const visible = data.filter(p => p.visible).length;

 list.innerHTML += `
  <div class="card"
    draggable="true"
    ondragstart="drag(${p.id})"
    ondragover="event.preventDefault()"
    ondrop="drop(${p.id})"
    >
   <h3>📊 Dashboard</h3>
   <p>Totale: ${total}</p>
   <p>Visibili: ${visible}</p>
  </div>
 `;

 data.forEach(p => {
  list.innerHTML += `
   <div class="card"
 draggable="true"
 ondragstart="drag(${p.id})"
 ondragover="event.preventDefault()"
 ondrop="drop(${p.id})"
>
    <h3>${p.name}</h3>

    <button onclick="toggle(${p.id},${p.visible})">
     ${p.visible ? "Nascondi" : "Mostra"}
    </button>

    <button onclick="removeItem(${p.id})">
     Elimina
    </button>
   </div>
  `;
 });
}

async function addProduct() {

 const formData = new FormData();

 formData.append("name", name.value);
 formData.append("price", price.value);
 formData.append("description", desc.value);
 formData.append("category", category.value);
 formData.append("image", image.files[0]);

 await fetch("/api/products", {
  method:"POST",
  body: formData
 });

 load();
}

async function removeItem(id){
 await fetch(`/api/products/${id}`, {
  method:"DELETE"
 });

 load();
}

async function toggle(id,visible){
 await fetch(`/api/products/${id}/visibility`, {
  method:"PUT",
  headers:{ "Content-Type":"application/json" },
  body: JSON.stringify({ visible: visible ? 0 : 1 })
 });

 load();
}

function drag(id){
 draggedId = id;
}

async function drop(targetId){

 await fetch("/api/products/reorder", {
  method:"PUT",
  headers:{ "Content-Type":"application/json" },
  body: JSON.stringify({
   draggedId,
   targetId
  })
 });

 load();
}

