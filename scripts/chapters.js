export default async function chaptersList() {
    try {
        if(localStorage.getItem("chaptersList")) {
            const inHtml = localStorage.getItem("chaptersList");
            const ul = document.createElement("ul");
            ul.classList.add("chapters-list");


            ul.innerHTML = inHtml;
            const cachedChapters = ul;
            
            return cachedChapters;
        } else {
            const response = await fetch("/jsons/chaptersInfo.json");
            const data = await response.json();
    
            const chapters = document.createElement("ul");
            chapters.classList.add("chapters-list");
    
            data.forEach(chapter => {
                const li = document.createElement("li"); 
                
                const chapterNumber = document.createElement("div");
                chapterNumber.classList.add("chapter-number");
                chapterNumber.textContent = chapter.number;
    
                const title = document.createElement("div");
                title.classList.add("chapter-title");
                title.textContent = chapter.title;
    
                const description = document.createElement("div");
                description.classList.add("chapter-description");
                description.textContent = chapter.description;
    
                li.appendChild(chapterNumber);
                li.appendChild(title);
                li.appendChild(description);
                chapters.appendChild(li);
            });
            localStorage.setItem("chaptersList", chapters.innerHTML);
            return chapters;
        }

    } catch (error) {
        console.error("Error fetching chapters:", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Failed to load chapters.";
        return errorMessage;
    }
}
