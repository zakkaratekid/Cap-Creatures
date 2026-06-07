document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('page-loading');

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const topnav = document.querySelector('.topnav');
    const buttons = document.querySelectorAll('.view-button, .buy-button, .cta-button, .thingyverse-button');

    document.querySelectorAll('.topnav a').forEach(function (link) {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath || (linkHref === 'index.html' && currentPath === '')) {
            link.classList.add('active-link');
        }

        link.addEventListener('click', function () {
            link.classList.add('link-clicked');
            setTimeout(function () {
                window.location.href = linkHref;
            }, 150);
        });
    });

    const footerParagraph = document.querySelector('footer p');
    if (footerParagraph) {
        const year = new Date().getFullYear();
        footerParagraph.textContent = `© ${year} Cap Creatures`;
    }

    buttons.forEach(function (button) {
        button.addEventListener('focus', function () {
            button.classList.add('button-focus');
        });
        button.addEventListener('blur', function () {
            button.classList.remove('button-focus');
        });

        button.addEventListener('click', function (event) {
            rippleEffect(event);
        });
    });

    const savedTheme = localStorage.getItem('cap-creatures-theme');
    const isDarkMode = savedTheme === 'dark';
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.type = 'button';
    themeToggle.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';

    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = 'Light Mode';
            localStorage.setItem('cap-creatures-theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.textContent = 'Dark Mode';
            localStorage.setItem('cap-creatures-theme', 'light');
        }
    }

    if (topnav) {
        topnav.appendChild(themeToggle);
        themeToggle.addEventListener('click', function () {
            setTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark');
            showToast(`Switched to ${document.body.classList.contains('dark-mode') ? 'dark' : 'light'} mode`, 2200);
        });
    }

    setTheme(isDarkMode ? 'dark' : 'light');

    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.type = 'button';
    backToTop.hidden = true;
    backToTop.textContent = '↑ Top';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', function () {
        backToTop.hidden = window.scrollY < 250;
        parallaxHero();
    });

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    document.body.appendChild(toast);

    function showToast(message, duration = 3000) {
        toast.textContent = message;
        toast.classList.add('visible');
        clearTimeout(showToast.timeoutId);
        showToast.timeoutId = setTimeout(function () {
            toast.classList.remove('visible');
        }, duration);
    }

    const pageOverlay = document.createElement('div');
    pageOverlay.className = 'page-overlay';
    document.body.appendChild(pageOverlay);

    setTimeout(function () {
        pageOverlay.classList.add('page-overlay-hidden');
        document.body.classList.remove('page-loading');
        document.body.classList.add('page-loaded');
        setTimeout(function () {
            pageOverlay.remove();
        }, 800);
    }, 150);

    showToast('Welcome back to Cap Creatures! Press H/S/P/T for shortcuts.');

    document.addEventListener('keydown', function (event) {
        if (event.target.matches('input, textarea')) {
            return;
        }
        const key = event.key.toLowerCase();
        if (key === 'h') {
            window.location.href = 'index.html';
        } else if (key === 's') {
            window.location.href = 'shop.html';
        } else if (key === 'p') {
            window.location.href = 'products.html';
        } else if (key === '?') {
            showToast('Hotkeys: H=Home, S=Shop, P=Products, T=Theme');
        } else if (key === 't') {
            themeToggle.click();
        }
    });

    const productCards = Array.from(document.querySelectorAll('.product-card'));
    if (productCards.length > 0) {
        function highlightRandomCard() {
            productCards.forEach(function (card) {
                card.classList.remove('highlighted-card');
            });
            const randomIndex = Math.floor(Math.random() * productCards.length);
            const card = productCards[randomIndex];
            card.classList.add('highlighted-card');
        }
        highlightRandomCard();
        setInterval(highlightRandomCard, 8000);
    }

    const quizForm = document.getElementById('creature-quiz');
    const quizResultEl = document.getElementById('quiz-result');
    const quizTitle = document.getElementById('quiz-result-title');
    const quizImage = document.getElementById('quiz-result-image');
    const quizCopy = document.getElementById('quiz-result-copy');
    const quizRetake = document.getElementById('quiz-retake');
    const progressBar = document.getElementById('quiz-progress-bar');
    const progressLabel = document.getElementById('quiz-progress-label');

    const creatureProfiles = {
        snake: {
            title: 'Snake Cap Creature',
            image: 'ChatGPT Image Jun 7, 2026, 12_26_17 AM.png',
            description: 'You are clever, calm, and stylish. The Snake creature is perfect for a sleek and bold cap statement.',
        },
        frog: {
            title: 'Frog Cap Creature',
            image: 'ChatGPT Image Jun 7, 2026, 02_36_31 PM.png',
            description: 'You are playful, friendly, and full of energy. The Frog creature fits your fun and adventurous style.',
        },
        crocodile: {
            title: 'Crocodile Cap Creature',
            image: 'ChatGPT Image Jun 7, 2026, 02_34_59 PM.png',
            description: 'You are confident, strong, and ready to lead. The Crocodile creature brings fierce character to your cap.',
        },
    };

    function updateQuizProgress() {
        const answered = Array.from(quizForm.querySelectorAll('input[type=radio]:checked')).length;
        const total = 4;
        progressBar.style.width = `${(answered / total) * 100}%`;
        progressLabel.textContent = `${answered} / ${total} answered`;
    }

    if (quizForm) {
        quizForm.addEventListener('change', updateQuizProgress);
        updateQuizProgress();

        quizForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const selections = Array.from(quizForm.querySelectorAll('input[type=radio]:checked')).map(function (input) {
                return input.value;
            });
            if (selections.length < 4) {
                showToast('Please answer every question to reveal your creature.');
                return;
            }

            const score = selections.reduce(function (acc, value) {
                acc[value] = (acc[value] || 0) + 1;
                return acc;
            }, { snake: 0, frog: 0, crocodile: 0 });

            let winner = 'snake';
            Object.keys(score).forEach(function (key) {
                if (score[key] > score[winner]) {
                    winner = key;
                }
            });

            const profile = creatureProfiles[winner];
            quizTitle.textContent = profile.title;
            quizImage.src = profile.image;
            quizImage.alt = `${profile.title} image`;
            quizCopy.textContent = profile.description;
            quizForm.hidden = true;
            quizResultEl.hidden = false;
            quizResultEl.classList.add('quiz-result-active');
            quizResultEl.scrollIntoView({ behavior: 'smooth' });
            showToast(`You're a ${profile.title}!`);
        });

        quizRetake.addEventListener('click', function () {
            quizForm.reset();
            updateQuizProgress();
            quizForm.hidden = false;
            quizResultEl.hidden = true;
            quizResultEl.classList.remove('quiz-result-active');
            showToast('Ready for another round?');
        });
    }

    const heroImage = document.querySelector('.hero-image');
    function parallaxHero() {
        if (!heroImage) return;
        const offset = window.scrollY * 0.04;
        heroImage.style.transform = `translateY(${offset}px) scale(1.01)`;
    }

    document.querySelectorAll('.product-card').forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            card.classList.add('card-hover');
        });
        card.addEventListener('mouseleave', function () {
            card.classList.remove('card-hover');
        });
    });

    const revealElements = document.querySelectorAll('.hero, .hero-alt, .card, .product-card, .cards-grid, .hero-image');
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(function (el) {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    const greetingElement = document.querySelector('.hero-content h1, .hero-alt h1');
    if (greetingElement) {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
        greetingElement.textContent = `${greeting}, ${greetingElement.textContent}`;
    }

    function rippleEffect(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
        button.appendChild(ripple);
        setTimeout(function () {
            ripple.remove();
        }, 600);
    }
});
