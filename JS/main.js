// image files are server form /content route
// image paths are fetched form data-imagepaths.txt. Which is stored in /content
// paths in the text file are addressed relative to IDLE folder.
// Preceeding part for absoulute address is strored in global imageServer var.
// Root of image server is /content
//////////////// CONFIGS //////////////////////////
var env = 1
// {0:mac, 1: home/office, 100:prod }
var noImage = false;
// var noImage = false;
// only place-holders
var limit = 0;
// limit = 10 ** 4;
// 0: no limit, n: slices the sample
// see appEntry() for implementation.

var server = window.location.hostname;
var port = 80;
var route = "/content";   // content server route

// ************** remove in production ****************
if (env == 0) {
    server = '192.168.29.254'
}

// Selects a random element from an array
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

////////////////// BUFFERS ////////////////////
var g_jsonIndex = [] // all avilabel paths indexed
var g_mainPageBuffer = []; // main page items persist on main page render
var g_pageBuffer = []; // items in the current page for rotation in image view. this may be eliminated as g_pageBuffer = g_navObject[page] 
var g_pages = []; // unique page ids
var g_navPages = []; // side nav search results
var g_persons = [];
var g_navObject = {}  // nested ogject
var g_likes = null



////////////////// HIGH FREQ GLOBALS ////////////
var g_mainView = document.querySelector('.main-view');
var g_pageView = document.querySelector('.page-view');
var g_imageView = document.querySelector('.image-view');




g_imageServer = `http://${server}:${port}${route}/`;
// console.log(g_imageServer)
var g_mainCols = 4;
var g_pageCols = 3;
var g_imgZoomFactor = 1;

////////////////// STATES ///////////////////
var g_sideNavActive = false;
var g_currentPage = "";
var g_currentSl = 0;
var g_currentView = 'main'  // main, page, image


appEntry();


function appEntry() {
    // Fetch the text file containing image paths
    // g_imageServer points upto the /content 
    let dataFile = g_imageServer + 'data-imagepaths.txt'
    console.log(dataFile)
    fetch(dataFile)
        .then(response => response.text())
        .then(data => {
            imagePaths = data.split('\n').filter(path => path.trim() !== '');
            if (limit)
                imagePaths = imagePaths.slice(0, limit);
            console.log('sample-size:', imagePaths.length)
            g_jsonIndex = []
            imagePaths.forEach(function (item, sl) {
                t = item.split('\\')
                page = t[2]
                person = t[1]
                g_jsonIndex.push({
                    'imid': item,
                    'sl': sl,
                    'url': g_imageServer + item,
                    'page': page,
                    'person': person
                })

                g_navObject[page] = g_navObject[page] || [];
                g_navObject[page].push(item)


                g_pages.push(page);
            });

            // console.log(g_jsonIndex)
            // console.log(g_navObject)

            // g_pages = [...new Set(g_pages)];
            // g_persons = [...new Set(g_persons)];
            g_pages = Object.keys(g_navObject);
            // console.log(g_navObject)
            // console.log(g_pages)


            localStorage.removeItem('likes');
            let a = localStorage.getItem('likes');
            if (!a) {
                g_likes = {}
                for (page of g_pages) {
                    // A new arrwy filled with zeros with # of images + 1 (for page itself) elements.
                    g_likes[page] = new Array(g_navObject[page].length + 1).fill(0);
                }
                setLikes()
            }
            else {
                g_likes = JSON.parse(a)
            }
            // console.log(localStorage.getItem('likes'))

            buildMainPageBuffer()
            renderMainView()
        })
        .catch(error => console.error(error));

    ///////////// event listeners /////////////////////////////////
    let pageSearch = document.querySelector('#page-search');
    pageSearch.addEventListener('input', e => {
        let val = e.currentTarget.value;
        document.querySelector('.search-icon').innerHTML = "close"
        if (val.length = 0) {
            document.querySelector('.search-icon').innerHTML = "close"
        }
        createNavItems(val)
    })
    document.addEventListener('keydown', e => {
        // console.log(e.code)
        if (e.code == 'ArrowRight') {
            next()
        }
        else if (e.code == 'ArrowLeft') {
            prev()
        }
    })

    /////////////////////////////////////////////////////////////////////
    // sideToggle()
}


function buildMainPageBuffer() {
    // clearing current images while preserving the refrence.
    g_mainPageBuffer.length = 0
    for (var i = 0; i < 200; i++) {
        g_mainPageBuffer.push(g_jsonIndex.random())
    }
}

