// Переключение темы
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const theme = document.documentElement;
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = theme.getAttribute('data-theme') === 'dark';
            theme.setAttribute('data-theme', isDark ? 'light' : 'dark');
            themeToggle.textContent = isDark ? '🌙 Тёмная' : '☀️ Светлая';
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });
        
        // Загружаем сохраненную тему
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            theme.setAttribute('data-theme', savedTheme);
            themeToggle.textContent = savedTheme === 'dark' ? '☀️ Светлая' : '🌙 Тёмная';
        }
    }
}

// Мобильное меню с оверлеем
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        // Создаем оверлей для затемнения фона
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);

        menuToggle.addEventListener('click', () => {
            const isOpening = !menuToggle.classList.contains('active');
            
            if (isOpening) {
                // Сохраняем позицию скролла перед открытием меню
                const scrollY = window.scrollY;
                document.body.style.top = `-${scrollY}px`;
                document.body.classList.add('menu-open');
                
                // Даем время для применения стилей
                setTimeout(() => {
                    menuToggle.classList.add('active');
                    navLinks.classList.add('active');
                    overlay.classList.add('active');
                }, 10);
            } else {
                closeMobileMenu();
            }
        });

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Закрытие меню при клике на оверлей
        overlay.addEventListener('click', () => {
            closeMobileMenu();
        });

        // Закрытие меню при изменении размера окна
        window.addEventListener('resize', () => {
            if (window.innerWidth > 968 && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Функция закрытия меню
        function closeMobileMenu() {
            // Восстанавливаем позицию скролла
            const scrollY = document.body.style.top;
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.top = '';
            
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        // Закрытие меню при нажатии Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
}

// Подсветка активной страницы в навигации
function setActiveNavLink() {
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    const fileName = currentLocation.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (fileName === linkHref) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Плавная прокрутка для якорей
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Анимации при прокрутке
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за карточками контента
    document.querySelectorAll('.content-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Инициализация всех функций при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initMobileMenu();
    setActiveNavLink(); // ДОБАВЛЕНО ВЫЗОВ ФУНКЦИИ
    initSmoothScroll();
    initScrollAnimations();
    
    // Добавляем год в футер
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Дополнительные утилиты
const NetworkUtils = {
    // Симуляция загрузки данных
    simulateLoad: function(delay = 1000) {
        return new Promise(resolve => setTimeout(resolve, delay));
    },
    
    // Форматирование размера данных
    formatBytes: function(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    
    // Генерация случайного IP
    generateRandomIP: function() {
        return Array.from({length: 4}, () => Math.floor(Math.random() * 256)).join('.');
    }
};