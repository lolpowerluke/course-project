import { Game } from "./game.js";
import { Genre } from "./genre.js";

let origArray = [];
let genreArray = [];
let searchValue;

function init() {
  document.querySelector('#search + .button').addEventListener('click', (event) => {
    event.preventDefault();
    renderList()
  });
  fetchData();
}

async function fetchData() {
  const data = await fetch("https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/?key=C5D9BAF11CE146F89B2D7193A0C38627");
  const myData = await data.json();
  let dataArray = myData.response.ranks;

  for (const item of dataArray) {
    const data = await fetch(`https://store.steampowered.com/api/appdetails?appids=${item.appid}&key=C5D9BAF11CE146F89B2D7193A0C38627`);
    const myData = await data.json();
    if (myData[item.appid].success == true) {
      let gameData = myData[item.appid].data;
      const gameObject = new Game(item.rank, item.appid, item.concurrent_in_game, item.peak_in_game, gameData.name, gameData.header_image, gameData.short_description, gameData.website, gameData.developers, gameData.genres, gameData.platforms);
      origArray.push(gameObject);
    }
  }
  
  renderList();
  genFilters(origArray)
}

function genFilters(array) {
  for (let i of array) {
    for (let j of i._genres) {
      const genre = new Genre(j.id, j.description)
      if (doesItHaveThisObjectID(genre, genreArray) == false) {
        genreArray.push(genre)
      }
    }
  }
  genreArray.sort(function(a, b){return a._id-b._id})
  renderFilters(genreArray)
}

function doesItHaveThisObjectID(object, array) {
  for (let m of array) {
    if (m._id == object._id) {
      return true
    }
  }
  return false
}

function search(array) {
  let resultsArray = [];
  searchValue = document.getElementById('search').value;
  array.forEach(item => {
    if (item._name.toLowerCase().includes(searchValue.toLowerCase())) {
      resultsArray.push(item)
    }
  });
  return resultsArray;
}

function renderFilters(array) {
  let filterElement = document.getElementById("filters");
  if (array.length > 0) {
    filterElement.innerHTML = "";
    let genresElement = document.createElement("div");
    genresElement.classList = "genres";
    let genreSpanElement = document.createElement("span")
    genreSpanElement.innerHTML = "Genres";
    genresElement.appendChild(genreSpanElement)
    for (let genre of array) {
      let genreElement = document.createElement("div");
      genreElement.classList = "genre";
      let genreCheckboxElement = document.createElement("input");
      genreCheckboxElement.type = "checkbox";
      genreCheckboxElement.id = genre._name;
      genreCheckboxElement.setAttribute("value", genre._name);
      genreElement.appendChild(genreCheckboxElement);
      let genreLabelElement = document.createElement("label");
      genreLabelElement.setAttribute("for", genre._name);
      genreLabelElement.innerHTML = genre._name;
      genreElement.appendChild(genreLabelElement);
      genresElement.appendChild(genreElement);
    }
    filterElement.appendChild(genresElement);
  }
  let platformElement = document.createElement("div");
  platformElement.classList = "platforms";
  platformElement.innerHTML = '<span>platforms</span><div class="platform"><input type="checkbox" id="linux" value="linux"><label for="linux">linux</label></div><div class="platform"><input type="checkbox" id="windows" value="windows"><label for="windows">windows</label></div><div class="platform"><input type="checkbox" id="mac" value="mac"><label for="mac">mac</label></div>';
  filterElement.appendChild(platformElement);
  filterElement.innerHTML += '<button id=filter>filter</button>'

  document.getElementById("filter").addEventListener('click', (event) => {
    event.preventDefault();
    let toggle = document.querySelector('.filters > .toggle');
    toggle.checked = false;
    renderList();
  });
}

function filterList(array) {
  let selectedArrayGenre = document.querySelectorAll('.genre > input');
  let filtersGenre = [];
  let filteredArrayGenre = [];
  let filteredArray = [];
  for(let i of selectedArrayGenre) {
    if (i.checked == true) {
      filtersGenre.push(i.value);
    }
  }
  for (let i of array) {
    let okToAdd = true;
    let genres = [];
    for (let j of i._genres) {
      genres.push(j.description);
    }
    for (let j of filtersGenre) {
      if (genres.includes(j) == false) {
        okToAdd = false;
      }
    }
    if (okToAdd == true) {
      filteredArrayGenre.push(i);
    }
  }
  let selectedArrayPlatform = document.querySelectorAll('.platform > input');
  let filtersPlatform = [];
  for(let i of selectedArrayPlatform) {
    if (i.checked == true) {
      filtersPlatform.push(i.value);
    } 
  }
  for (let i of filteredArrayGenre) {
    let okToAdd = true;
    let platforms = [];
    if (i._platforms.linux == true) {
      platforms.push("linux");
    }
    if (i._platforms.windows == true) {
      platforms.push("windows");
    }
    if (i._platforms.mac == true) {
      platforms.push("mac");
    }
    for (let j of filtersPlatform) {
      if (platforms.includes(j) == false) {
        okToAdd = false;
      }
    }
    if (okToAdd == true) {
      filteredArray.push(i);
    }
  }
  return filteredArray;
}

function renderList() {
  let html = "";
  let filteredArray = filterList(origArray);
  filteredArray = search(filteredArray);
  filteredArray.forEach(item => {
    html += `<div class="game"><img src="${item._image}" alt="img ${item._name}"><div><span class="name">${item._name}</span><span class="playerCount">${item._playerCount} playing</span></div><span class="rank">${item._rank}</span></div>`
  });
  document.getElementById("gameList").innerHTML = html;
}

function renderGraphs(array) {
  
}

init()