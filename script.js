// Blur Header
const blurlHeader = () => {
  const header = document.getElementById("header");
  // Add a class if the bottom offset is greater than 50 of the viewport
  this.scrollY >= 50
    ? header.classList.add("blur-header")
    : header.classList.remove("blur-header");
};
window.addEventListener("scroll", blurlHeader);

// variables declaration

let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let count = document.getElementById("count");
let no = 1;

const navbar = document.getElementById("nav");
const brandName = document.getElementById("brand");
const searchForm = document.getElementById("searchForm");
const searchKey = document.getElementById("searchKey");
const searchBtn = document.getElementById("searchBtn");
const searchQuery = document.getElementById("searchQuery");
const column1 = document.getElementById("col-1");
const column2 = document.getElementById("col-2");
const column3 = document.getElementById("col-3");
const column4 = document.getElementById("col-4");
const errorAlert = document.getElementById("errorAlert");
const modalBody = document.getElementById("modalBody");
const viewImage = document.getElementById("viewImage");
const showMoreBtn = document.getElementById("showMoreBtn");
const footer = document.querySelector("footer");
const loader = document.getElementById("loader");
let orderByValue = "";

// Slider

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("next")) {
    // Your logic for next button
    let items = document.querySelectorAll(".item");
    let last = document.querySelector(".slide").appendChild(items[0]);
    last.style.animation = "popup 0.5s ease-in-out";
    no++;
    if (no > items.length) {
      no = 1;
    }
    count.textContent = `0${no}`;
  } else if (event.target.classList.contains("prev")) {
    // Your logic for prev button
    let items = document.querySelectorAll(".item");
    document.querySelector(".slide").prepend(items[items.length - 1]);
    no--;
    if (no < 1) {
      no = items.length;
    }
    count.textContent = `0${no}`;
  }
});

// API
let currentPage = 1;
apiKey = "kZWt9uHjviv_0jlM_YNbrhnMS7lSebHkShYPUm2TNCY";
apiURL = `https://api.unsplash.com/photos/?client_id=${apiKey}&per_page=30`;
searchURL = `https://api.unsplash.com/search/photos/?client_id=${apiKey}&per_page=30&query=`;

window.onload = (e) => {
  loader.style.display = "none";
  fetchData();
};

const fetchData = async (page = 1) => {
  loader.style.display = "block";
  try {
    let tempURL = apiURL + `&page=${page}`;
    if (orderByValue != "") {
      tempURL += "&order_by=" + orderByValue;
    }
    // console.log(tempURL);

    const response = await fetch(tempURL).catch(handle);
    if (!response.ok) {
      handle("Failed to fetch");
      return;
    }
    const data = await response.json();

    let imagesArray = data;

    displayImages(imagesArray);
    footer.style.position = "relative";
    loader.style.display = "none";
  } catch (error) {
    console.error(error);
    // Handle error
    loader.style.display = "none";
  }
};

const displayImages = (imagesArray) => {
  console.log("Show Images");
  errorAlert.innerHTML = "";
  if (imagesArray.length === 0) {
    handle();
    return;
  }
  // console.log(imagesArray);

  imagesArray.forEach((image, index) => {
    let img = document.createElement("img");
    img.src = image.urls.regular;
    img.setAttribute("width", "100%");
    img.setAttribute("onclick", "displayFullImage(this.src)");

    // Create container for image and description
    let container = document.createElement("div");
    container.classList.add("image-container");

    // Create description text element
    let text = document.createElement("p");
    text.classList.add("image-description");
    text.classList.add("m-0");
    text.innerHTML = image.alt_description;

    // Append image and description to container
    container.appendChild(img);
    container.appendChild(text);

    // Calculate the column to append the container based on index
    if ((index + 1) % 4 === 0) {
      column1.appendChild(container);
    }
    if ((index + 2) % 4 === 0) {
      column2.appendChild(container);
    }
    if ((index + 3) % 4 === 0) {
      column3.appendChild(container);
    }
    if ((index + 4) % 4 === 0) {
      column4.appendChild(container);
    }
  });
};

const displayFullImage = (src) => {
  let img = document.createElement("img");
  img.src = src;
  img.style.transform = "none";
  img.classList.add("mt-3");
  img.setAttribute("width", "100%");
  modalBody.innerHTML = "";
  modalBody.appendChild(img);

  viewImage.href = src;

  let myModal = new bootstrap.Modal(document.getElementById("modal"));
  myModal.show();
};

searchBtn.addEventListener("click", () => {
  if (searchKey.value != "") {
    column1.innerHTML = "";
    column2.innerHTML = "";
    column3.innerHTML = "";
    column4.innerHTML = "";
    fetchSearchData(searchKey.value);
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (searchKey.value.trim() !== "") {
    column1.innerHTML = "";
    column2.innerHTML = "";
    column3.innerHTML = "";
    column4.innerHTML = "";
    fetchSearchData(searchKey.value);
  }
});

const fetchSearchData = async (key, page = 1) => {
  // Set the position of the footer based on the page number
  footer.style.position = page === 1 ? "absolute" : "relative";

  // Show loader
  loader.style.display = "block";

  try {
    let orderByvariable = orderByValue;
    let tempURL = searchURL + key + `&page=${page}`;
    if (orderByvariable !== "") {
      tempURL += "&order_by=" + orderByvariable;
    }

    const response = await fetch(tempURL).catch(handle);
    if (!response.ok) {
      handle("Failed to fetch");
      return;
    }
    const data = await response.json();
    if (data) {
      console.log("Successfully Search data");
    }
    if (data.total_pages > 1) {
      showMoreBtn.style.display = "block";
    } else {
      showMoreBtn.style.display = "none";
    }

    searchQuery.innerHTML = `Search: ${key}`;
    let imagesArray = data.results;

    // Set the position of the footer back to relative
    footer.style.position = "relative";

    // Hide loader
    loader.style.display = "none";

    displayImages(imagesArray);
  } catch (error) {
    console.error(error);
    // Handle error
    loader.style.display = "none";
  }
};

const displayMoreImages = () => {
  currentPage++;
  if (searchKey.value !== "") {
    fetchSearchData(searchKey.value, currentPage);
  } else {
    fetchData(currentPage);
  }
};

showMoreBtn.addEventListener("click", displayMoreImages);

const orderBy = () => {
  orderByValue = document.getElementById("orderBy").value;

  if (searchKey.value != "") {
    column1.innerHTML = "";
    column2.innerHTML = "";
    column3.innerHTML = "";
    column4.innerHTML = "";
    footer.style.position = "relative";
    fetchSearchData(searchKey.value);
  } else {
    column1.innerHTML = "";
    column2.innerHTML = "";
    column3.innerHTML = "";
    column4.innerHTML = "";
    footer.style.position = "absolute";
    fetchData();
  }
};

let handle = function (err) {
  console.error(err);
  errorAlert.innerHTML = `<h4 class="overflow-hidden text-white"> Unable to found data <h4>`;
};

const scrollUp = () => {
  const scrollUp = document.getElementById("backToTopBtn");
  // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
  this.scrollY >= 350
    ? scrollUp.classList.add("show-scroll")
    : scrollUp.classList.remove("show-scroll");

};
window.addEventListener("scroll", scrollUp,);
