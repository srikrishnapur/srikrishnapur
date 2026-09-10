const eventGrid =
  document.getElementById("eventGrid");

const eventCount =
  document.getElementById("eventCount");

const eventEmpty =
  document.getElementById("eventEmpty");

const eventSearch =
  document.getElementById("eventSearch");

let events = [];

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

  return d.toLocaleDateString(
    "en-IN",
    {
      weekday:"short",
      day:"numeric",
      month:"short",
      year:"numeric"
    }
  );

}


function renderEvents() {

  const search =
    eventSearch.value
      .trim()
      .toLowerCase();


  const filtered =
    events.filter(event => {

      const categoryMatch =
        currentCategory === "all" ||
        event.category === currentCategory;


      const searchable =
        `${event.title || ""}
        ${event.description || ""}
        ${event.location || ""}
        ${event.organizer || ""}
        ${event.category_name || ""}`
        .toLowerCase();


      return categoryMatch &&
             searchable.includes(search);

    });


  eventGrid.innerHTML = "";


  eventCount.textContent =
    `${filtered.length} event পাওয়া গেছে`;


  if (!filtered.length) {

    eventEmpty.style.display = "block";

    return;

  }


  eventEmpty.style.display = "none";


  filtered.forEach(event => {

    const card =
      document.createElement("article");

    card.className = "event-card";


    card.innerHTML = `

      <img
        class="event-image"
        src="${escapeHTML(
          event.image ||
          "images/placeholder.webp"
        )}"
        alt="${escapeHTML(event.title)}"
        loading="lazy"
        onerror="this.src='images/placeholder.webp'"
      >


      <div class="event-content">

        <span class="event-badge">

          <i class="fa-solid fa-calendar"></i>

          ${escapeHTML(
            event.category_name ||
            "Event"
          )}

        </span>


        <h2 class="event-title">

          ${escapeHTML(event.title)}

        </h2>


        <p class="event-description">

          ${escapeHTML(event.description)}

        </p>


        <div class="event-info">

          <div>
            <i class="fa-regular fa-calendar"></i>
            ${formatDate(event.date)}
          </div>


          ${
            event.time
              ? `
                <div>
                  <i class="fa-regular fa-clock"></i>
                  ${escapeHTML(event.time)}
                </div>
              `
              : ""
          }


          ${
            event.location
              ? `
                <div>
                  <i class="fa-solid fa-location-dot"></i>
                  ${escapeHTML(event.location)}
                </div>
              `
              : ""
          }


          ${
            event.organizer
              ? `
                <div>
                  <i class="fa-solid fa-users"></i>
                  ${escapeHTML(event.organizer)}
                </div>
              `
              : ""
          }

        </div>


        ${
          event.details_url &&
          event.details_url !== "#"
            ? `
              <a
                class="details-btn"
                href="${escapeHTML(
                  event.details_url
                )}">

                Event Details

                <i class="fa-solid fa-arrow-right"></i>

              </a>
            `
            : ""
        }

      </div>

    `;


    eventGrid.appendChild(card);

  });

}


async function loadEvents() {

  try {

    const response =
      await fetch("data/events.json",{
        cache:"no-store"
      });


    if (!response.ok)
      throw new Error("Events loading failed");


    events =
      await response.json();


    if (!Array.isArray(events))
      throw new Error("Invalid events JSON");


    renderEvents();

  } catch(error) {

    console.error(error);

    eventCount.textContent =
      "Event information load করা যায়নি।";

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


      renderEvents();

    });

  });


eventSearch.addEventListener(
  "input",
  renderEvents
);


document
  .getElementById("shareEvents")
  .addEventListener("click",async()=>{

    try {

      if (navigator.share) {

        await navigator.share({

          title:
            "Srikrishnapur Village Events",

          text:
            "Upcoming and important events of Srikrishnapur.",

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


loadEvents();
