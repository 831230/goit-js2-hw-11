import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
// import "simplelightbox/dist/simple-lightbox.min.css";

FETCH_API_URL = "https://pixabay.com/api/";
API_KEY = "26135070-3e729b9e8c0999352fd85e768";
IMAGES_PER_PAGE = 40;

const galleryContainer = document.querySelector(".gallery");
const searchForm = document.getElementById("search-form");
const loadMoreBtn = document.querySelector(".load-more");

let page = 1;
let amountImages = "";
let maxAmountImages = "";
let scrollSetupValue = 65;

searchForm.addEventListener("click", (evt)=>{
  evt.preventDefault();
  fetchApi(searchForm.searchQuery.value, page);
  
    if (evt.target.tagName==="BUTTON" && searchForm.searchQuery.value.length>0) {
      setTimeout(() => {
        Notiflix.Notify.info(`Hooray! We found ${maxAmountImages} images.`);
    }, 500);
  }

  setTimeout(() => {
    const gallery = new SimpleLightbox(".photo-card a", {
      captionDelay: 250,
      captionsData: "alt",
    });
    gallery.on("show.simplelightbox");
  }, 200);
});

loadMoreBtn.addEventListener("click", loadMoreResults);

const fetchApi = async (inputValue,nextPage) => {
  if (!inputValue) {
    galleryContainer.innerHTML = "";
    loadMoreBtn.style.display="none";
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
      return
    }
    galleryContainer.innerHTML = response.data.hits.map(image => {
      loadMoreBtn.style.display="block";
      return `
        <div class="photo-card">
          <a href="${image.largeImageURL}">
            <img src="${image.previewURL}" alt=" " loading="lazy" data-large="${image.largeImageURL}"/>
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
    // const gallery = new SimpleLightbox(".photo-card a", {
    //   captionDelay: 250,
    //   captionsData: "alt",
    // });
    // gallery.on("show.simplelightbox");
  } catch (error) {
    console.log(error);
  }
};


function showSimplelightbox(event){
  
  console.log(event.target.tagName);
  if (event.target.tagName==="A") {
    event.preventDefault();
    const gallery = new SimpleLightbox(".photo-card a", {
      captionDelay: 250,
      captionsData: "alt",
    });
    return gallery.on("show.simplelightbox");
  };
};

const nav = 70;


function scrollDelay(){
  window.scrollTo({top: scrollSetupValue, behavior: "smooth"});
  scrollSetupValue-=5;
  console.log(scrollSetupValue);
};

const scrollUp = () => {
  window.scrollTo({top: nav, behavior: "smooth"});
  setTimeout(() => {
    const intervalId = setInterval(() => {
      scrollDelay();
        if (scrollSetupValue<=-400) {
        clearInterval(intervalId)
      }
    }, 10);   
  }, 700);
}

function loadMoreResults() {
  qqq=65;
  page+=1;
  fetchApi(searchForm.searchQuery.value, page);
  amountImages = IMAGES_PER_PAGE * page;
  setTimeout(() => {
    scrollUp()
  }, 600);
};

// ==================================KOPY==========================================

// const galleryContainer = document.querySelector(".gallery");
// const searchForm = document.getElementById("search-form");
// const loadMoreBtn = document.querySelector(".load-more");

// let page = 1;
// let amountImages = "";
// let maxAmountImages = "";

// searchForm.addEventListener("click", (evt)=>{
//   evt.preventDefault()
//   fetchApi(searchForm.searchQuery.value, page)
// });

// loadMoreBtn.addEventListener("click", loadMoreResults);

// const fetchApi = async (inputValue,nextPage) => {
//   if (!inputValue) {
//     galleryContainer.innerHTML = "";
//     loadMoreBtn.style.display="none";
//     return
//   }
//   try {
//     const searchText = inputValue.split(" ").join('+');
//     const params = new URLSearchParams({
//     key: API_KEY,
//     q: searchText,
//     image_type: "photo",
//     orientation: "horizontal",
//     safesearch: true,
//     page: nextPage,
//     per_page: IMAGES_PER_PAGE
//   })
  
//     const response = await axios(FETCH_API_URL + "?" + params);
//     maxAmountImages = response.data.totalHits;
//     if (response.data.hits.length==0) {
//       Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
//       galleryContainer.innerHTML = "";
//       loadMoreBtn.style.display="none";
//       return
//     };
//     if (amountImages>=maxAmountImages) {
//       Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
//       loadMoreBtn.style.display="none";
//       return
//     }
//     galleryContainer.innerHTML = response.data.hits.map(image => {
//       console.log(image);
//       loadMoreBtn.style.display="block";
//       return `
//         <div class="photo-card">
//           <img src="${image.previewURL}" alt=" " loading="lazy" data-large="${image.largeImageURL}"/>
//           <div class="info">
//             <p class="info-item">
//               <b>Likes</b>${image.likes}
//             </p>
//             <p class="info-item">
//               <b>Views</b>${image.views}
//             </p>
//             <p class="info-item">
//               <b>Comments</b>${image.comments}
//             </p>
//             <p class="info-item">
//               <b>Downloads</b>${image.downloads}
//             </p>
//           </div>
//         </div>
//         `
//     })
//   } catch (error) {
//     console.log(error);
//   }
// };

// function loadMoreResults() {
//   page+=1;
//   fetchApi(searchForm.searchQuery.value, page);
//   amountImages = IMAGES_PER_PAGE * page;
// };