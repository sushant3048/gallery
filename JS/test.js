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