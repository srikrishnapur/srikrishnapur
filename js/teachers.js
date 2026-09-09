document.addEventListener("DOMContentLoaded", function () {

    const teachersGrid =
        document.getElementById("teachersGrid");

    const teacherCount =
        document.getElementById("teacherCount");

    const noTeachers =
        document.getElementById("noTeachers");

    const filterButtons =
        document.querySelectorAll(".teacher-filter-btn");

    let teachers = [];


    /*
    |--------------------------------------------------------------------------
    | Load Teachers JSON
    |--------------------------------------------------------------------------
    */

    fetch("data/teachers.json")
        .then(function (response) {

            if (!response.ok) {
                throw new Error("Unable to load teachers.json");
            }

            return response.json();

        })
        .then(function (data) {

            teachers =
                Array.isArray(data.teachers)
                    ? data.teachers
                    : [];

            showTeachers("all");

        })
        .catch(function (error) {

            console.error(
                "Teachers data error:",
                error
            );

            teachersGrid.innerHTML = `
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
                        শিক্ষকদের তথ্য বর্তমানে
                        লোড করা যাচ্ছে না।
                    </p>
                </div>
            `;

        });


    /*
    |--------------------------------------------------------------------------
    | Show Teachers
    |--------------------------------------------------------------------------
    */

    function showTeachers(category) {

        teachersGrid.innerHTML = "";

        const filteredTeachers =
            category === "all"
                ? teachers
                : teachers.filter(function (teacher) {

                    return teacher.category === category;

                });


        teacherCount.textContent =
            filteredTeachers.length + " জন";


        if (filteredTeachers.length === 0) {

            noTeachers.style.display = "block";

            return;

        }


        noTeachers.style.display = "none";


        filteredTeachers.forEach(function (teacher) {

            teachersGrid.appendChild(
                createTeacherCard(teacher)
            );

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Create Teacher Card
    |--------------------------------------------------------------------------
    */

    function createTeacherCard(teacher) {

        const article =
            document.createElement("article");

        article.className =
            "teacher-card";


        const phone =
            String(teacher.phone || "")
                .replace(/\D/g, "");


        const whatsappMessage =
            encodeURIComponent(
                "Hello, I want to contact " +
                (teacher.name || "this teacher") +
                " regarding teaching/tuition."
            );


        article.innerHTML = `

            <div class="teacher-top">

                <img
                    class="teacher-photo"
                    src="${escapeHTML(
                        teacher.photo ||
                        "images/village.webp"
                    )}"
                    alt="${escapeHTML(
                        teacher.name ||
                        "Teacher"
                    )}"
                    loading="lazy"
                    onerror="
                        this.src='images/village.webp';
                    "
                >


                <div class="teacher-info">

                    <h3 class="teacher-name">
                        ${escapeHTML(
                            teacher.name ||
                            "শিক্ষকের নাম"
                        )}
                    </h3>


                    <span class="teacher-category">

                        <i class="fa-solid fa-graduation-cap"></i>

                        ${escapeHTML(
                            teacher.category_name ||
                            "Teacher"
                        )}

                    </span>

                </div>

            </div>


            <div class="teacher-subject">

                <i class="fa-solid fa-book-open"></i>

                <strong>Subject:</strong>

                ${escapeHTML(
                    teacher.subject ||
                    "Subject not specified"
                )}

            </div>


            <p class="teacher-description">

                ${escapeHTML(
                    teacher.description ||
                    ""
                )}

            </p>


            <div class="teacher-location">

                <i class="fa-solid fa-location-dot"></i>

                ${escapeHTML(
                    teacher.location ||
                    "শ্রীকৃষ্ণপুর"
                )}

            </div>


            <div class="teacher-buttons">

                <a
                    href="tel:+${phone}"
                    class="teacher-btn teacher-call">

                    <i class="fa-solid fa-phone"></i>

                    Call Now

                </a>


                <a
                    href="https://wa.me/${phone}?text=${whatsappMessage}"
                    target="_blank"
                    rel="noopener"
                    class="teacher-btn teacher-whatsapp">

                    <i class="fa-brands fa-whatsapp"></i>

                    WhatsApp

                </a>


                <a
                    href="${escapeHTML(
                        teacher.details_url ||
                        "#"
                    )}"
                    class="teacher-btn teacher-details">

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

                        btn.classList.remove("active");

                    }
                );


                this.classList.add("active");


                showTeachers(
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
