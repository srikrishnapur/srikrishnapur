document.addEventListener("DOMContentLoaded", function () {

    const doctorsGrid =
        document.getElementById("doctorsGrid");

    const doctorCount =
        document.getElementById("doctorCount");

    const noDoctors =
        document.getElementById("noDoctors");

    const filterButtons =
        document.querySelectorAll(".filter-btn");


    let doctors = [];


    /*
    |--------------------------------------------------------------------------
    | Load Doctors JSON
    |--------------------------------------------------------------------------
    */

    fetch("data/doctors.json")
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Unable to load doctors.json"
                );
            }

            return response.json();

        })
        .then(function (data) {

            doctors = data.doctors || [];

            showDoctors("all");

        })
        .catch(function (error) {

            console.error(
                "Doctors data error:",
                error
            );

            doctorsGrid.innerHTML = `
                <div style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:40px 20px;
                    color:#667b77;
                ">
                    <i class="fa-solid fa-circle-exclamation"
                       style="font-size:35px;margin-bottom:12px;">
                    </i>

                    <p>
                        ডাক্তারদের তথ্য বর্তমানে
                        লোড করা যাচ্ছে না।
                    </p>
                </div>
            `;

        });


    /*
    |--------------------------------------------------------------------------
    | Show Doctors
    |--------------------------------------------------------------------------
    */

    function showDoctors(category) {

        doctorsGrid.innerHTML = "";


        const filteredDoctors =
            category === "all"
                ? doctors
                : doctors.filter(function (doctor) {

                    return doctor.category === category;

                });


        doctorCount.textContent =
            filteredDoctors.length + " জন";


        if (filteredDoctors.length === 0) {

            noDoctors.style.display = "block";

            return;

        }


        noDoctors.style.display = "none";


        filteredDoctors.forEach(function (doctor) {

            const card =
                createDoctorCard(doctor);

            doctorsGrid.appendChild(card);

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Create Doctor Card
    |--------------------------------------------------------------------------
    */

    function createDoctorCard(doctor) {

        const article =
            document.createElement("article");


        article.className =
            "doctor-card";


        article.dataset.category =
            doctor.category || "other";


        const phone =
            String(doctor.phone || "")
                .replace(/\D/g, "");


        const whatsappMessage =
            encodeURIComponent(
                "Hello, I want to contact " +
                doctor.name +
                " regarding medical consultation."
            );


        article.innerHTML = `

            <div class="doctor-top">

                <img
                    class="doctor-photo"
                    src="${escapeHTML(doctor.photo)}"
                    alt="${escapeHTML(doctor.name)}"
                    loading="lazy"
                    onerror="
                        this.src='images/village.webp';
                    "
                >

                <div class="doctor-info">

                    <h3 class="doctor-name">
                        ${escapeHTML(doctor.name)}
                    </h3>

                    <span class="doctor-specialist">

                        <i class="${escapeHTML(
                            doctor.icon ||
                            "fa-solid fa-stethoscope"
                        )}"></i>

                        ${escapeHTML(
                            doctor.specialist ||
                            "Doctor"
                        )}

                    </span>

                </div>

            </div>


            <p class="doctor-description">

                ${escapeHTML(
                    doctor.description || ""
                )}

            </p>


            <div style="
                font-size:13px;
                color:#71827f;
                margin-bottom:14px;
            ">

                <i class="fa-solid fa-location-dot"></i>

                ${escapeHTML(
                    doctor.address || "Srikrishnapur"
                )}

            </div>


            <div class="doctor-buttons">

                <a
                    href="tel:+${phone}"
                    class="doctor-btn doctor-call">

                    <i class="fa-solid fa-phone"></i>

                    Call Now

                </a>


                <a
                    href="https://wa.me/${phone}?text=${whatsappMessage}"
                    target="_blank"
                    rel="noopener"
                    class="doctor-btn doctor-whatsapp">

                    <i class="fa-brands fa-whatsapp"></i>

                    WhatsApp

                </a>


                <a
                    href="${escapeHTML(
                        doctor.details_url || "#"
                    )}"
                    class="doctor-btn doctor-details">

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


                showDoctors(
                    this.dataset.category
                );

            }
        );

    });


    /*
    |--------------------------------------------------------------------------
    | Basic HTML Escape
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
