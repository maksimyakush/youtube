/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

let search;
let nextPageToken;
let pageNumber = 0;
let arr = [];
let pagesArray = [];
let mousePosition;
let input = document.createElement("input");
document.body.appendChild(input);
let itemsBlock = document.createElement("div");
document.body.appendChild(itemsBlock);
itemsBlock.classList.add("items");
itemsBlock.draggable = true;
let btnBlock = document.createElement("div");
btnBlock.classList = "btn-block";
document.body.appendChild(btnBlock);
let prevBtn = document.createElement("button");
prevBtn.textContent = "Previous Page";
prevBtn.classList = "prev-btn";
let nextBtn = document.createElement("button");
nextBtn.classList = "next-btn";
nextBtn.textContent = "Next Page";
let round = document.createElement("div");
round.classList.add("round");
let tooltip = document.createElement("span");
tooltip.classList.add("tooltip");
document.body.appendChild(tooltip);
input.addEventListener("change", () => {
    search = input.value;
    getFetch();
});
function getFetch(x = "CAQQAQ") {
    let searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    params = {
        part: "snippet, id",
        key: "AIzaSyCCJIXC9eWHVKbPxdyocYR9uWK8041DeCw",
        maxResults: 15,
        q: search,
        pageToken: x
    };
    Object.keys(params).forEach(key => searchUrl.searchParams.append(key, params[key]));
    fetch(searchUrl).then(res => res.json()).then(res => {
        nextPageToken = res.nextPageToken;
        prevPageToken = res.prevPageToken || "CAQQAQ";
        let searchIdArr = [];
        let html = res.items.map(c => {
            searchIdArr.push(c.id.videoId);
        });
        return new Promise(resNext => resNext(res));
    }).then(res => {
        let searchIdArr = [];
        res.items.map(item => {
            searchIdArr.push(item.id.videoId);
        });
        let videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
        params1 = {
            part: "snippet, statistics",
            key: "AIzaSyCCJIXC9eWHVKbPxdyocYR9uWK8041DeCw",
            id: searchIdArr.join(",")
        };
        Object.keys(params1).forEach(key => videosUrl.searchParams.append(key, params1[key]));
        fetch(videosUrl).then(searchIdArr => searchIdArr.json()).then(res => {
            res.items.map(item => {
                arr.push(item);
            });
            arr.forEach((item, i) => pagesArray.push(arr.splice(0, 5)));
            let html = pagesArray[0].map(item => {
                return `<div class="item">
                    <div class="main-block__item">
                        <a href="https://www.youtube.com/watch?v=${item.id}" target="blank">
                        <img src="${item.snippet.thumbnails.medium.url}"></img></a>
                        <h4><a href="https://www.youtube.com/watch?v=${item.id}">${item.snippet.title}</a></h4>
                    </div>
                    <ul class="features">
                        <li class="channel">${item.snippet.channelTitle}</h5>
                        <li class="published">${item.snippet.publishedAt.slice(0, 10)}</h5>
                        <li class="views">${Number(item.statistics.viewCount).toLocaleString()}</h5>
                    </ul>
                </div>`;
            }).join("");
            itemsBlock.innerHTML = html;
            btnBlock.appendChild(prevBtn);
            btnBlock.appendChild(round);
            round.textContent = 1;
            btnBlock.appendChild(nextBtn);
            if (pageNumber == 0) {
                prevBtn.classList.remove("prev-btn");
                prevBtn.disabled = true;
                prevBtn.classList.add("btn-disabled");
            } else {
                if (!prevBtn.classList.contains("prev-btn")) prevBtn.classList.add("prev-btn");
                prevBtn.disabled = false;
                if (prevBtn.classList.contains("btn-disabled")) prevBtn.classList.remove("btn-disabled");
            }
        });
    });
}
function getFetchNext(x = pageNumber) {
    let searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    params = {
        part: "snippet, id",
        key: "AIzaSyCCJIXC9eWHVKbPxdyocYR9uWK8041DeCw",
        maxResults: 15,
        q: search,
        pageToken: nextPageToken
    };
    Object.keys(params).forEach(key => searchUrl.searchParams.append(key, params[key]));
    fetch(searchUrl).then(res => res.json()).then(res => {
        nextPageToken = res.nextPageToken;
        prevPageToken = res.prevPageToken || "CAQQAQ";
        let searchIdArr = [];
        let html = res.items.map(item => {
            searchIdArr.push(item.id.videoId);
        });
        return new Promise(resNext => resNext(res));
    }).then(res => {
        let searchIdArr = [];
        res.items.map(item => {
            searchIdArr.push(item.id.videoId);
        });
        let videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
        params1 = {
            part: "snippet, statistics",
            key: "AIzaSyCCJIXC9eWHVKbPxdyocYR9uWK8041DeCw",
            id: searchIdArr.join(",")
        };
        Object.keys(params1).forEach(key => videosUrl.searchParams.append(key, params1[key]));
        fetch(videosUrl).then(searchIdArr => searchIdArr.json()).then(item => {
            item.items.map(item => {
                arr.push(item);
            });
            arr.forEach((a, i) => pagesArray.push(arr.splice(0, 5)));
            let html = pagesArray[x].map(item => {
                return `<div class="item">
                    <div class="main-block__item">
                        <a href="https://www.youtube.com/watch?v=${item.id}" target="blank">
                        <img src="${item.snippet.thumbnails.medium.url}"></img></a>
                        <h4><a href="https://www.youtube.com/watch?v=${item.id}">${item.snippet.title}</a></h4>
                    </div>
                    <ul class="features">
                        <li class="channel">${item.snippet.channelTitle}</h5>
                        <li class="published">${item.snippet.publishedAt.slice(0, 10)}</h5>
                        <li class="views">${Number(item.statistics.viewCount).toLocaleString()}</h5>
                    </ul>
                </div>`;
            }).join("");
            itemsBlock.innerHTML = html;
            btnBlock.appendChild(prevBtn);
            btnBlock.appendChild(round);
            round.textContent = pageNumber + 1;
            btnBlock.appendChild(nextBtn);
            if (pageNumber == 0) {
                prevBtn.classList.remove("prev-btn");
                prevBtn.disabled = true;
                prevBtn.classList.add("btn-disabled");
            } else {
                if (!prevBtn.classList.contains("prev-btn")) prevBtn.classList.add("prev-btn");
                prevBtn.disabled = false;
                if (prevBtn.classList.contains("btn-disabled")) prevBtn.classList.remove("btn-disabled");
            }
        });
    });
}
function renderPrevPage(x = pageNumber) {
    let html = pagesArray[x].map(item => {
        return `<div class="item">
                    <div class="main-block__item">
                        <a href="https://www.youtube.com/watch?v=${item.id}" target="blank">
                        <img src="${item.snippet.thumbnails.medium.url}"></img></a>
                        <h4><a href="https://www.youtube.com/watch?v=${item.id}">${item.snippet.title}</a></h4>
                    </div>
                    <ul class="features">
                        <li class="channel">${item.snippet.channelTitle}</h5>
                        <li class="published">${item.snippet.publishedAt.slice(0, 10)}</h5>
                        <li class="views">${Number(item.statistics.viewCount).toLocaleString()}</h5>
                    </ul>
                </div>`;
    }).join("");
    itemsBlock.innerHTML = html;
    btnBlock.appendChild(prevBtn);
    btnBlock.appendChild(round);
    round.textContent = pageNumber + 1;
    btnBlock.appendChild(nextBtn);
    if (pageNumber == 0) {
        prevBtn.classList.remove("prev-btn");
        prevBtn.disabled = true;
        prevBtn.classList.add("btn-disabled");
    } else {
        if (!prevBtn.classList.contains("prev-btn")) prevBtn.classList.add("prev-btn");
        prevBtn.disabled = false;
        if (prevBtn.classList.contains("btn-disabled")) prevBtn.classList.remove("btn-disabled");
    }
}
function handleDragStart(e) {
    mousePosition = e.clientX;
}
function handleDragEnd(e) {
    if (e.clientX < mousePosition - 70) {
        pageNumber++;
        getFetchNext();
    } else if (e.clientX > mousePosition + 70 && pageNumber > 0) {
        pageNumber--;
        renderPrevPage();
    }
}
nextBtn.addEventListener("mousedown", e => {
    tooltip.style.display = "inline";
    let x = e.clientX;
    let y = e.clientY;
    tooltip.style.top = y - 40 + 'px';
    tooltip.style.left = x + 'px';
    tooltip.textContent = pageNumber + 2;
}, false);
prevBtn.addEventListener("mousedown", e => {
    tooltip.style.display = "inline";
    let x = e.clientX;
    let y = e.clientY;
    tooltip.style.top = y - 40 + 'px';
    tooltip.style.left = x + 'px';
    if (pageNumber > 0) tooltip.textContent = pageNumber - 1;
}, false);
nextBtn.addEventListener("mouseup", () => {
    tooltip.style.display = "";
});
prevBtn.addEventListener("mouseup", () => {
    tooltip.style.display = "";
});
nextBtn.addEventListener("mousemove", () => {
    tooltip.style.display = "";
});
prevBtn.addEventListener("mousemove", () => {
    tooltip.style.display = "";
});

itemsBlock.addEventListener("mousemove", () => {
    tooltip.style.display = "";
});
itemsBlock.addEventListener('dragstart', handleDragStart, false);
itemsBlock.addEventListener('dragend', handleDragEnd, false);
nextBtn.addEventListener("click", () => {
    pageNumber++;
    getFetchNext();
});
prevBtn.addEventListener("click", () => {
    pageNumber--;
    renderPrevPage();
});

/***/ })
/******/ ]);