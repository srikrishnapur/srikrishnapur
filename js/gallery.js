document.addEventListener("DOMContentLoaded", () => {

  const galleryGrid = document.getElementById("galleryGrid");
  const photoCount = document.getElementById("photoCount");
  const emptyState = document.getElementById("emptyState");
  const categoryButtons = document.querySelectorAll(".category-btn");

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDescription = document.getElementById("lightboxDescription");

  const closeLightbox = document.getElementById("closeLightbox");
  const previousPhoto = document.getElementById("previousPhoto");
  const nextPhoto = document.getElementById("nextPhoto");

  let photos = [];
  let filteredPhotos = [];
  let activeCategory = "all";
  let currentIndex = 0;


  /* =========================================
     ESCAPE HTML
  ========================================= */

  function escapeHTML(value) {

    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =========================================
     RENDER GALLERY
  ========================================= */

  function renderGallery() {

    galleryGrid.innerHTML = "";

    filteredPhotos =
      activeCategory === "all"
        ? photos
        : photos.filter(
            photo => photo.category === activeCategory
          );

    photoCount.textContent = filteredPhotos.length;

    if (filteredPhotos.length === 0) {

      emptyState.style.display = "block";
      return;

    }

    emptyState.style.display = "none";


    filteredPhotos.forEach((photo, index) => {

      const card = document.createElement("article");

      card.className = "gallery-card";

      card.innerHTML = `

        <div
          class="gallery-image-wrapper"
          data-index="${index}"
        >

          <img
            class="gallery-image"
            src="images/placeholder.webp"
            data-src="${escapeHTML(photo.image)}"
            alt="${escapeHTML(photo.title)}"
            loading="lazy"
          >

          <div class="gallery-overlay">

            <span>
              <i class="fas fa-expand"></i>
            </span>

          </div>

        </div>

        <div class="gallery-card-content">

          <span class="gallery-category">
            ${escapeHTML(photo.category_name)}
          </span>

          <h2>
            ${escapeHTML(photo.title)}
          </h2>

          ${
            photo.description
              ? `<p>${escapeHTML(photo.description)}</p>`
              : ""
          }

          ${
            photo.date
              ? `
                <small>
                  <i class="far fa-calendar"></i>
                  ${escapeHTML(photo.date)}
                </small>
              `
              : ""
          }

        </div>
      `;

      galleryGrid.appendChild(card);

    });


    setupLazyLoading();

    document
      .querySelectorAll(".gallery-image-wrapper")
      .forEach(wrapper => {

        wrapper.addEventListener("click", () => {

          const index =
            Number(wrapper.dataset.index);

          openLightbox(index);

        });

      });

  }


  /* =========================================
     LAZY LOADING
  ========================================= */

  function setupLazyLoading() {

    const images =
      document.querySelectorAll(
        ".gallery-image[data-src]"
      );

    if (!("IntersectionObserver" in window)) {

      images.forEach(image => {

        image.src = image.dataset.src;

      });

      return;
    }


    const imageObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            const image = entry.target;

            image.src = image.dataset.src;

            image.removeAttribute("data-src");

            image.addEventListener(
              "load",
              () => {
                image.classList.add("loaded");
              }
            );

            observer.unobserve(image);

          });

        },
        {
          rootMargin: "250px 0px"
        }
      );


    images.forEach(image => {

      imageObserver.observe(image);

    });

  }


  /* =========================================
     LIGHTBOX
  ========================================= */

  function openLightbox(index) {

    if (!filteredPhotos[index]) {
      return;
    }

    currentIndex = index;

    const photo =
      filteredPhotos[currentIndex];

    lightboxImage.src = photo.image;

    lightboxImage.alt = photo.title || "";

    lightboxTitle.textContent =
      photo.title || "";

    lightboxDescription.textContent =
      photo.description || "";

    lightbox.classList.add("active");

    document.body.classList.add("lightbox-open");

  }


  function closePhotoViewer() {

    lightbox.classList.remove("active");

    document.body.classList.remove("lightbox-open");

    lightboxImage.src = "";

  }


  function showPreviousPhoto() {

    if (!filteredPhotos.length) {
      return;
    }

    currentIndex--;

    if (currentIndex < 0) {
      currentIndex =
        filteredPhotos.length - 1;
    }

    openLightbox(currentIndex);

  }


  function showNextPhoto() {

    if (!filteredPhotos.length) {
      return;
    }

    currentIndex++;

    if (
      currentIndex >=
      filteredPhotos.length
    ) {
      currentIndex = 0;
    }

    openLightbox(currentIndex);

  }


  closeLightbox.addEventListener(
    "click",
    closePhotoViewer
  );

  previousPhoto.addEventListener(
    "click",
    showPreviousPhoto
  );

  nextPhoto.addEventListener(
    "click",
    showNextPhoto
  );


  lightbox.addEventListener(
    "click",
    event => {

      if (
        event.target === lightbox
      ) {
        closePhotoViewer();
      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        !lightbox.classList.contains("active")
      ) {
        return;
      }

      if (event.key === "Escape") {
        closePhotoViewer();
      }

      if (event.key === "ArrowLeft") {
        showPreviousPhoto();
      }

      if (event.key === "ArrowRight") {
        showNextPhoto();
      }

    }
  );


  /* =========================================
     CATEGORY FILTER
  ========================================= */

  categoryButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        categoryButtons.forEach(btn => {

          btn.classList.remove("active");

        });

        button.classList.add("active");

        activeCategory =
          button.dataset.category;

        renderGallery();

      }
    );

  });


  /* =========================================
     LOAD JSON
  ========================================= */

  fetch("data/gallery.json")

    .then(response => {

      if (!response.ok) {
        throw new Error(
          "gallery.json not found"
        );
      }

      return response.json();

    })

    .then(data => {

      photos =
        Array.isArray(data.photos)
          ? data.photos
          : [];

      renderGallery();

    })

    .catch(error => {

      console.error(error);

      photoCount.textContent = "0";

      galleryGrid.innerHTML = `

        <div class="gallery-error">

          <i class="fas fa-triangle-exclamation"></i>

          <h3>
            Gallery load করা যায়নি
          </h3>

          <p>
            কিছুক্ষণ পরে আবার চেষ্টা করুন।
          </p>

        </div>

      `;

    });

});


/* =========================================
   SHARE GALLERY PAGE
========================================= */

function shareGalleryPage() {

  const shareData = {

    title:
      "Srikrishnapur Village Gallery",

    text:
      "শ্রীকৃষ্ণপুর গ্রামের ছবি, মানুষ, অনুষ্ঠান ও পুরনো স্মৃতি দেখুন।",

    url:
      window.location.href

  };


  if (navigator.share) {

    navigator.share(shareData)
      .catch(() => {});

  } else {

    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {

        alert(
          "Gallery link copied!"
        );

      })
      .catch(() => {

        alert(
          "Link copy করা যায়নি।"
        );

      });

  }

}


/* =========================================
   SHARE / ADD VILLAGE PHOTO
========================================= */

function addVillagePhoto() {

  const message =
`Hello Mr Noor,

আমি Srikrishnapur.in-এর Village Gallery-তে একটি ছবি যুক্ত করতে চাই।

Photo Title:
Photo Category:
Photo সম্পর্কে কিছু তথ্য:
Photo Date / Year:

ছবিটি এই মেসেজের সঙ্গে পাঠাচ্ছি।

Please add this photo to the Srikrishnapur Village Gallery.

Thank you.`;

  const whatsappURL =
    "https://wa.me/917557003853?text=" +
    encodeURIComponent(message);

  window.open(
    whatsappURL,
    "_blank"
  );

}
