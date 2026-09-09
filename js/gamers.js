const gamersGrid = document.getElementById("gamersGrid");
const gamersCount = document.getElementById("gamersCount");
const emptyState = document.getElementById("emptyState");
const categoryButtons = document.querySelectorAll(".category-btn");

let gamers = [];
let currentCategory = "all";


const categoryIcons = {
  cricket: "🏏",
  football: "⚽",
  carrom: "🎯",
  "mobile-games": "🎮",
  kabaddi: "🤼",
  volleyball: "🏐"
};


const socialIcons = {
  instagram: '<i class="fa-brands fa-instagram"></i>',
  facebook: '<i class="fa-brands fa-facebook-f"></i>',
  whatsapp: '<i class="fa-brands fa-whatsapp"></i>'
};


const socialNames = {
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp"
};


function escapeHTML(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function validURL(url) {
  if (!url || typeof url !== "string") return false;

  try {
    const parsed = new URL(url);

    return (
      parsed.protocol === "https:" ||
      parsed.protocol === "http:"
    );

  } catch {
    return false;
  }
}


function renderGamers() {

  gamersGrid.innerHTML = "";

  const filteredGamers =
    currentCategory === "all"
      ? gamers
      : gamers.filter(
          gamer => gamer.category === currentCategory
        );


  gamersCount.textContent =
    `${filteredGamers.length} জন talent পাওয়া গেছে`;


  if (filteredGamers.length === 0) {

    emptyState.style.display = "block";

    return;
  }


  emptyState.style.display = "none";


  filteredGamers.forEach(gamer => {

    const card = document.createElement("article");

    card.className = "gamer-card";


    const icon =
      categoryIcons[gamer.category] || "🏆";


    const categoryName =
      gamer.category_name ||
      gamer.category ||
      "Sports";


    let socialButton = "";


    if (
      gamer.social &&
      gamer.social.platform &&
      validURL(gamer.social.url) &&
      socialIcons[gamer.social.platform]
    ) {

      const platform =
        gamer.social.platform.toLowerCase();


      socialButton = `
        <a
          class="gamer-action social-action"
          href="${escapeHTML(gamer.social.url)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${escapeHTML(
            socialNames[platform] || "Social Media"
          )}"
        >
          ${socialIcons[platform]}
          ${escapeHTML(
            socialNames[platform] || "Social"
          )}
        </a>
      `;
    }


    let detailsButton = "";


    if (validURL(gamer.details_url)) {

      detailsButton = `
        <a
          class="gamer-action details-action"
          href="${escapeHTML(gamer.details_url)}"
        >
          <i class="fa-solid fa-arrow-right"></i>
          Details
        </a>
      `;

    } else if (
      gamer.details_url &&
      gamer.details_url.startsWith("/")
    ) {

      detailsButton = `
        <a
          class="gamer-action details-action"
          href="${escapeHTML(gamer.details_url)}"
        >
          <i class="fa-solid fa-arrow-right"></i>
          Details
        </a>
      `;
    }


    card.innerHTML = `

      <div class="gamer-top">

        <img
          class="gamer-photo"
          src="${escapeHTML(
            gamer.photo || "images/placeholder.webp"
          )}"
          alt="${escapeHTML(gamer.name)}"
          loading="lazy"
          onerror="this.src='images/placeholder.webp'"
        >

        <div class="gamer-info">

          <h3 class="gamer-name">
            ${escapeHTML(gamer.name)}
          </h3>

          <span class="gamer-category">
            ${icon}
            ${escapeHTML(categoryName)}
          </span>

        </div>

      </div>


      <p class="gamer-description">
        ${escapeHTML(
          gamer.description ||
          "Srikrishnapur-এর একজন প্রতিভাবান gamer ও sports talent।"
        )}
      </p>


      <div class="gamer-actions">

        ${socialButton}

        ${detailsButton}

      </div>
    `;


    gamersGrid.appendChild(card);

  });

}


async function loadGamers() {

  try {

    const response =
      await fetch("data/gamers.json", {
        cache: "no-store"
      });


    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status}`
      );
    }


    const data = await response.json();


    if (!Array.isArray(data)) {
      throw new Error(
        "gamers.json must contain an array"
      );
    }


    gamers = data;


    renderGamers();


  } catch (error) {

    console.error(
      "Failed to load gamers:",
      error
    );


    gamersCount.textContent =
      "Gamer information এখনো পাওয়া যায়নি।";


    emptyState.style.display = "block";

  }

}


/* CATEGORY FILTER */

categoryButtons.forEach(button => {

  button.addEventListener("click", () => {

    categoryButtons.forEach(btn =>
      btn.classList.remove("active")
    );


    button.classList.add("active");


    currentCategory =
      button.dataset.category;


    renderGamers();

  });

});


/* SHARE */

const sharePage =
  document.getElementById("sharePage");


if (sharePage) {

  sharePage.addEventListener("click", async () => {

    const shareData = {
      title: "Srikrishnapur Gamers & Talents",
      text:
        "Discover the gamers and sports talents of Srikrishnapur.",
      url: window.location.href
    };


    try {

      if (navigator.share) {

        await navigator.share(shareData);

      } else {

        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Page link copied!");

      }

    } catch (error) {

      console.log("Share cancelled.");

    }

  });

}


/* LOAD */

loadGamers();
