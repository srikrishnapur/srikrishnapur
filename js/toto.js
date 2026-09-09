document.addEventListener("DOMContentLoaded", function () {

    const totoGrid =
        document.getElementById("totoGrid");

    const totoCount =
        document.getElementById("totoCount");

    const noToto =
        document.getElementById("noToto");

    const filterButtons =
        document.querySelectorAll(".toto-filter-btn");


    let totos = [];


    /*
    |--------------------------------------------------------------------------
    | Load Toto JSON
    |--------------------------------------------------------------------------
    */

    fetch("data/toto.json")
        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to load toto.json"
                );

            }

            return response.json();

        })

        .then(function (data) {

            totos =
                Array.isArray(data.totos)
                    ? data.totos
                    : [];

            showTotos("all");

        })

        .catch(function (error) {

            console.error(
                "Toto data error:",
                error
            );


            totoGrid.innerHTML = `

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
                        টোটো চালকদের তথ্য
                        বর্তমানে লোড করা যাচ্ছে না।
                    </p>

                </div>

            `;

        });


    /*
    |--------------------------------------------------------------------------
    | Show Totos
    |--------------------------------------------------------------------------
    */

    function showTotos(category) {

        totoGrid.innerHTML = "";


        const filteredTotos =
            category === "all"
                ? totos
                : totos.filter(function (toto) {

                    return (
                        toto.category ===
                        category
                    );

                });


        totoCount.textContent =
            filteredTotos.length + " জন";


        if (filteredTotos.length === 0) {

            noToto.style.display =
                "block";

            return;

        }


        noToto.style.display =
            "none";


        filteredTotos.forEach(
            function (toto) {

                const card =
                    createTotoCard(toto);

                totoGrid.appendChild(card);

            }
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Create Toto Card
    |--------------------------------------------------------------------------
    */

    function createTotoCard(toto) {

        const article =
            document.createElement("article");


        article.className =
            "toto-card";


        const phone =
            String(
                toto.phone || ""
            ).replace(
                /\D/g,
                ""
            );


        const whatsappMessage =
            encodeURIComponent(
                "Hello, I want to contact " +
                (toto.name || "this Toto driver") +
                " regarding Toto service."
            );


        article.innerHTML = `

            <div class="toto-top">

                <img
                    class="toto-photo"
                    src="${escapeHTML(
                        toto.photo ||
                        "images/village.webp"
                    )}"
                    alt="${escapeHTML(
                        toto.name ||
                        "টোটো চালক"
                    )}"
                    loading="lazy"
                    onerror="
                        this.src='images/village.webp';
                    "
                >


                <div class="toto-info">

                    <h3 class="toto-name">

                        ${escapeHTML(
                            toto.name ||
                            "টোটো চালক"
                        )}

                    </h3>


                    <span class="toto-service">

                        <i class="fa-solid fa-route"></i>

                        ${escapeHTML(
                            toto.service ||
                            "টোটো পরিষেবা"
                        )}

                    </span>

                </div>

            </div>


            <p class="toto-description">

                ${escapeHTML(
                    toto.description ||
                    ""
                )}

            </p>


            <div class="toto-location">

                <i class="fa-solid fa-location-dot"></i>

                ${escapeHTML(
                    toto.area ||
                    "শ্রীকৃষ্ণপুর"
                )}

            </div>


            <div class="toto-buttons">

                <a
                    href="tel:+${phone}"
                    class="toto-btn toto-call">

                    <i class="fa-solid fa-phone"></i>

                    Call Now

                </a>


                <a
                    href="https://wa.me/${phone}?text=${whatsappMessage}"
                    target="_blank"
                    rel="noopener"
                    class="toto-btn toto-whatsapp">

                    <i class="fa-brands fa-whatsapp"></i>

                    WhatsApp

                </a>


                <a
                    href="${escapeHTML(
                        toto.details_url ||
                        "#"
                    )}"
                    class="toto-btn toto-details">

                    <i class="fa-solid fa-circle-info"></i>

                    বিস্তারিত তথ্য

                </a>

            </div>

        `;


        return article;

    }


    /*
    |--------------------------------------------------------------------------
    | Category Filter
    |--------------------------------------------------------------------------
    */

    filterButtons.forEach(
        function (button) {

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


                    this.classList.add(
                        "active"
                    );


                    showTotos(
                        this.dataset.category
                    );

                }
            );

        }
    );


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
