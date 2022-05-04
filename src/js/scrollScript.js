var scrollBtn = document.getElementById('scroll-btn');

window.onscroll = function () {
    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
        scrollBtn.style.display = 'block';
    } else {
        scrollBtn.style.display = 'none';
    }
}

scrollBtn.onclick = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}