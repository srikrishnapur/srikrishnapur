(function () {

    "use strict";


    /*
    |--------------------------------------------------------------------------
    | Analytics API
    |--------------------------------------------------------------------------
    */

    const API_URL =
        "https://mrnoor.in/api/visitor.php";


    /*
    |--------------------------------------------------------------------------
    | Cookie
    |--------------------------------------------------------------------------
    */

    const COOKIE_NAME =
        "sk_visitor_id";


    /*
    | Approximately 10 years
    */

    const COOKIE_DAYS =
        3650;


    /*
    |--------------------------------------------------------------------------
    | Generate visitor ID
    |--------------------------------------------------------------------------
    */

    function generateVisitorId() {

        if (
            window.crypto &&
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


    /*
    |--------------------------------------------------------------------------
    | Get cookie
    |--------------------------------------------------------------------------
    */

    function getCookie(name) {

        const cookies =
            document.cookie
                .split(";");


        for (
            let cookie of cookies
        ) {

            cookie =
                cookie.trim();


            if (
                cookie.indexOf(
                    name + "="
                ) === 0
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


    /*
    |--------------------------------------------------------------------------
    | Set cookie
    |--------------------------------------------------------------------------
    */

    function setCookie(
        name,
        value,
        days
    ) {

        const expires =
            new Date(
                Date.now() +
                days *
                24 *
                60 *
                60 *
                1000
            );


        document.cookie =
            name +
            "=" +
            encodeURIComponent(value) +
            "; expires=" +
            expires.toUTCString() +
            "; path=/" +
            "; SameSite=Lax" +
            "; Secure";

    }


    /*
    |--------------------------------------------------------------------------
    | Get or create visitor ID
    |--------------------------------------------------------------------------
    */

    let visitorId =
        getCookie(
            COOKIE_NAME
        );


    if (!visitorId) {

        visitorId =
            generateVisitorId();


        setCookie(
            COOKIE_NAME,
            visitorId,
            COOKIE_DAYS
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Current page
    |--------------------------------------------------------------------------
    */

    let page =
        window.location.pathname;


    if (!page) {

        page = "/";

    }


    /*
    |--------------------------------------------------------------------------
    | Send analytics
    |--------------------------------------------------------------------------
    */

    const payload = {

        visitor_id:
            visitorId,

        page:
            page

    };


    fetch(
        API_URL,
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(
                    payload
                ),

            keepalive:
                true

        }
    )

    .then(
        response =>
            response.json()
    )

    .then(
        data => {

            if (
                !data.success
            ) {

                console.warn(
                    "Analytics error:",
                    data
                );

            }

        }
    )

    .catch(
        error => {

            console.warn(
                "Analytics request failed:",
                error
            );

        }
    );


})();
