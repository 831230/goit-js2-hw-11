import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const FETCH_API_URL = "https://pixabay.com/api/";
const API_KEY = "26135070-3e729b9e8c0999352fd85e768";
const IMAGES_PER_PAGE = 40;

const galleryContainer = document.querySelector(".gallery");
const searchForm = document.getElementById("search-form");
const loadMoreBtn = document.querySelector(".load-more");
const pageNumberInfo = document.querySelector(".page-number");
const loadedImagesInfo = document.querySelector(".loaded-images");

let page = 1;
let amountImages = "";
let maxAmountImages = "";
// let scrollSetupValue = 65;
let pageNumber = 1;
let sumLoadedImages = IMAGES_PER_PAGE;
let sumOfPages = "";


searchForm.addEventListener("click", (evt)=>{
  evt.preventDefault();
  fetchApi(searchForm.searchQuery.value, page);
  
    if (evt.target.tagName==="BUTTON" && searchForm.searchQuery.value.length>0) {
      setTimeout(() => {
        Notiflix.Notify.info(`Hooray! We found ${maxAmountImages} images.`);
        sumOfPages = Math.ceil(maxAmountImages / sumLoadedImages);
        pageNumberInfo.innerHTML = `Page ${pageNumber} &#47; ${sumOfPages}`;
        loadedImagesInfo.innerHTML = `Loaded images ${sumLoadedImages} &#47; ${maxAmountImages}`;
        // amountLoadedImages();
        console.log(maxAmountImages ,sumOfPages);
    }, 500);
  }
});


loadMoreBtn.addEventListener("click", loadMoreResults);

const fetchApi = async (inputValue,nextPage) => {
  if (!inputValue) {
    galleryContainer.innerHTML = "";
    loadMoreBtn.style.display="none";
    pageNumber = 1;
    sumOfPages = 0;
    sumLoadedImages = IMAGES_PER_PAGE;
    pageNumberInfo.innerHTML = "";
    loadedImagesInfo.innerHTML = "";
    return
  }
  try {
    const searchText = inputValue.split(" ").join('+');
    const params = new URLSearchParams({
    key: API_KEY,
    q: searchText,
    lang: "pl",
    lang: "en",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    page: nextPage,
    per_page: IMAGES_PER_PAGE
  })
  
    const response = await axios(FETCH_API_URL + "?" + params);
    maxAmountImages = response.data.totalHits;
    
    if (response.data.hits.length==0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      galleryContainer.innerHTML = "";
      loadMoreBtn.style.display="none";
      return
    };
    if (amountImages>=maxAmountImages) {
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.style.display="none";
      sumLoadedImages = maxAmountImages;
      return
    }
    galleryContainer.innerHTML = response.data.hits.map(image => {
      loadMoreBtn.style.display="block";
      return `
        <div class="photo-card">
          <a href="${image.largeImageURL}">
            <img src="${image.previewURL}" alt="${image.tags}" loading="lazy" data-large="${image.largeImageURL}"/>
          </a>  
          <div class="info">
            <p class="info-item">
              <b>Likes</b>${image.likes}
            </p>
            <p class="info-item">
              <b>Views</b>${image.views}
            </p>
            <p class="info-item">
              <b>Comments</b>${image.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>${image.downloads}
            </p>
          </div>
        </div>
        `
    });
    showSimplelightbox()
  } catch (error) {
    console.log(error);
  }
};


function showSimplelightbox(){
  const gallery = new SimpleLightbox(".photo-card a", {
    captionDelay: 250,
    captionsData: "alt",
  });
  gallery.on("show.simplelightbox");
  gallery.refresh();
};

// function scrollDelay(){
//   window.scrollTo({top: scrollSetupValue, behavior: "smooth"});
//   scrollSetupValue-=5;
// };

// const scrollUp = () => {
//   const nav = 0;
//   window.scrollTo({top: nav, behavior: "smooth"});
//   // setTimeout(() => {
//   //   const intervalId = setInterval(() => {
//   //     scrollDelay();
//   //       if (scrollSetupValue<=-400) {
//   //       clearInterval(intervalId)
//   //     }
//   //   }, 10);   
//   // }, 700);
// }

function loadMoreResults() {
  page+=1;
  fetchApi(searchForm.searchQuery.value, page);
  amountImages = IMAGES_PER_PAGE * page;
  // setTimeout(() => {
  //   scrollUp()
  // }, 600);

  amountLoadedImages()

  pageNumberInfo.innerHTML = `Page ${pageNumber} &#47; ${sumOfPages}`;
  loadedImagesInfo.innerHTML = `Loaded images ${sumLoadedImages} &#47; ${maxAmountImages}`;
};

function amountLoadedImages(){
  pageNumber+=1;
  sumLoadedImages+=IMAGES_PER_PAGE;
  console.log(pageNumber,sumLoadedImages, sumOfPages);
}