function renderMainView() {
    g_currentView = 'main';
    g_mainView.style.display = 'block';
    g_pageView.style.display = 'none';
    g_imageView.style.display = 'none';
    let row = document.querySelector('.main-view .image-row');
    row.replaceChildren();
    for (i = 0; i < g_mainCols; i++) {
        col = document.createElement('div');
        col.classList.add('col-' + g_mainCols);
        col.classList.add('col');
        row.appendChild(col);
    }

    let cols = document.querySelectorAll('.main-view .col');
    cols.forEach(function (c) {
        c.replaceChildren();
    });
    g_mainPageBuffer.forEach(function (item, i) {
        var img = createImage(item);
        img.classList.add('pointer');
        img.addEventListener('click', function (e) {
            renderPageView(e.currentTarget.getAttribute('page'));
        })
        // img.querySelector('img').src = item.url;
        a = i % g_mainCols;
        cols[a].appendChild(img);
    })

    // setTimeout(function () {
    //     let imgs = g_mainView.querySelectorAll('img');
    //     imgs.forEach((item, i) => {
    //         item.src = g_mainPageBuffer[i].url;
    //     })
    // },2000)
}


function renderPageView(page = g_currentPage) {
    g_currentPage = page;
    g_currentView = 'page';
    g_mainView.style.display = 'none';
    g_pageView.style.display = 'block';
    g_imageView.style.display = 'none';

    let row = g_pageView.querySelector('.page-view .image-row');
    row.replaceChildren();
    for (i = 0; i < g_pageCols; i++) {
        let col = document.createElement('div');
        col.classList.add('col-' + g_pageCols);
        col.classList.add('col');
        row.appendChild(col);
    }

    let cols = row.querySelectorAll('.col');
    g_pageBuffer = g_jsonIndex.filter(item => {
        return item.page == page;
    })
    let likes = g_likes[page];
    g_pageBuffer.forEach(function (item, i) {
        var img = createImage(item);
        img.classList.add('pointer');
        img.addEventListener('click', function (e) {
            g_currentSl = i
            console.log(i)
            renderImageView();
        })
        img.setAttribute('sl', i);
        // img.innerHTML += `<div class="image-like">
        //         <i class=" pointer material-icons" onclick="imageLike(this,-1,${i});">chevron_left</i>
        //         <span class="imgae-like-count">${likes[i + 1]}</span>
        //          <i class="pointer material-icons" onclick="imageLike(this,1,${i});">chevron_right</i>
        //     </div>`
        a = i % g_pageCols;
        cols[a].appendChild(img);
    })
    g_pageView.querySelector('.page-name').innerHTML = page;
    let likeCount = g_pageView.querySelector('.page-like-count');
    // console.log(g_likes[page],page,g_currentPage);

    likeCount.innerHTML = likes[0];
    if (likes > 0) {
    }
    else {
    }


    if (g_sideNavActive) {
        setTimeout(navSelect, 0);
    }
}


function renderImageView() {

    g_currentView = 'image';

    if (g_currentSl >= g_pageBuffer.length) g_currentSl = 0;
    if (g_currentSl < 0) g_currentSl = g_pageBuffer.length - 1;

    let sl = g_currentSl;

    g_mainView.style.display = 'none';
    g_pageView.style.display = 'none';
    g_imageView.style.display = 'block';

    let imageContainer = g_imageView.querySelector('.image-container');
    imageContainer.replaceChildren();
    let item = g_pageBuffer[sl];
    let page = item.page;
    let img = createImage(item);
    img.setAttribute('sl', sl)

    t = imageContainer.appendChild(img);
    let imgItem = t.querySelector('.img-item');


    var scale = 1;

    // on mouse move shift the transform origin to the mouse position.
    imgItem.onmousemove = function (event) {
        shiftOrigin(imgItem, event);
    }

    // zoom on mouse wheel keeping the cursor in the same place.
    imgItem.onwheel = function (event) {
        event.preventDefault();
        scale += event.deltaY * -0.01;
        scale = Math.min(Math.max(1, scale), 10);
        shiftOrigin(imgItem, event);
        imgItem.style.transform = `scale(${scale})`;
    }

    // zoom toggle on double click.
    imgItem.ondblclick = function (event) {
        if (scale > 1) {
            scale = 1;
        }
        else {
            scale = 5;
        }
        shiftOrigin(imgItem, event);
        imgItem.style.transform = `scale(${scale})`;
    }


    g_imageView.querySelector('.page-name').innerHTML = g_currentPage;
    g_imageView.querySelector('.image-sl').innerHTML = `${sl + 1} / ${g_pageBuffer.length}`
    g_pageView.querySelector('.page-name').innerHTML = page;

    if (g_sideNavActive) {
        setTimeout(navSelect, 0);
    }
}


