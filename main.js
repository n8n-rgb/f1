import { ImageSequence } from './sequence-player.js';

// Updated JS for the new layout
document.addEventListener('DOMContentLoaded', () => {

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const toggleIcon = themeToggle.querySelector('.toggle-icon');
    const html = document.documentElement;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        toggleIcon.textContent = theme === 'light' ? '☾' : '☀';
    }

    // Navigation Logic
    const chapterBtn = document.getElementById('chapter-btn');
    const chapterMenu = document.getElementById('chapter-menu');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Chapter Dropdown
    chapterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chapterMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!chapterMenu.contains(e.target) && e.target !== chapterBtn) {
            chapterMenu.classList.remove('active');
        }
    });

    // Mobile Menu
    hamburgerBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Toggle hamburger icon animation if needed
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // Initialize Hero Sequence
    const heroSequence = new ImageSequence({
        canvasId: 'hero-sequence',
        folderPath: 'assets/hero-sequence/ezgif-frame-',
        extension: '.jpg',
        frameCount: 36,
        framePadding: 3,
        fps: 10
    });

    // Initialize Secondary Hero Sequence
    const secondarySequence = new ImageSequence({
        canvasId: 'secondary-sequence',
        folderPath: 'assets/second-hero-sequence/ezgif-frame-',
        extension: '.jpg',
        frameCount: 30, // Assuming 30 frames based on directory listing
        framePadding: 3,
        fps: 20
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Count animation if it's a stat
                if (entry.target.classList.contains('stat-item')) {
                    const counter = entry.target.querySelector('.counter');
                    if (counter && !counter.dataset.animated) {
                        animateCounter(counter);
                    }
                }
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // Parallax
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroBg = document.querySelector('#hero-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });

    function animateCounter(el) {
        el.dataset.animated = "true";
        const target = +el.dataset.target;
        const duration = 1500;
        const start = 0;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            el.innerText = Math.floor(progress * (target - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.innerText = target;
            }
        }
        window.requestAnimationFrame(step);
    }
});
