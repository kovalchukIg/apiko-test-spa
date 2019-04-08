const listItems = document.querySelector(".list-items");
const listTemplete = document.querySelector("#list-template").content;
const fragment = document.createDocumentFragment();
const search = document.querySelector(".search");
const searchForm = document.querySelector(".search-form");
const plusUrl = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2';
let searchListMovies;

async function getDataTrend() {
    try {
        let response = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=1846adf19abefc0c207f12cd0196c847&language=en-US&page=1");
        let data = await response.json();
        return data
    }catch (err){
        throw new Error("Couldn't get data")
    }
}

async function getSearchdMovies(query) {
    try {
        let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=1846adf19abefc0c207f12cd0196c847&language=en-US&query=${query}&page=1&include_adult=false`);
        let data = await response.json();
        return data
    }catch (err){
        throw new Error("Couldn't get recomend films")
    }
}

async function getRecomendMovie(id) {
    try {
        let response = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=1846adf19abefc0c207f12cd0196c847&language=en-US&page=1`);
        let data = await response.json();
        return data
    }catch (err){
        throw new Error("Couldn't get recomend films")
    }
}


async function createList() {
    let listFilms = await getDataTrend();
    console.log(listFilms);
    if(typeof searchListMovies !== "undefined" ){
        searchListMovies.results.map(item =>{
            const listItem = listTemplete.cloneNode(true);
            listItem.querySelector(".movie-stats").setAttribute("data-id", item.id);
            listItem.querySelector(".list a").textContent = item.title;
            listItem.querySelector(".movie-img").src = plusUrl + item.poster_path;
            listItem.querySelector(".overview h3").textContent = item.title;
            listItem.querySelector(".overview p").textContent = item.overview;
            fragment.appendChild(listItem);
        });
        listItems.appendChild(fragment);
    }else {
        listFilms.results.map(item =>{
            const listItem = listTemplete.cloneNode(true);
            listItem.querySelector(".movie-stats").setAttribute("data-id", item.id);
            listItem.querySelector(".list a").textContent = item.title;
            listItem.querySelector(".movie-img").src = plusUrl + item.poster_path;
            listItem.querySelector(".overview h3").textContent = item.title;
            listItem.querySelector(".overview p").textContent = item.overview;
            fragment.appendChild(listItem);
        });
        listItems.appendChild(fragment);
    }

}
async function showInformation() {
    await createList();
    const items = document.querySelectorAll(".item");
    items.forEach(i =>{
        i.addEventListener("click", handleList);
    });
}

async function changeInput(e) {
    e.preventDefault();
    const eTarget = e.target.value;
    if (eTarget === ""){
        return
    }
    searchListMovies = await getSearchdMovies(eTarget);
}

showInformation();

async function handleList (evt) {
    evt.preventDefault();
    const currentItem = evt.currentTarget;
    const currentid = currentItem.querySelector(".movie-stats").getAttribute("data-id");
    const filmRecomend = await getRecomendMovie(currentid);

    currentItem.querySelector(".recItem a").textContent = filmRecomend.results[0].title;
    currentItem.querySelector(".recItem2 a").textContent = filmRecomend.results[1].title;
    currentItem.querySelector(".recItem3 a").textContent = filmRecomend.results[2].title;
    const currentLi = listItems.querySelectorAll(".item");
    currentLi.forEach(item =>{
        item.classList.add("hidden");
    });
    currentItem.querySelector(".movie-stats").classList.remove("hidden");
    currentItem.classList.remove("hidden");
    currentItem.querySelector(".list").classList.add('hidden');
}

function handleForm(e) {
    e.preventDefault();
    listItems.innerHTML = "";
    showInformation();
}
search.addEventListener("change", changeInput);
searchForm.addEventListener("submit", handleForm);









