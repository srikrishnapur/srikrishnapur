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
    if (value === null || value === undefined) return "";

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

    let filteredCreators = creators;

    if (activeCategory !== "all") {
      filteredCreators = creators.filter(
        creator => creator.category === activeCategory
      );
    }

    creatorCount.textContent = filteredCreators.length;

    if (filteredCreators.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    filteredCreators.forEach(creator => {
      const card = document.createElement("article");
      card.className = "creator-card";

      const icon =
        categoryIcons[creator.category] || "fa-user-pen";

      const photo = creator.photo || "images/og-image.webp";

      let socialButtons = "";

      if (validLink(creator.facebook)) {
        socialButtons += `
          <a
            href="${escapeHTML(creator.facebook)}"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn facebook"
            aria-label="Facebook"
          >
            <i class="fab fa-facebook-f"></i>
            Facebook
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
            aria-label="Instagram"
          >
            <i class="fab fa-instagram"></i>
            Instagram
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
            aria-label="YouTube"
          >
            <i class="fab fa-youtube"></i>
            YouTube
          </a>
        `;
      }

      card.innerHTML = `
        <div class="creator-photo-wrapper">
          <img
            src="${escapeHTML(photo)}"
            alt="${escapeHTML(creator.name)}"
            class="creator-photo"
            loading="lazy"
            onerror="this.src='images/og-image.webp';"
          >
        </div>

        <div class="creator-content">

          <span class="creator-category">
            <i class="fas ${icon}"></i>
            ${escapeHTML(creator.category_name || "Creator")}
          </span>

          <h2>${escapeHTML(creator.name)}</h2>

          <p class="creator-description">
            ${escapeHTML(
              creator.description ||
              "Content Creator"
            )}
          </p>

          <div class="social-links">
            ${socialButtons}
          </div>

        </div>
      `;

      creatorsGrid.appendChild(card);
    });
  }

  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {

      categoryButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      activeCategory = button.dataset.category;

      renderCreators();
    });
  });

  fetch("data/creators.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Unable to load creators.json");
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
          <h3>Creators তথ্য লোড করা যায়নি</h3>
          <p>দয়া করে কিছুক্ষণ পরে আবার চেষ্টা করুন।</p>
        </div>
      `;
    });
});


/* =========================================
   SHARE PAGE
========================================= */

function shareCreatorsPage() {

  const shareData = {
    title: "Srikrishnapur Creators",
    text: "শ্রীকৃষ্ণপুরের Content Creators দেখুন।",
    url: window.location.href
  };

  if (navigator.share) {

    navigator.share(shareData).catch(() => {});

  } else {

    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert("Page link copied!");
      })
      .catch(() => {
        alert("Unable to copy link.");
      });

  }
}


/* =========================================
   ADD CREATOR
========================================= */

function addCreator() {

  const message =
`Hello Mr Noor,

আমি Srikrishnapur.in-এ Creator হিসেবে আমার তথ্য যুক্ত করতে চাই।

Creator Name:
Category:
Facebook:
Instagram:
YouTube:
Description:

আমার Profile Photo-ও পাঠাচ্ছি।

Please add my Creator profile on Srikrishnapur.in.`;

  const whatsappURL =
    "https://wa.me/917557003853?text=" +
    encodeURIComponent(message);

  window.open(whatsappURL, "_blank");
}
