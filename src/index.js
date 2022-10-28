import axios from 'axios';
import Notiflix from 'notiflix';

FETCH_API_URL = "https://pixabay.com/api/";
API_KEY = "26135070-3e729b9e8c0999352fd85e768";
IMAGES_PER_PAGE = 40;

const galleryContainer = document.querySelector(".gallery");
const searchForm = document.getElementById("search-form");
const loadMoreBtn = document.querySelector(".load-more");
// console.log(searchForm.searchQuery.value);

let page = 1;
let amountImages = "";
let maxAmountImages = "";

searchForm.addEventListener("click", (evt)=>{
  evt.preventDefault()
  fetchApi(searchForm.searchQuery.value, page)
});

loadMoreBtn.addEventListener("click", loadMoreResults);

const fetchApi = async (inputValue,nextPage) => {
  if (!inputValue) {
    galleryContainer.innerHTML = "";
    loadMoreBtn.style.display="none";
    return
  }
  try {
    const searchText = inputValue.split(" ").join("+");
    const params = new URLSearchParams({
    key: API_KEY,
    q: searchText,
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
          <img src="${image.previewURL}" alt="${image.tags}" loading="lazy" data-large="${image.largeImageURL}"/>
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
    })
  } catch (error) {
    console.log(error);
  }
};

function loadMoreResults() {
  page+=1;
  fetchApi(searchForm.searchQuery.value, page);
  amountImages = IMAGES_PER_PAGE * page;
}



// fetchApi("piano")