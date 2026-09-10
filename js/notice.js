const noticeList =
  document.getElementById("noticeList");

const noticeCount =
  document.getElementById("noticeCount");

const noticeEmpty =
  document.getElementById("noticeEmpty");

const noticeSearch =
  document.getElementById("noticeSearch");

let notices = [];

let currentCategory = "all";


function escapeHTML(value) {

  if (value === null || value === undefined)
    return "";

  return String(value)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


function formatDate(date) {

  if (!date) return "";

  const d = new Date(date);

  if (isNaN(d))
    return escapeHTML(date);

  return d.toLocaleDateString("en-IN",{
    day:"numeric",
    month:"short",
    year:"numeric"
  });

}


function renderNotices() {

  const search =
    noticeSearch.value
      .trim()
      .toLowerCase();


  const filtered =
    notices.filter(notice => {

      const categoryMatch =
        currentCategory === "all" ||
        notice.category === currentCategory;


      const searchable =
        `${notice.title || ""}
        ${notice.description || ""}
        ${notice.category_name || ""}`
        .toLowerCase();


      return categoryMatch &&
             searchable.includes(search);

    });


  noticeList.innerHTML = "";


  noticeCount.textContent =
    `${filtered.length} notice পাওয়া গেছে`;


  if (!filtered.length) {

    noticeEmpty.style.display = "block";

    return;

  }


  noticeEmpty.style.display = "none";


  filtered.forEach(notice => {

    const card =
      document.createElement("article");


    card.className =
      `notice-card ${notice.category || ""}`;


    card.innerHTML = `

      <div class="notice-top">

        <span class="notice-badge">

          ${
            notice.category === "urgent"
              ? "🚨 "
              : notice.category === "important"
                ? "⚠️ "
                : "📢 "
          }

          ${escapeHTML(
            notice.category_name || "Notice"
          )}

        </span>

      </div>


      <h2 class="notice-title">
        ${escapeHTML(notice.title)}
      </h2>


      <p class="notice-description">
        ${escapeHTML(notice.description)}
      </p>


      <div class="notice-meta">

        <span>
          <i class="fa-regular fa-calendar"></i>
          ${formatDate(notice.date)}
        </span>

        ${
          notice.valid_until
            ? `
              <span>
                <i class="fa-regular fa-clock"></i>
                Valid until ${formatDate(notice.valid_until)}
              </span>
            `
            : ""
        }

      </div>


      ${
        notice.details_url &&
        notice.details_url !== "#"
          ? `
            <a
              class="details-btn"
              href="${escapeHTML(
                notice.details_url
              )}">
              View Details
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          `
          : ""
      }

    `;


    noticeList.appendChild(card);

  });

}


async function loadNotices() {

  try {

    const response =
      await fetch("data/notices.json",{
        cache:"no-store"
      });


    if (!response.ok)
      throw new Error("Notice loading failed");


    notices =
      await response.json();


    if (!Array.isArray(notices))
      throw new Error("Invalid notice JSON");


    renderNotices();

  } catch(error) {

    console.error(error);

    noticeCount.textContent =
      "Notice information load করা যায়নি।";

  }

}


document
  .querySelectorAll(".filter-btn")
  .forEach(button => {

    button.addEventListener("click",()=>{

      document
        .querySelectorAll(".filter-btn")
        .forEach(btn =>
          btn.classList.remove("active")
        );


      button.classList.add("active");


      currentCategory =
        button.dataset.category;


      renderNotices();

    });

  });


noticeSearch.addEventListener(
  "input",
  renderNotices
);


document
  .getElementById("shareNotice")
  .addEventListener("click",async()=>{

    try {

      if (navigator.share) {

        await navigator.share({
          title:
            "Srikrishnapur Important Notices",
          text:
            "Important notices from Srikrishnapur.",
          url:
            window.location.href
        });

      } else {

        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Page link copied!");

      }

    } catch(error){}

  });


loadNotices();