function shiftOrigin(ele, event) {

    // This method will shift the transform origin to the mouse position. But if any of the four sides of the image is closer than threshold, it will shift the origin to that side.

    // define the threshold as fraction.
    let threshold = 0.2;

    // get the mouse position relative to the image.
    let x = event.offsetX;
    let y = event.offsetY;

    // get the image dimensions.
    let w = ele.offsetWidth;
    let h = ele.offsetHeight;

    // get the mouse position relative to the image as a percentage.
    let xP = x / w;
    let yP = y / h;

    // get the distance of the mouse from the four sides of the image.
    let xD = Math.min(xP, 1 - xP);
    let yD = Math.min(yP, 1 - yP);

    // define transform origin to be the mouse position.
    let xT = x;
    let yT = y;

    // check if the mouse is closer to any of the four sides of the image.
    if (xD < threshold) {
        // if the mouse is closer to the left or right side, shift the origin to the left or right side.
        xT = x < w / 2 ? 0 : w;
    }
    if (yD < threshold) {
        // if the mouse is closer to the top or bottom side, shift the origin to the top or bottom side.
        yT = y < h / 2 ? 0 : h;
    }

    // apply the transform origin.
    ele.style.transformOrigin = `${xT}px ${yT}px`;

    // For debudding purpose. Draw a circle at the transform origin.

    let circle = document.querySelector('.circle');
    if (!circle) {
        circle = document.createElement('div');
        circle.classList.add('circle');
        // Define styles for the circle.
        circle.style.borderRadius = '50%';
        circle.style.width = '10px';
        circle.style.height = '10px';
        circle.style.position = 'absolute';
        circle.style.zIndex = '1000';
        circle.style.pointerEvents = 'none';
        circle.style.backgroundColor = 'red';
    }
    circle.style.left = `${xT}px`;
    circle.style.top = `${yT}px`;

    // Add the circle to parent of the image but before that positin the parent relative.
    ele.parentElement.style.position = 'relative';
    ele.parentElement.appendChild(circle);

    
}

function createImage(obj) {
    let img = document.createElement("img");
    img.src = obj.url;
    img.setAttribute('data-src', obj.url);
    if (noImage) {
        img.src = `../assets/placeholders/graph.jpg`;
    }

    // img.setAttribute('person', obj.person)
    // img.setAttribute('loading', 'lazy');
    img.setAttribute('page', obj.page);
    img.classList.add('img-item');
    let imgCont = document.createElement('div');
    imgCont.classList.add('img-cont');
    imgCont.appendChild(img);
    imgCont.setAttribute('page', obj.page);
    // let temp = document.querySelector('template');
    // let clone = temp.content.cloneNode(true);
    // imgCont.appendChild(clone);

    return imgCont;
}



function goBack() {
    if (g_currentView == 'image') {
        renderPageView()
    }
    else {
        renderMainView()
    }
}


function next() {
    if (g_currentView == 'page') {
        let pages = g_pages;
        if (g_navPages.length > 0) {
            pages = g_navPages;
        }
        let currentIndex = pages.indexOf(g_currentPage);
        let nextIndex = currentIndex + 1;
        let nextPage = pages[nextIndex];
        console.log(g_currentPage, currentIndex, nextIndex, nextPage)
        renderPageView(nextPage)
    }
    else if (g_currentView == 'image') {
        g_currentSl += 1;
        renderImageView()
    }
}

function prev() {
    if (g_currentView == 'page') {
        let pages = g_pages;
        if (g_navPages.length > 0) {
            pages = g_navPages;
        }
        let currentIndex = pages.indexOf(g_currentPage);
        let nextIndex = currentIndex - 1;
        let nextPage = pages[nextIndex];
        console.log(g_currentPage, currentIndex, nextIndex, nextPage)
        renderPageView(nextPage)
    }
    else if (g_currentView == 'image') {
        g_currentSl -= 1;
        renderImageView()
    }
}

