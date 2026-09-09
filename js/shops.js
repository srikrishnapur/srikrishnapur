document.addEventListener("DOMContentLoaded", function () {

    const shopsGrid =
        document.getElementById("shopsGrid");

    const shopCount =
        document.getElementById("shopCount");

    const noShops =
        document.getElementById("noShops");

    const filterButtons =
        document.querySelectorAll(".shop-filter-btn");

    let shops = [];


    /*
    |--------------------------------------------------------------------------
    | Load Shops JSON
    |--------------------------------------------------------------------------
    */

    fetch("data/shops.json")
        .then(function (response) {

            if (!response.ok) {
                throw new Error("Unable to load shops.json");
            }

            return response.json();

        })
        .then(function (data) {

            shops =
                Array.isArray(data.shops)
                    ? data.shops
                    : [];

            showShops("all");

        })
        .catch(function (error) {

            console.error(
                "Shops data error:",
                error
            );

            shopsGrid.innerHTML = `
                <div style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:40px 20px;
                    color:#667b77;
                ">

                    <i
                        class="fa-solid fa-circle-exclamation"
                        style="
                            font-size:35px;
                            margin-bottom:12px;
                        ">
                    </i>

                    <p>
                        দোকানের তথ্য বর্তমানে
                        লোড করা যাচ্ছে না।
                    </p>

                </div>
            `;

        });


    /*
    |--------------------------------------------------------------------------
    | Show Shops
    |--------------------------------------------------------------------------
    */

    function showShops(category) {

        shopsGrid.innerHTML = "";

        const filteredShops =
            category === "all"
                ? shops
                : shops.filter(function (shop) {

                    return shop.category === category;

                });


        shopCount.textContent =
            filteredShops.length + " টি";


        if (filteredShops.length === 0) {

            noShops.style.display =
                "block";

            return;

        }


        noShops.style.display =
            "none";


        filteredShops.forEach(function (shop) {

            shopsGrid.appendChild(
                createShopCard(shop)
            );

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Create Shop Card
    |--------------------------------------------------------------------------
    */

    function createShopCard(shop) {

        const article =
            document.createElement("article");

        article.className =
            "shop-card";


        const phone =
            String(shop.phone || "")
                .replace(/\D/g, "");


        const whatsappMessage =
            encodeURIComponent(
                "Hello, I want to contact " +
                (shop.name || "this shop") +
                "."
            );


        article.innerHTML = `

            <div class="shop-top">

                <img
                    class="shop-photo"
                    src="${escapeHTML(
                        shop.photo ||
                        "images/village.webp"
                    )}"
                    alt="${escapeHTML(
                        shop.name ||
                        "Shop"
                    )}"
                    loading="lazy"
                    onerror="
                        this.src='images/village.webp';
                    "
                >


                <div class="shop-info">

                    <h3 class="shop-name">

                        ${escapeHTML(
                            shop.name ||
                            "দোকানের নাম"
                        )}

                    </h3>


                    <span class="shop-category">

                        <i class="${getCategoryIcon(
                            shop.category
                        )}"></i>

                        ${escapeHTML(
                            shop.category_name ||
                            "Shop"
                        )}

                    </span>

                </div>

            </div>


            <p class="shop-description">

                ${escapeHTML(
                    shop.description ||
                    ""
                )}

            </p>


            <div class="shop-location">

                <i class="fa-solid fa-location-dot"></i>

                ${escapeHTML(
                    shop.address ||
                    "শ্রীকৃষ্ণপুর"
                )}

            </div>


            <div class="shop-buttons">

                <a
                    href="tel:+${phone}"
                    class="shop-btn shop-call">

                    <i class="fa-solid fa-phone"></i>

                    Call Now

                </a>


                <a
                    href="https://wa.me/${phone}?text=${whatsappMessage}"
                    target="_blank"
                    rel="noopener"
                    class="shop-btn shop-whatsapp">

                    <i class="fa-brands fa-whatsapp"></i>

                    WhatsApp

                </a>


                <a
                    href="${escapeHTML(
                        shop.maps_url ||
                        "#"
                    )}"
                    target="_blank"
                    rel="noopener"
                    class="shop-btn shop-map">

                    <i class="fa-solid fa-map-location-dot"></i>

                    Google Maps

                </a>


                <a
                    href="${escapeHTML(
                        shop.details_url ||
                        "#"
                    )}"
                    class="shop-btn shop-details">

                    <i class="fa-solid fa-circle-info"></i>

                    বিস্তারিত

                </a>

            </div>

        `;


        return article;

    }


    /*
    |--------------------------------------------------------------------------
    | Category Icons
    |--------------------------------------------------------------------------
    */

    function getCategoryIcon(category) {

        const icons = {

            grocery:
                "fa-solid fa-basket-shopping",

            fish:
                "fa-solid fa-fish",

            chicken:
                "fa-solid fa-drumstick-bite",

            mutton:
                "fa-solid fa-drumstick-bite",

            beef:
                "fa-solid fa-drumstick-bite",

            clothes:
                "fa-solid fa-shirt",

            repair:
                "fa-solid fa-screwdriver-wrench",

            cyber:
                "fa-solid fa-computer",

            pharmacy:
                "fa-solid fa-pills",

            fruits:
                "fa-solid fa-apple-whole",

            restaurant:
                "fa-solid fa-utensils",

            dairy:
                "fa-solid fa-cow",

            mobile:
                "fa-solid fa-mobile-screen",

            salon:
                "fa-solid fa-scissors",

            hardware:
                "fa-solid fa-hammer",

            stationery:
                "fa-solid fa-book",

            other:
                "fa-solid fa-store"

        };


        return (
            icons[category] ||
            icons.other
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Category Filter
    |--------------------------------------------------------------------------
    */

    filterButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add("active");


                showShops(
                    this.dataset.category
                );

            }
        );

    });


    /*
    |--------------------------------------------------------------------------
    | Escape HTML
    |--------------------------------------------------------------------------
    */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            String(value);

        return div.innerHTML;

    }

});
