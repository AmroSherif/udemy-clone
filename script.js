function getCourseAuthor(instructors) {
  let instructorsList = "";
  for (let i = 0; i < instructors.length; i++) {
    instructorsList += instructors[i].name;
    if (i != instructors.length - 1) {
      instructorsList += ", ";
    }
  }
  return instructorsList;
}

let globalCategoryNumber;
let globalJson;
let coursesWrapper;

function displayCategoryHeader() {
  coursesWrapper = document.createElement("div");
  coursesWrapper.classList.add("courses-wrapper");
  document.querySelector(".section-container").appendChild(coursesWrapper);

  let headerContent = globalJson[globalCategoryNumber]["header"];
  let headerElement = document.createElement("h3");
  headerElement.textContent = headerContent;
  coursesWrapper.appendChild(headerElement);
}

function displayCategoryDescription() {
  let descriptionContent = globalJson[globalCategoryNumber]["description"];
  let descriptionElement = document.createElement("p");
  descriptionElement.textContent = descriptionContent;
  coursesWrapper.appendChild(descriptionElement);
}

function displayCategoryLink() {
  let linkContent = globalJson[globalCategoryNumber]["title"];
  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", "");
  linkElement.classList.add("a-button-light");
  linkElement.classList.add("category-link");
  linkElement.textContent = "Explore " + linkContent;
  coursesWrapper.appendChild(linkElement);
}

function displayCourseImg(courseInfo, course) {
  let courseImg = document.createElement("img");
  courseImg.setAttribute("src", courseInfo.image);
  course.appendChild(courseImg);
}

function displayCourseTitle(courseInfo, course) {
  let courseTitle = document.createElement("h4");
  let courseTitleLink = document.createElement("a");
  courseTitleLink.setAttribute("href", "");
  courseTitleLink.textContent = courseInfo.title;
  courseTitle.appendChild(courseTitleLink);
  course.appendChild(courseTitle);
}

function displayCourseAuthor(courseInfo, course) {
  let courseAuthorWrapper = document.createElement("div");
  courseAuthorWrapper.classList.add("course-author");
  courseAuthorWrapper.textContent = getCourseAuthor(courseInfo.instructors);
  course.appendChild(courseAuthorWrapper);
}

function displayCourseRatingNumber(courseInfo, courseRatingWrapper) {
  let ratingNumber = parseFloat(courseInfo.rating.toFixed(1));
  let ratingNumberDiv = document.createElement("div");
  ratingNumberDiv.classList.add("rating-number");
  ratingNumberDiv.textContent = ratingNumber;
  courseRatingWrapper.appendChild(ratingNumberDiv);
}

function displayCourseRatingstars(courseInfo, courseRatingWrapper) {
  let ratingNumber = parseFloat(courseInfo.rating.toFixed(1));

  let ratingStarsWrapper = document.createElement("div");
  ratingStarsWrapper.classList.add("rating-star-wrapper");

  for (let i = 1; i <= 5; i++) {
    let starImg = document.createElement("img");
    if (i <= ratingNumber) {
      starImg.setAttribute("src", "./img/star-fill.svg");
    } else {
      if (ratingNumber % 1 && i == parseInt(ratingNumber) + 1) {
        starImg.setAttribute("src", "./img/star-half.svg");
      } else {
        starImg.setAttribute("src", "./img/star.svg");
      }
    }
    ratingStarsWrapper.appendChild(starImg);
  }

  courseRatingWrapper.appendChild(ratingStarsWrapper);
}

function displayCourseVotingsCount(courseInfo, courseRatingWrapper) {
  let votingsCountWrapper = document.createElement("div");
  votingsCountWrapper.classList.add("votings-count");
  votingsCountWrapper.textContent = `(${courseInfo.num_reviews.toLocaleString()})`;
  courseRatingWrapper.appendChild(votingsCountWrapper);
}

