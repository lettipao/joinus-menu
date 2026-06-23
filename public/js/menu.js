let allProducts = [];
let selectedCat = "all";

const searchInput = document.getElementById("search");

async function loadMenu() {
 const res = await fetch("/api/products/public");
 allProducts = await res.json();
 render();
}

function render() {
 const menu = document.getElementById("menu");
 menu.innerHTML = "";

 let filtered = allProducts;

 if (selectedCat !== "all") {
  filtered = filtered.filter(p => p.category === selectedCat);
 }

 const search = searchInput.value.toLowerCase();

 if (search) {
  filtered = filtered.filter(p =>
   p.name.toLowerCase().includes(search)
  );
 }

 filtered.forEach(p => {
  menu.innerHTML += `
   <div class="card">
    <h3>${p.name}</h3>
    <p>${p.description || ""}</p>
    <div class="price">€${p.price}</div>
   </div>
  `;
 });
}

/* CATEGORY FILTER */
document.querySelectorAll(".cat").forEach(btn => {
 btn.addEventListener("click", () => {
  document.querySelectorAll(".cat").forEach(b =>
   b.classList.remove("active")
  );

  btn.classList.add("active");
  selectedCat = btn.dataset.cat;

  render();
 });
});

/* SEARCH LIVE */
searchInput.addEventListener("input", render);

/* DARK MODE (AUTO) */
const prefersDark =
 window.matchMedia("(prefers-color-scheme: dark)")
 .matches;

if (prefersDark) {
 document.body.classList.add("dark");
}

loadMenu();