let allProducts = [];

async function loadMenu() {

  const res =
    await fetch("/api/products/public");

  allProducts =
    await res.json();

  render();
}

function render() {

  const menu =
    document.getElementById("menu");

  menu.innerHTML = "";

  const categories = [
    "Caffetteria",
    "dolce",
    "salato",
    "Te",
    "Specialità di oggi",
    "beverage"
  ];

  categories.forEach(category => {

    const products =
      allProducts.filter(
        p => p.category === category
      );

    if (!products.length) return;

    const section =
      document.createElement("section");

section.className = "menu-section";

const ids = {
  "Caffetteria": "caffetteria",
  "dolce": "dolce",
  "salato": "salato",
  "Te": "te",
  "Specialità": "specialita"
};

section.id = ids[category];

    section.innerHTML = `
      <h2 class="category-title">
        ${category}
      </h2>
    `;

    products.forEach((p,index)=>{

      const row =
        document.createElement("article");

      row.className =
        "menu-row";

      if(index % 2 !== 0){
        row.classList.add("reverse");
      }

      const image =
        p.image
        ? `/uploads/${p.image}`
        : "/assets/logo.png";

      row.innerHTML = `

        <div class="menu-image">

          <img
            src="${image}"
            loading="lazy"
            alt="${p.name}"
          >

        </div>

        <div class="menu-content">

          <div class="menu-header">

            <h3>${p.name}</h3>

            <span>
              €${Number(p.price).toFixed(2)}
            </span>

          </div>

          <p>
            ${p.description || ""}
          </p>

        </div>

      `;

      section.appendChild(row);
      if(index !== products.length - 1){

  const divider =
    document.createElement("div");

  divider.className =
    "menu-divider";

  section.appendChild(divider);
}

    });

    menu.appendChild(section);

  });

}

loadMenu();

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const toggle =
      document.getElementById("menuToggle");

    const side =
      document.getElementById("sideMenu");

    const overlay =
      document.getElementById("menuOverlay");

    toggle.addEventListener("click", () => {

      side.classList.toggle("open");
      overlay.classList.toggle("open");

    });

    overlay.addEventListener("click", () => {

      side.classList.remove("open");
      overlay.classList.remove("open");

    });

  }
);