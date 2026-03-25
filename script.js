// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = themeToggle.querySelector('.sun');
const moonIcon = themeToggle.querySelector('.moon');

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Switch icons
    sunIcon.style.display = newTheme === 'light' ? 'none' : 'block';
    moonIcon.style.display = newTheme === 'light' ? 'block' : 'none';
});

// Language Toggle
const langToggle = document.getElementById('lang-toggle');
let currentLang = 'vi';

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'vi' ? 'en' : 'vi';
    langToggle.innerText = currentLang === 'vi' ? 'EN' : 'VI';
    
    document.querySelectorAll('[data-vi]').forEach(el => {
        el.innerText = el.getAttribute(`data-${currentLang}`);
    });

    // Handle placeholders
    document.querySelectorAll('[data-vi-placeholder]').forEach(el => {
        el.placeholder = el.getAttribute(`data-${currentLang}-placeholder`);
    });
});

// Scroll Reveal Logic
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// Initial Theme Selection
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
sunIcon.style.display = savedTheme === 'light' ? 'none' : 'block';
moonIcon.style.display = savedTheme === 'light' ? 'block' : 'none';

// Slider Logic
const sliderContainer = document.querySelector('.slider-container');
const sliderWrapper = document.querySelector('.slider-wrapper');
const sliderImgs = document.querySelectorAll('.slider-img');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dots = document.querySelectorAll('.dot');

let currentIdx = 0;
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

function showSlide(idx) {
    currentIdx = idx;
    prevTranslate = currentIdx * -sliderContainer.offsetWidth;
    currentTranslate = prevTranslate;
    setSliderPosition();
    updateDots();
}

function updateDots() {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIdx);
    });
}

function setSliderPosition() {
    sliderWrapper.style.transform = `translateX(${currentTranslate}px)`;
}

// Mouse/Touch Events
sliderContainer.addEventListener('mousedown', dragStart);
sliderContainer.addEventListener('touchstart', dragStart);
sliderContainer.addEventListener('mouseup', dragEnd);
sliderContainer.addEventListener('touchend', dragEnd);
sliderContainer.addEventListener('mouseleave', dragEnd);
sliderContainer.addEventListener('mousemove', dragMove);
sliderContainer.addEventListener('touchmove', dragMove);

function dragStart(e) {
    isDragging = true;
    startX = getPositionX(e);
    sliderWrapper.style.transition = 'none'; // Disable transition during drag
    animationID = requestAnimationFrame(animation);
}

function dragMove(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    currentTranslate = prevTranslate + currentX - startX;
}

function dragEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    sliderWrapper.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIdx < sliderImgs.length - 1) currentIdx += 1;
    if (movedBy > 100 && currentIdx > 0) currentIdx -= 1;

    showSlide(currentIdx);
}

function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
}

// Button controls
nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentIdx < sliderImgs.length - 1) showSlide(currentIdx + 1);
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentIdx > 0) showSlide(currentIdx - 1);
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(index);
    });
});

// Windows resize update
window.addEventListener('resize', () => showSlide(currentIdx));

// Initialize
showSlide(0);
