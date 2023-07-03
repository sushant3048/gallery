// This fetches all images form a diretory displayed as a html page
let pattern = /IDLE[\w\/]+.jpg/g
t = url.split('/')
console.log(t.pop())
console.log(t)
url = t.join('/')
fetch(url)
    .then(response => response.text())
    .then(data => {
        // const array = [...data.matchAll(pattern)];
        t = Array.from(data.matchAll(pattern), (m) => m[0]);
        // console.log(t)
        t.forEach(function (item, i) {
            modalContent.innerHTML +=
                `<div class="slides">    
                    <div class="numbertext">${i} / ${t.length}</div> 
                    <img src="${imageServer + item}" style="width:100%"></div>`
        })
        openModal();
    }


    )
    .catch(error => console.error(error));

slides = document.querySelectorAll(".slides");