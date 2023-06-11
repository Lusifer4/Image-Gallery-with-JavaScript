const imageWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const  downloadImgBtn= lightBox.querySelector(".uil-import");


const apiKey = "2BOBeW68Qh11XSQwiEt9atKIyAYRlrHKSHbJ8tll0TXhPUml7R9SdOVP";
const perPage =15;
let curretedPage = 1;
let searchTerm = null;

const downloadImg = (imgURL)=>{
    fetch(imgURL).then(res => res.blob()).then(File => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(File);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download image!"))
}

const showLightbox =(name , img) =>{
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img);5
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    imageWrapper.innerHTML +=images.map(img => 
        `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="img">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <div>
                <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </div>
        </li>`
        ).join("");
}


const getImages = (apiURL) =>{
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey}
    }).then(res=> res.json()).then(data=>{
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert ("Faild to load images"));
}

const loadmoreImages = ()=>{
    
    curretedPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${curretedPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${curretedPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (e)=>{
    if (e.target.value === "") {return searchTerm = null};
    if (e.key==="Enter") {
        curretedPage =1;
        searchTerm = e.target.value;
        imageWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${curretedPage}&per_page=${perPage}`)
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${curretedPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadmoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));