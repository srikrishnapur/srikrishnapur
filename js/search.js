/* =========================================
   SRIKRISHNAPUR SEARCH DATABASE
========================================= */

const searchPages = [

    {
        title: "আমাদের গ্রাম",
        description: "শ্রীকৃষ্ণপুর গ্রামের ইতিহাস, অবস্থান ও গুরুত্বপূর্ণ তথ্য।",
        url: "village.html",
        keywords: "village gram srikrishnapur history location"
    },

    {
        title: "About Srikrishnapur",
        description: "শ্রীকৃষ্ণপুর সম্পর্কে জানুন।",
        url: "about.html",
        keywords: "about srikrishnapur"
    },

    {
        title: "Local News",
        description: "শ্রীকৃষ্ণপুরের স্থানীয় খবর ও আপডেট।",
        url: "news.html",
        keywords: "news khabar খবর update"
    },

    {
        title: "Village Notice",
        description: "গুরুত্বপূর্ণ নোটিশ ও ঘোষণা।",
        url: "notice.html",
        keywords: "notice announcement ঘোষণা"
    },

    {
        title: "Village Events",
        description: "পূজা, উৎসব ও গ্রামের বিভিন্ন অনুষ্ঠান।",
        url: "events.html",
        keywords: "event puja festival অনুষ্ঠান উৎসব"
    },

    {
        title: "Village Gallery",
        description: "শ্রীকৃষ্ণপুরের ছবি ও স্মৃতি।",
        url: "gallery.html",
        keywords: "gallery photo ছবি image memory"
    },

    {
        title: "Village Blog",
        description: "গ্রামের গল্প, ইতিহাস ও বিভিন্ন লেখা।",
        url: "blog.html",
        keywords: "blog story article গল্প"
    },

    {
        title: "Doctors",
        description: "স্থানীয় ডাক্তার ও স্বাস্থ্য পরিষেবা।",
        url: "doctors.html",
        keywords: "doctor ডাক্তার health healthcare"
    },

    {
        title: "Teachers",
        description: "গ্রামের শিক্ষক ও শিক্ষা সম্পর্কিত তথ্য।",
        url: "teachers.html",
        keywords: "teacher শিক্ষক education"
    },

    {
        title: "Students",
        description: "সফল ও প্রতিভাবান ছাত্রছাত্রী।",
        url: "students.html",
        keywords: "student ছাত্রছাত্রী education result"
    },

    {
        title: "Auto & Transport",
        description: "স্থানীয় Auto ও Transport তথ্য।",
        url: "auto.html",
        keywords: "auto transport gari vehicle"
    },

    {
        title: "Local Shops",
        description: "শ্রীকৃষ্ণপুরের দোকান ও ব্যবসা।",
        url: "shops.html",
        keywords: "shop দোকান business store"
    },

    {
        title: "Business",
        description: "স্থানীয় ব্যবসা ও পরিষেবা।",
        url: "business.html",
        keywords: "business ব্যবসা দোকান"
    },

    {
        title: "Social Media Influencers",
        description: "শ্রীকৃষ্ণপুরের Content Creator ও Influencer।",
        url: "influencers.html",
        keywords: "influencer creator social media youtube instagram"
    },

    {
        title: "Village Gamers",
        description: "শ্রীকৃষ্ণপুরের Gamers ও Gaming Community।",
        url: "gamers.html",
        keywords: "gamer gaming game"
    },

    {
        title: "Education",
        description: "শিক্ষা সম্পর্কিত তথ্য।",
        url: "education.html",
        keywords: "education school college পড়াশোনা"
    },

    {
        title: "Jobs & Careers",
        description: "চাকরি ও Career Opportunity।",
        url: "jobs.html",
        keywords: "job চাকরি career work employment"
    },

    {
        title: "Local Services",
        description: "স্থানীয় বিভিন্ন পরিষেবা।",
        url: "services.html",
        keywords: "service পরিষেবা"
    },

    {
        title: "Emergency",
        description: "জরুরি তথ্য ও Emergency Contact।",
        url: "emergency.html",
        keywords: "emergency জরুরি police ambulance"
    },

    {
        title: "Online Skills",
        description: "Online Skill ও earning শেখার তথ্য।",
        url: "skills.html",
        keywords: "online earning skill freelancing digital money"
    },

    {
        title: "Refer & Earn",
        description: "Referral এবং earning opportunities।",
        url: "refer-earn.html",
        keywords: "refer referral earn earning money"
    },

    {
        title: "Contact",
        description: "Srikrishnapur-এর সঙ্গে যোগাযোগ করুন।",
        url: "contact.html",
        keywords: "contact যোগাযোগ email"
    }

];


/* =========================================
   SEARCH
========================================= */

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const searchResults =
    document.getElementById("searchResults");


function performSearch(){

    if(!searchInput) return;


    const query =
        searchInput.value
        .trim()
        .toLowerCase();


    if(!query){

        searchResults.style.display =
            "none";

        searchResults.innerHTML =
            "";

        return;

    }


    const results =
        searchPages.filter(function(page){

            const searchableText =

                page.title.toLowerCase()
                + " "
                +
                page.description.toLowerCase()
                + " "
                +
                page.keywords.toLowerCase();


            return searchableText.includes(query);

        });


    displayResults(
        results,
        query
    );

}


/* =========================================
   DISPLAY RESULTS
========================================= */

function displayResults(
    results,
    query
){

    searchResults.style.display =
        "block";


    if(!results.length){

        searchResults.innerHTML = `

            <div>

                <strong>
                    😔 কোনো ফলাফল পাওয়া যায়নি
                </strong>

                <p style="color:#667570;margin-top:5px">

                    অন্য কোনো শব্দ দিয়ে আবার চেষ্টা করুন।

                </p>

            </div>

        `;

        return;

    }


    searchResults.innerHTML = `

        <div style="margin-bottom:10px">

            <strong>
                🔎 "${query}" এর জন্য ফলাফল
            </strong>

        </div>

        ${
            results.map(function(page){

                return `

                    <a
                    href="${page.url}"
                    class="search-result-item">

                        <strong>
                            ${page.title}
                        </strong>

                        <br>

                        <small>
                            ${page.description}
                        </small>

                    </a>

                `;

            }).join("")

        }

    `;

}


/* =========================================
   BUTTON
========================================= */

if(searchButton){

    searchButton.addEventListener(
        "click",
        performSearch
    );

}


/* =========================================
   ENTER KEY
========================================= */

if(searchInput){

    searchInput.addEventListener(
        "keydown",
        function(event){

            if(event.key === "Enter"){

                performSearch();

            }

        }
    );


    /* Live search */

    searchInput.addEventListener(
        "input",
        function(){

            if(
                searchInput.value.trim().length >= 2
            ){

                performSearch();

            }
            else{

                searchResults.style.display =
                    "none";

            }

        }
    );

}