function spin() {
    navReset()
    if (g_currentView == 'page') {
        renderPageView(g_pages.random())
    }
    else if (g_currentView == 'image') {
        let page = g_pages.random()
        g_currentPage = page
        g_pageBuffer = g_jsonIndex.filter(item => {
            return item.page == page
        })
        let sl = Math.floor(g_pageBuffer.length * Math.random())
        console.log(page, sl)
        g_currentSl = sl
        renderImageView()
    }

    // navReset(page);
}


function showCurrentPage() {
    closeImageView()
}


function sideOpen() {
    let side = document.querySelector('.side')
    let sideToggleControl = document.querySelector('.side-toggle')
    let adjusts = []
    adjusts.push(document.querySelector('.page'))
    adjusts.push(...document.querySelectorAll('.prev'))
    adjusts.forEach(item => {
        item.style.marginLeft = '225px';
    });
    sideToggleControl.classList.add('active')
    side.style.display = 'block'
    navReset()
}

function sideClose() {
    let side = document.querySelector('.side')
    let sideToggleControl = document.querySelector('.side-toggle')
    side.style.display = 'none'
    sideToggleControl.classList.remove('active')
    let adjusts = []
    adjusts.push(document.querySelector('.page'))
    adjusts.push(...document.querySelectorAll('.prev'))
    adjusts.forEach(item => {
        item.style.marginLeft = '0px';
    })
}


function sideToggle() {
    g_sideNavActive = !g_sideNavActive;
    if (g_sideNavActive) {
        sideOpen()
    }
    else {
        sideClose()
    }
}

function createNavItems(val = '') {
    g_navPages = g_pages.filter(item => {
        return item.includes(val)
    })
    let navItems = document.querySelector('.nav-items');
    navItems.innerHTML = "";
    g_navPages.forEach(function (item, i) {
        let navItem = document.createElement('div');
        navItem.classList.add('nav-item');
        navItem.innerHTML += `<p>${item}</p>`;
        // p.innerText += " [" + g_navObject[item].length + "]";
        if (g_likes[item][0])
            navItem.innerHTML += `<i class="material-icons fav">favorite</i>`
        else {
            navItem.innerHTML += `<i class="material-icons fav"></i>`
        }
        // navItem.setAttribute('page', item);
        navItem.classList.add('pointer')
        navItem.addEventListener('click', e => {
            renderPageView(item)
        })
        navItems.appendChild(navItem);
    })
}




function navSelect() {
    let navCont = document.querySelector('.nav-items')
    let page = g_currentPage;
    let selected = navCont.querySelector('.nav-select');
    if (selected) {
        selected.classList.remove('nav-select')
    }
    let sl = g_navPages.indexOf(page);
    console.log(sl)
    let navItem = navCont.querySelectorAll('.nav-item')[sl];
    navItem.classList.add('nav-select');
    navItem.scrollIntoView({ behavior: "smooth", block: "center" });
}

function navReset() {
    document.querySelector('#page-search').value = "";
    document.querySelector('.search-icon').innerHTML = 'search';
    createNavItems()
}

function zoom(value) {
    if (g_currentView == 'main') {
        if (value == 1) {
            if (g_mainCols < 7) {
                g_mainCols++;
            }
        }
        else {
            if (g_mainCols > 1) {
                g_mainCols--;
            }
        }
        renderMainView()
    }
    if (g_currentView == 'page') {
        if (value == 1) {
            if (g_pageCols < 7) {
                g_pageCols++;
            }
        }
        else {
            if (g_pageCols > 1) {
                g_pageCols--;
            }
        }
        renderPageView()
    }
    if (g_currentView == 'image') {
        if (value == 1) {
            g_imgZoomFactor -= 0.1;
        }
        else {
            g_imgZoomFactor += 0.1;
        }
        renderImageView()
    }
}


function pageLike(ele, val) {
    let page = g_currentPage;
    val = parseInt(val);

    let likes = g_likes[page][0];
    likes += val;
    g_likes[page][0] = likes;
    ele.parentElement.querySelector('.page-like-count').innerText = likes;
    setLikes()
}

function imageLike(favicon) {
    let page = g_currentPage
    let sl = g_currentSl
    let pos = g_likes[page].indexOf(sl);
    if (pos > 0) {
        g_likes[page].pop(pos)
        favicon.innerHTML = 'favorite_border'

    }
    else {
        g_likes[page].push(sl)
        favicon.innerHTML = 'favorite'

    }
    setLikes()
    console.log(g_likes[page])
}
function setLikes() {
    localStorage.setItem('likes', JSON.stringify(g_likes))
}






