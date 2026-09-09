document.addEventListener("DOMContentLoaded", () => {

  const creatorsGrid = document.getElementById("creatorsGrid");
  const creatorCount = document.getElementById("creatorCount");
  const emptyState = document.getElementById("emptyState");
  const categoryButtons = document.querySelectorAll(".category-btn");

  let creators = [];
  let activeCategory = "all";

  const categoryIcons = {
    comedy: "fa-face-laugh",
    educational: "fa-graduation-cap",
    storyteller: "fa-book-open",
    funny: "fa-face-grin-squint-tears",
    business: "fa-store",
    technology: "fa-microchip",
    other: "fa-user-pen"
  };

  function escapeHTML(value) {
    if (!value) return "";

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function validLink(url) {
    if (!url || url === "#") return false;

    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" ||
             parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  function renderCreators() {

    creatorsGrid.innerHTML = "";

    let filtered = creators;

    if (activeCategory !== "all") {
      filtered = creators.filter(
        creator => creator.category === activeCategory
      );
    }

    creatorCount.textContent = filtered.length;

    if (filtered.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    filtered.forEach(creator => {

      const card = document.createElement("article");
      card.className = "creator-card";

      const icon =
        categoryIcons[creator.category] || "fa-user-pen";

      const photo =
        creator.photo || "images/og-image.webp";

      let socialButtons = "";

      if (validLink(creator.facebook)) {
        socialButtons += `
          <a
            href="${escapeHTML(creator.facebook)}"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn facebook"
            title="Facebook"
          >
            <i class="fab fa-facebook-f"></i>
          </a>
        `;
      }

      if (validLink(creator.instagram)) {
        socialButtons += `
          <a
            href="${escapeHTML(creator.instagram)}"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn instagram"
            title="Instagram"
          >
            <i class="fab fa-instagram"></i>
          </a>
        `;
      }

      if (validLink(creator.youtube)) {
        socialButtons += `
          <a
            href="${escapeHTML(creator.youtube)}"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn youtube"
            title="YouTube"
          >
            <i class="fab fa-youtube"></i>
          </a>
        `;
      }

      const detailsButton = validLink(creator.details_url)
        ? `
          <a
            href="${escapeHTML(creator.details_url)}"
            class="details-btn"
          >
            <i class="fas fa-circle-info"></i>
            Details
          </a>
        `
        : "";

      card.innerHTML = `

        <div class="creator-card-top">

          <img
            src="${escapeHTML(photo)}"
            alt="${escapeHTML(creator.name)}"
            class="creator-photo"
            loading="lazy"
            onerror="this.src='images/og-image.webp';"
          >

          <div class="creator-info">

            <span class="creator-category">
              <i class="fas ${icon}"></i>
              ${escapeHTML(
                creator.category_name || "Creator"
              )}
            </span>

            <h2>
              ${escapeHTML(creator.name)}
            </h2>

            <p>
              ${escapeHTML(
                creator.description || ""
              )}
            </p>

          </div>

        </div>

        <div class="creator-bottom">

          <div class="social-links">
            ${socialButtons}
          </div>

          ${detailsButton}

        </div>
      `;

      creatorsGrid.appendChild(card);
    });
  }

  categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

      categoryButtons.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      activeCategory =
        button.dataset.category;

      renderCreators();

    });

  });

  fetch("data/creators.json")
    .then(response => {

      if (!response.ok) {
        throw new Error("Creators data not found");
      }

      return response.json();

    })
    .then(data => {

      creators = Array.isArray(data.creators)
        ? data.creators
        : [];

      renderCreators();

    })
    .catch(error => {

      console.error(error);

      creatorCount.textContent = "0";

      creatorsGrid.innerHTML = `
        <div class="load-error">
          <i class="fas fa-triangle-exclamation"></i>
          <h3>Creator তথ্য লোড করা যায়নি</h3>
          <p>কিছুক্ষণ পরে আবার চেষ্টা করুন।</p>
        </div>
      `;

    });

});


/* ================================
   SHARE
================================ */

function shareCreatorsPage() {

  const data = {
    title: "Srikrishnapur Content Creators",
    text: "শ্রীকৃষ্ণপুরের Content Creators দেখুন।",
    url: window.location.href
  };

  if (navigator.share) {

    navigator.share(data).catch(() => {});

  } else {

    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert("Page link copied!"));

  }
}


/* ================================
   ADD CREATOR
================================ */

function addCreator() {

  const message =
`Hello Mr Noor,

আমি Srikrishnapur.in-এ Creator হিসেবে আমার Profile যুক্ত করতে চাই।

Creator Name:
Category:
Facebook:
Instagram:
YouTube:
Description:
Details URL:

আমার Profile Photo-ও পাঠাচ্ছি।

Please add my Creator profile.`;

  const url =
    "https://wa.me/917557003853?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank");
}
