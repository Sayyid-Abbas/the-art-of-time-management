import chaptersList from "./chapters.js";

// Nav Bar
let nav = document.querySelector("nav");
let navLink = document.querySelector(".nav-link");
navLink.addEventListener("click", () => {
    nav.classList.toggle("active");
})
document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !navLink.contains(e.target)) {
        nav.classList.remove("active");
    }
});


// Chpters in Nav Bar
let chaptersArrow = document.querySelector(".chapters-arrow");
let chapters = document.querySelector(".chapters");
const mobileChapters = document.querySelector(".mobile-chapters"); 
chaptersArrow.addEventListener("click", async () => {

    if(document.body.offsetWidth <= 768) {
        if(mobileChapters.classList.contains("active")) {
            mobileChapters.classList.remove("active");
            setTimeout(() => {
                mobileChapters.innerHTML = "";
            }, 100);
        } else {
            const ul = await chaptersList();
            mobileChapters.appendChild(ul);
            setTimeout(() => {
                mobileChapters.classList.add("active");
            }, 100);
        }
        return;
    } 
    if(chapters.classList.contains("active")) {

        chapters.classList.remove("active");
        setTimeout(() => {
            chapters.innerHTML = "";
        }, 100);


    } else {
        const ul = await chaptersList();
        chapters.appendChild(ul);
        setTimeout(() => {
            chapters.classList.add("active");
        }, 100)
    }
})
document.addEventListener("click", (e) => {
    if (!chapters.contains(e.target) && !chaptersArrow.contains(e.target)) {
        chapters.classList.remove("active");
        setTimeout(() => {
            chapters.innerHTML = "";
        }, 100);
    }
    if (!mobileChapters.contains(e.target) && !chaptersArrow.contains(e.target)) {
        mobileChapters.classList.remove("active");
        setTimeout(() => {
            mobileChapters.innerHTML = "";
        }, 100);
    }
})
document.addEventListener("scroll", () => {
    chapters.classList.remove("active");
    setTimeout(() => {
        chapters.innerHTML = "";
    }, 100);
    mobileChapters.classList.remove("active");
    setTimeout(() => {
        mobileChapters.innerHTML = "";
    }, 100);
})


// Footer
let year = document.querySelector(".year");
year.textContent = new Date().getFullYear()