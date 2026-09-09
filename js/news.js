const newsGrid = document.getElementById("newsGrid");
const newsCount = document.getElementById("newsCount");
const newsEmpty = document.getElementById("newsEmpty");
const newsSearch = document.getElementById("newsSearch");

let newsData = [];
let currentCategory = "all";


function escapeHTML(value) {
  if (value === undefined || value === null) return "";

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function formatDate(date) {

  if (!date) return "";

  const d = new Date(date);

  if (isNaN(d)) return escapeHTML(date);

  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}


function renderNews() {

  const searchText =
    newsSearch.value.trim().toLowerCase();


  const filtered = newsData.filter(item => {

    const categoryMatch =
      currentCategory === "all" ||
      item.category === currentCategory;


    const searchable =
      `${item.title || ""}
       ${item.description || ""}
       ${item.category_name || ""}
       ${item.author || ""}`.toLowerCase();


    return categoryMatch &&
           searchable.includes(searchText);

  });


  newsGrid.innerHTML = "";

  newsCount.textContent =
    `${filtered.length} news পাওয়া গেছে`;


  if (!filtered.length) {

    newsEmpty.style.display = "block";

    return;
  }


  newsEmpty.style.display = "none";


  filtered.forEach(item => {

    const card =
      document.createElement("article");

    card.className = "news-card";


    const image =
      item.image || "images/placeholder.webp";


    const details =
      item.details_url || "#";


    card.innerHTML = `

      <img
        class="news-image"
        src="${escapeHTML(image)}"
        alt="${escapeHTML(item.title)}"
        loading="lazy"
        onerror="this.src='images/placeholder.webp'"
      >

      <div class="news-content">

        <span class="badge">
          ${escapeHTML(
            item.category_name || "News"
          )}
        </span>

        <h2 class="news-title">
          ${escapeHTML(item.title)}
        </h2>

        <p class="news-description">
          ${escapeHTML(item.description)}
        </p>

        <div class="news-meta">

          <span>
            <i class="fa-regular fa-calendar"></i>
            ${formatDate(item.date)}
          </span>

          <span>
            <i class="fa-solid fa-user"></i>
            ${escapeHTML(item.author || "Srikrishnapur")}
          </span>

        </div>

        <a
          class="details-btn"
          href="${escapeHTML(details)}">
          Read More
          <i class="fa-solid fa-arrow-right"></i>
        </a>

      </div>
    `;


    newsGrid.appendChild(card);

  });

}


async function loadNews() {

  try {

    const response =
      await fetch("data/news.json", {
        cache: "no-store"
      });


    if (!response.ok)
      throw new Error("Failed to load news");


    newsData = await response.json();


    if (!Array.isArray(newsData))
      throw new Error("Invalid JSON");


    renderNews();

  } catch(error) {

    console.error(error);

    newsCount.textContent =
      "News information load করা যায়নি।";

  }

}


document.querySelectorAll(".filter-btn")
  .forEach(button => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".filter-btn")
        .forEach(btn =>
          btn.classList.remove("active")
        );


      button.classList.add("active");


      currentCategory =
        button.dataset.category;


      renderNews();

    });

  });


newsSearch.addEventListener(
  "input",
  renderNews
);


document
  .getElementById("shareNews")
  .addEventListener("click", async () => {

    const data = {
      title: "Srikrishnapur Village News",
      text:
        "Latest news and updates from Srikrishnapur.",
      url: window.location.href
    };


    try {

      if (navigator.share) {

        await navigator.share(data);

      } else {

        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Page link copied!");

      }

    } catch(error) {}

  });


loadNews();
