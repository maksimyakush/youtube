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
let pageMaxNumber = 0;
let pagesArray = [];
let mousePosition;
const pixelsForRerender = 70;
const input = document.createElement('input');
document.body.appendChild(input);
input.placeholder = "Search...";
const itemsBlock = document.createElement('div');
document.body.appendChild(itemsBlock);
itemsBlock.classList.add('items');
itemsBlock.draggable = true;
const btnBlock = document.createElement('div');
btnBlock.classList = 'btn-block';
document.body.appendChild(btnBlock);
const prevBtn = document.createElement('button');
prevBtn.textContent = 'Previous Page';
prevBtn.classList = 'prev-btn';
const nextBtn = document.createElement('button');
nextBtn.classList = 'next-btn';
nextBtn.textContent = 'Next Page';
const round = document.createElement('div');
round.classList.add('round');
function recount(arr) {
    pagesArray = arr.filter(item => item.length > 0 && item.length < 5 && !item.includes(undefined));
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].length == 3 && arr[i + 1]) {
            arr[i].push(arr[i + 1][0]);
            arr[i].push(arr[i + 1][1]);
            arr[i].push(arr[i + 1][2]);
            arr[i + 1].shift();
            arr[i + 1].shift();
            arr[i + 1].shift();
        } else if (arr[i].length == 2 && arr[i + 1]) {
            arr[i].push(arr[i + 1][0]);
            arr[i].push(arr[i + 1][1]);
            arr[i + 1].shift();
            arr[i + 1].shift();
        } else if (arr[i].length == 1 && arr[i + 1]) {
            arr[i].push(arr[i + 1][0]);
            arr[i + 1].shift();
        }
    }
    return arr;
}

function getFetch() {
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    const params = {
        part: 'snippet, id',
        key: 'AIzaSyCCJIXC9eWHVKbPxdyocYR9uWK8041DeCw',
        maxResults: 15,
        q: search
    };
    Object.keys(params).forEach(key => searchUrl.searchParams.append(key, params[key]));
    fetch(searchUrl).then(res => res.json()).then(res => {
        nextPageToken = res.nextPageToken;
        return new Promise(resNext => resNext(res));
    }).then(res => {
        const searchIdArr = [];
        res.items.map(item => searchIdArr.push(item.id.videoId));
        const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
        const videoParams = {
            part: 'snippet, statistics',
            key: 'AIzaSyCCJIXC9eWHVKbPxdyocYR9uWK8041DeCw',
            id: searchIdArr.join(',')
        };
        Object.keys(videoParams).forEach(key => videosUrl.searchParams.append(key, videoParams[key]));
        fetch(videosUrl).then(res => res.json()).then(res => {
            const arr = [];
            res.items.map(item => arr.push(item));
            if (window.screen.width >= 1024 && window.screen.height >= 768) {
                arr.forEach(() => pagesArray.push(arr.splice(0, 4)));
                if (arr.length > 0) pagesArray.push(arr);
            } else arr.forEach(() => pagesArray.push(arr.splice(0, 1)));
            renderPage(0);
        });
    });
}

function getFetchNext() {
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    const params = {
        part: 'snippet, id',
        key: 'AIzaSyCCJIXC9eWHVKbPxdyocYR9uWK8041DeCw',
        maxResults: 15,
        q: search,
        pageToken: nextPageToken
    };
    Object.keys(params).forEach(key => searchUrl.searchParams.append(key, params[key]));
    fetch(searchUrl).then(res => res.json()).then(res => {
        nextPageToken = res.nextPageToken;
        return new Promise(resNext => resNext(res));
    }).then(res => {
        const searchIdArr = [];
        res.items.map(item => searchIdArr.push(item.id.videoId));
        const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
        const videoParams = {
            part: 'snippet, statistics',
            key: 'AIzaSyCCJIXC9eWHVKbPxdyocYR9uWK8041DeCw',
            id: searchIdArr.join(',')
        };
        Object.keys(videoParams).forEach(key => videosUrl.searchParams.append(key, videoParams[key]));
        fetch(videosUrl).then(res => res.json()).then(item => {
            const arr = [];
            item.items.map(item => arr.push(item));
            if (window.screen.width >= 1024 && window.screen.height >= 768) {
                arr.forEach(() => pagesArray.push(arr.splice(0, 4)));
                if (arr.length > 0) pagesArray.push(arr);
            } else arr.forEach(() => pagesArray.push(arr.splice(0, 1)));
        });
    });
}

function renderPage(x) {
    if (window.screen.width >= 1024 && window.screen.height >= 768) recount(pagesArray);
    const html = pagesArray[x].map(item => {
        return `<div class='item'>
            <div class='main-block__item'>
                <a href='https://www.youtube.com/watch?v=${item.id}' target='blank'>
                <img src='${item.snippet.thumbnails.medium.url}'></img></a>
                <h4><a href='https://www.youtube.com/watch?v=${item.id}'>${item.snippet.title}</a></h4>
            </div>
            <ul class='features'>
                <li class='channel'>${item.snippet.channelTitle}</h5>
                <li class='published'>${item.snippet.publishedAt.slice(0, 10)}</h5>
                <li class='views'>${Number(item.statistics.viewCount).toLocaleString()}</h5>
            </ul>
        </div>`;
    }).join('');
    itemsBlock.innerHTML = html;
    btnBlock.appendChild(prevBtn);
    btnBlock.appendChild(round);
    btnBlock.appendChild(nextBtn);
    if (pageNumber === 0) {
        prevBtn.classList.remove('prev-btn');
        prevBtn.disabled = true;
        prevBtn.classList.add('btn-disabled');
    } else {
        if (!prevBtn.classList.contains('prev-btn')) {
            prevBtn.classList.add('prev-btn');
        }
        prevBtn.disabled = false;
        if (prevBtn.classList.contains('btn-disabled')) {
            prevBtn.classList.remove('btn-disabled');
        }
    }
}

input.addEventListener('change', () => {
    search = input.value;
    itemsBlock.innerHTML = '';
    pagesArray = [];
    pageNumber = 0;
    pageMaxNumber = 0;
    round.textContent = 1;
    getFetch();
});
function handleDragStart(e) {
    mousePosition = e.clientX;
}
function handleDragEnd(e) {
    if (e.clientX < mousePosition - pixelsForRerender) {
        pageNumber += 1;
        round.textContent = pageNumber + 1;
        if (pageMaxNumber < pageNumber) {
            pageMaxNumber = pageNumber;
            getFetchNext();
        }
        renderPage(pageNumber);
    } else if (e.clientX > mousePosition + pixelsForRerender && pageNumber > 0) {
        console.log(pagesArray);
        pageNumber -= 1;
        round.textContent = pageNumber + 1;
        renderPage(pageNumber);
    }
}
itemsBlock.addEventListener('dragstart', handleDragStart);
itemsBlock.addEventListener('dragend', handleDragEnd);
nextBtn.addEventListener('click', () => {
    pageNumber += 1;
    round.textContent = pageNumber + 1;
    if (pageMaxNumber < pageNumber) {
        pageMaxNumber = pageNumber;
        getFetchNext();
    }
    renderPage(pageNumber);
});
prevBtn.addEventListener('click', () => {
    pageNumber -= 1;
    round.textContent = pageNumber + 1;
    renderPage(pageNumber);
});

/***/ })
/******/ ]);