function createNav() {
    sideNav = document.querySelector('.side-nav')
    g_pages.forEach(function (item, i) {
        p = document.createElement('p')
        p.classList.add('nav-item')
        p.innerHTML = item
        p.setAttribute('data', item)
        p.addEventListener('click', function (e) {
            page = e.currentTarget.getAttribute('data')
            showPage(page)
        })
        sideNav.appendChild(p)
    })
}




    // imgItem to pan on mouse drag.
    // let dragStartX = 0;
    // let dragStartY = 0;
    // let posX = 0;
    // let posY = 0;
    // let dragging = false;

    




    // imgItem.onmousedown = function (event) {
    //     console.log('mouse down');
    //     shiftOrigin(imgItem, event);
    //     // console.log(event)
    //     dragStartX = event.clientX;
    //     dragStartY = event.clientY;
    // }




    // on mouse move shift the transform origin to the mouse position.
    // imgItem.onmousemove = function (event) {
        
    //     if (scale == 1) {
    //         shiftOrigin(imgItem, event);
    //     }
    //     if (event.buttons == 1) {

    //         // console.log(event)
    //         let x = event.clientX;
    //         let y = event.clientY;
    //         let dx = x - dragStartX;
    //         let dy = y - dragStartY;
    //         console.log('drags:', dx, dy);
    //         posX += Math.floor(dx);
    //         posY += Math.floor(dy);
    //         dragStartX = x;
    //         dragStartY = y;

    //         imgItem.style.transform = `translate(${posX}px,${posY}px) scale(${scale})`;
    //         let cont = imgItem.parentElement;
    //         let hor = imgItem.getBoundingClientRect().left - cont.getBoundingClientRect().left;
    //         let ver = imgItem.getBoundingClientRect().top - cont.getBoundingClientRect().top;
    //         logParams();
    //     }

    // }

    // function logParams() {
    //     // Get imgItem sizes    
    //     let w = imgItem.offsetWidth;
    //     let h = imgItem.offsetHeight;

    //     //    Get imageItem trasnforms  
    //     let transform = imgItem.style.transform;

    //     console.log('transform', transform)
    //     console.log('sizes:', w, h)
    // }

    // onmouseleave shift the transform origin to the edge where the mouse left. This improves the panning experience when the mouse leaves the image quickly.
    // imgItem.onmouseleave = function (event) {
    //     console.log('mouse leave');
    //     handleMouseLeave(imgItem, event);
    // }

    // zoom on mouse wheel keeping the cursor in the same place.
    // imgItem.onwheel = function (event) {
    //     event.preventDefault();
    //     scale += event.deltaY * -0.01;
    //     scale = Math.min(Math.max(1, scale), 10);
    //     shiftOrigin(imgItem, event);
    //     imgItem.style.transform = `translate(${posX}px,${posY}px) scale(${scale})`;
    //     logParams();
    // }

    // Handle mouseLeave event.
    // function handleMouseLeave(ele, event) {
    //     // shift the origin to the edge towards which the mouse left.

    // }

    // zoom toggle on double click.
    // imgItem.ondblclick = function (event) {
    //     if (scale > 1) {
    //         scale = 1;
    //     }
    //     else {
    //         scale = 5;
    //     }
    //     shiftOrigin(imgItem, event);
    //     imgItem.style.transform = `scale(${scale})`;
    // }


    // g_imageView.querySelector('.page-name').innerHTML = g_currentPage;
    // g_imageView.querySelector('.image-sl').innerHTML = `${sl + 1} / ${g_pageBuffer.length}`
    // g_pageView.querySelector('.page-name').innerHTML = page;

    // if (g_sideNavActive) {
    //     setTimeout(navSelect, 0);
    // }



    // function shiftOrigin(ele, event) {

    //     // This method will shift the transform origin to the mouse position. But if any of the four sides of the image is closer than threshold, it will shift the origin to that side.

    //     // define the threshold as fraction.
    //     let threshold = 0.10;

    //     // get the mouse position relative to the image.
    //     let x = event.offsetX;
    //     let y = event.offsetY;

    //     // get the image dimensions.
    //     let w = ele.offsetWidth;
    //     let h = ele.offsetHeight;

    //     // get the mouse position relative to the image as a percentage.
    //     let xP = x / w;
    //     let yP = y / h;

    //     // get the distance of the mouse from the four sides of the image.
    //     let xD = Math.min(xP, 1 - xP);
    //     let yD = Math.min(yP, 1 - yP);

    //     // define transform origin to be the mouse position as percentage.
    //     let xT = x;
    //     let yT = y;

    //     // check if the mouse is closer to any of the four sides of the image.
    //     if (xD < threshold) {
    //         // if the mouse is closer to the left or right side, shift the origin to the left or right side.
    //         xT = x < w / 2 ? 0 : w;
    //     }
    //     if (yD < threshold) {
    //         // if the mouse is closer to the top or bottom side, shift the origin to the top or bottom side.
    //         yT = y < h / 2 ? 0 : h;
    //     }

    //     // console.log(xT, yT);
    //     // apply the transform origin.
    //     ele.style.transformOrigin = `${xT}px ${yT}px`;

    //     // For debudding purpose. Draw a circle at the transform origin.

    //     let circle = document.querySelector('.circle');
    //     if (!circle) {
    //         circle = document.createElement('div');
    //         circle.classList.add('circle');
    //         // Define styles for the circle.
    //         circle.style.borderRadius = '50%';
    //         circle.style.width = '10px';
    //         circle.style.height = '10px';
    //         circle.style.position = 'absolute';
    //         circle.style.zIndex = '1000';
    //         circle.style.pointerEvents = 'none';
    //         circle.style.backgroundColor = 'red';
    //     }
    //     circle.style.left = `${xT + posX}px`;
    //     circle.style.top = `${yT + posY}px`;

    //     // Add the circle to parent of the image but before that positin the parent relative.
    //     ele.parentElement.style.position = 'relative';
    //     ele.parentElement.appendChild(circle);
    // }