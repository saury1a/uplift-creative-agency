document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Video Mouse-Scrub Logic ---
    const video = document.getElementById('bg-video');
    const SENSITIVITY = 0.8;
    let targetTime = 0;
    let isSeeking = false;
    let seekQueued = false;

    // Ensure video metadata is loaded
    video.pause();
    
    video.addEventListener('loadedmetadata', () => {
        targetTime = video.currentTime;
    });

    window.addEventListener('mousemove', (e) => {
        if (!video.duration || isNaN(video.duration)) return;

        const clientX = e.clientX;
        const windowWidth = window.innerWidth;
        const ratio = clientX / windowWidth;
        
        // Compute movement delta based on normalized position and sensitivity
        const delta = (ratio - 0.5) * SENSITIVITY;
        targetTime = Math.min(Math.max(video.currentTime + (delta * 0.5), 0), video.duration);

        updateVideoSeek();
    });

    function updateVideoSeek() {
        if (isSeeking) {
            seekQueued = true;
            return;
        }

        if (Math.abs(video.currentTime - targetTime) > 0.03) {
            isSeeking = true;
            video.currentTime = targetTime;
        }
    }

    video.addEventListener('seeked', () => {
        isSeeking = false;
        if (seekQueued) {
            seekQueued = false;
            updateVideoSeek();
        }
    });

    // Fallback in case seeked doesn't fire cleanly
    video.addEventListener('error', () => {
        isSeeking = false;
    });


    // --- 2. Mobile Menu Toggle Logic ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        const isOpen = menuBtn.classList.toggle('open');
        if (isOpen) {
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = '';
        }
    }

    menuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuBtn.classList.contains('open')) {
                toggleMenu();
            }
        });
    });


    // --- 3. Typewriter Effect Logic ---
    const fullText = "Glad you stopped in. Good taste tends to find us. Now, what are we building?";
    const textContainer = document.getElementById('typewriter-text');
    const cursor = document.getElementById('cursor');
    const CHAR_DELAY = 38;
    const START_DELAY = 600;

    let charIndex = 0;

    setTimeout(() => {
        const interval = setInterval(() => {
            if (charIndex < fullText.length) {
                textContainer.textContent += fullText.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(interval);
                // Keep cursor blinking or stable when finished
            }
        }, CHAR_DELAY);
    }, START_DELAY);
});
