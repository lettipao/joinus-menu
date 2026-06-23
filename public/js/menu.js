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
    "Bevande",
    "Pranzo",
    "Tè & Infusi",
    "Specialità"
  ];

  categories.forEach(category => {

    const products =
      allProducts.filter(
        p => p.category === category
      );

    if (!products.length) return;

    const section =
      document.createElement("section");

    section.className =
      "menu-section";

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

    });

    menu.appendChild(section);

  });

}

loadMenu();