function displayCourseRating(courseInfo, course) {
  let courseRatingWrapper = document.createElement("div");
  courseRatingWrapper.classList.add("course-rating");

  displayCourseRatingNumber(courseInfo, courseRatingWrapper);
  displayCourseRatingstars(courseInfo, courseRatingWrapper);
  displayCourseVotingsCount(courseInfo, courseRatingWrapper);

  course.appendChild(courseRatingWrapper);
}

function displayCoursePrice(courseInfo, course) {
  let coursePriceWrapper = document.createElement("div");
  coursePriceWrapper.classList.add("course-price");
  coursePriceWrapper.textContent = `E£ ${courseInfo.price}`;
  course.appendChild(coursePriceWrapper);
}

function displayCategoryCourses(prefix = "") {
  let coursesList = globalJson[globalCategoryNumber]["courses"];

  let coursesListWrapper = document.createElement("div");
  coursesListWrapper.classList.add("courses-list");
  coursesListWrapper.classList.add("swiper-wrapper");

  coursesListWrapper.setAttribute("id", "scroll-down");

  for (let i = 0; i < coursesList.length; i++) {
    if (prefix != "") {
      if (
        coursesList[i].title.toLowerCase().includes(prefix.toLowerCase()) ==
        false
      ) {
        continue;
      }
    }

    let course = document.createElement("div");
    course.classList.add("course");
    course.classList.add("swiper-slide");

    displayCourseImg(coursesList[i], course);
    displayCourseTitle(coursesList[i], course);
    displayCourseAuthor(coursesList[i], course);
    displayCourseRating(coursesList[i], course);
    displayCoursePrice(coursesList[i], course);

    coursesListWrapper.appendChild(course);
  }

  let swiper = document.createElement("div");
  swiper.classList.add("swiper");
  swiper.classList.add("mySwiper");

  swiper.appendChild(coursesListWrapper);

  let nextButton = document.createElement("div");
  nextButton.classList.add("swiper-button-next");
  let prevButton = document.createElement("div");
  prevButton.classList.add("swiper-button-prev");
  swiper.appendChild(nextButton);
  swiper.appendChild(prevButton);

  coursesWrapper.appendChild(swiper);
}

fetch("http://localhost:3000/category")
  .then((res) => res.json())
  .then((json) => {
    globalJson = json;
    globalCategoryNumber = 0;
    displayCategoryHeader();
    displayCategoryDescription();
    displayCategoryLink();
    displayCategoryCourses();
  })
  .then(swiperInit);

// search functionality
function displayMatchedCourses() {
  let searchInput = document.querySelector(".nav-container form input").value;

  document.querySelector(".courses-list").remove();

  displayCategoryCourses(searchInput);
  swiperInit();

  //window.location = "#scroll-down";
}

// search using the search icon
let searchButton = document.querySelector(".nav-container form button");
searchButton.addEventListener("click", displayMatchedCourses);

// search using the enter button
document.querySelector("form input").addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    e.preventDefault();
    displayMatchedCourses();
  }
});

// makes the button of the selected category highlighted
function changeButtonColor(buttonNumber) {
  let selectedButton = document.querySelector(`.b-${buttonNumber}`);

  for (let i = 1; i <= 7; i++) {
    if (
      document
        .querySelector(`.b-${i}`)
        .classList.contains("section-container-dark-button") == true
    ) {
      document
        .querySelector(`.b-${i}`)
        .classList.remove("section-container-dark-button");
    }
  }

  selectedButton.classList.add("section-container-dark-button");
}

function changeCategory(categoryNumber) {
  globalCategoryNumber = categoryNumber - 1;

  document.querySelector(".courses-wrapper").remove();
  displayCategoryHeader();
  displayCategoryDescription();
  displayCategoryLink();
  displayCategoryCourses();

  swiperInit();
  changeButtonColor(categoryNumber);
}

for (let i = 1; i <= 7; ++i) {
  document
    .querySelector(`.b-${i}`)
    .addEventListener("click", () => changeCategory(i));
}

function swiperInit() {
  new Swiper(".mySwiper", {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 20,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 20,
      },
      1200: {
        slidesPerView: 5,
        slidesPerGroup: 5,
        spaceBetween: 20,
      },
    },
  });
}
