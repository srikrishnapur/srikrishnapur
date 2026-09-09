/* =========================================
   SRIKRISHNAPUR VISITOR ANALYTICS
========================================= */

(function () {

    "use strict";


    /* =========================
       CONFIG
    ========================= */

    const API_URL =
        "https://srikrishnapur-analytics.mr-nuralammondal.workers.dev";


    const COOKIE_NAME =
        "sk_visitor_id";


    const COOKIE_DAYS =
        3650; // approximately 10 years


    /* =========================
       UUID
    ========================= */

    function generateVisitorId() {

        if (
            crypto &&
            crypto.randomUUID
        ) {

            return crypto.randomUUID();

        }


        return (
            Date.now().toString(36) +
            "-" +
            Math.random()
                .toString(36)
                .substring(2) +
            "-" +
            Math.random()
                .toString(36)
                .substring(2)
        );

    }


    /* =========================
       GET COOKIE
    ========================= */

    function getCookie(name) {

        const cookies =
            document.cookie.split(";");


        for (
            let cookie of cookies
        ) {

            cookie =
                cookie.trim();


            if (
                cookie.startsWith(
                    name + "="
                )
            ) {

                return decodeURIComponent(
                    cookie.substring(
                        name.length + 1
                    )
                );

            }

        }


        return null;

    }


    /* =========================
       SET COOKIE
    ========================= */

    function setCookie(
        name,
        value,
        days
    ) {

        const maxAge =
            days * 24 * 60 * 60;


        document.cookie =
            `${name}=${encodeURIComponent(value)};` +
            `Max-Age=${maxAge};` +
            `Path=/;` +
            `SameSite=Lax;` +
            `Secure`;

    }


    /* =========================
       GET / CREATE ID
    ========================= */

    let visitorId =
        getCookie(COOKIE_NAME);


    let isNewVisitor = false;


    if (!visitorId) {

        visitorId =
            generateVisitorId();

        setCookie(
            COOKIE_NAME,
            visitorId,
            COOKIE_DAYS
        );

        isNewVisitor = true;

    }


    /* =========================
       CURRENT PAGE
    ========================= */

    const page =
        window.location.pathname || "/";


    /* =========================
       SEND ANALYTICS
    ========================= */

    fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"

        },

        body: JSON.stringify({

            visitor_id:
                visitorId,

            page:
                page,

            new_visitor:
                isNewVisitor

        }),

        keepalive: true

    })

    .catch(function () {

        /*
         Analytics failure should
         never break the website.
        */

    });


})();
