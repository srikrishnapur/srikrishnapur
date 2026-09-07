/* =========================================
   MOBILE MENU
========================================= */

const menuButton =
    document.getElementById("menuButton");

const mainNav =
    document.getElementById("mainNav");


if(menuButton){

    menuButton.addEventListener(
        "click",
        function(){

            mainNav.classList.toggle("active");

            const icon =
                menuButton.querySelector("i");

            if(mainNav.classList.contains("active")){

                icon.className =
                    "fa-solid fa-xmark";

            }else{

                icon.className =
                    "fa-solid fa-bars";

            }

        }
    );

}


/* =========================================
   CLOSE MENU AFTER CLICK
========================================= */

document
    .querySelectorAll(".main-nav a")
    .forEach(function(link){

        link.addEventListener(
            "click",
            function(){

                mainNav.classList.remove("active");

                const icon =
                    menuButton.querySelector("i");

                icon.className =
                    "fa-solid fa-bars";

            }
        );

    });



/* =========================================
   SLIDER
========================================= */

const slides =
    document.querySelectorAll(".slide");

const sliderDots =
    document.getElementById("sliderDots");

const prevButton =
    document.getElementById("sliderPrev");

const nextButton =
    document.getElementById("sliderNext");


let currentSlide = 0;

let sliderTimer;


/* Create dots */

if(slides.length && sliderDots){

    slides.forEach(function(slide,index){

        const dot =
            document.createElement("button");

        dot.className =
            "slider-dot";

        dot.setAttribute(
            "aria-label",
            "Slide " + (index + 1)
        );

        dot.addEventListener(
            "click",
            function(){

                showSlide(index);

                restartSlider();

            }
        );

        sliderDots.appendChild(dot);

    });

}


const dots =
    document.querySelectorAll(".slider-dot");


function showSlide(index){

    if(!slides.length) return;


    if(index >= slides.length){

        currentSlide = 0;

    }
    else if(index < 0){

        currentSlide =
            slides.length - 1;

    }
    else{

        currentSlide = index;

    }


    slides.forEach(function(slide,i){

        slide.classList.toggle(
            "active",
            i === currentSlide
        );

    });


    dots.forEach(function(dot,i){

        dot.classList.toggle(
            "active",
            i === currentSlide
        );

    });

}


function nextSlide(){

    showSlide(currentSlide + 1);

}


function previousSlide(){

    showSlide(currentSlide - 1);

}


function startSlider(){

    sliderTimer =
        setInterval(
            nextSlide,
            5000
        );

}


function restartSlider(){

    clearInterval(sliderTimer);

    startSlider();

}


if(nextButton){

    nextButton.addEventListener(
        "click",
        function(){

            nextSlide();

            restartSlider();

        }
    );

}


if(prevButton){

    prevButton.addEventListener(
        "click",
        function(){

            previousSlide();

            restartSlider();

        }
    );

}


if(slides.length){

    showSlide(0);

    startSlider();

}


/* =========================================
   CURRENT YEAR
========================================= */

const currentYear =
    document.getElementById("currentYear");


if(currentYear){

    currentYear.textContent =
        new Date().getFullYear();

}