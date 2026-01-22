// Защита от DevTools (F12) и контекстного меню
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
        return false;
    }
    
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

let downloadPath = ''; // Хранит путь к файлу
let isDownloading = false;

// Функция получает имя файла из version.txt
async function fetchLocalVersion() {
    try {
        // Добавляем Date.now(), чтобы браузер не кешировал старое имя файла
        const response = await fetch('ver/version.txt?t=' + Date.now());
        
        if (!response.ok) throw new Error('Файл version.txt не найден');
        
        const fileName = (await response.text()).trim();
        // Собираем полный путь: папка + имя файла
        downloadPath = 'ver/' + fileName;
        return downloadPath;
    } catch (e) {
        console.error('Ошибка при поиске файла:', e);
        return null;
    }
}

// Пытаемся получить имя файла сразу при загрузке страницы
fetchLocalVersion();

async function downloadMod(btn, version) {
    if (isDownloading) return;
    
    isDownloading = true;
    btn.classList.add('loading');
    
    // Если путь еще не получен, пробуем получить снова
    if (!downloadPath) {
        downloadPath = await fetchLocalVersion();
    }
    
    setTimeout(() => {
        if (downloadPath && version === '1.16.5') {
            // Создаем временную ссылку для принудительного скачивания
            const link = document.createElement('a');
            link.href = downloadPath;
            // Атрибут download подсказывает браузеру, что это скачивание
            link.setAttribute('download', ''); 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast(`Загрузка версии ${version} началась!`);
            
            setTimeout(() => {
                isDownloading = false;
                btn.classList.remove('loading');
            }, 1000);
        } else {
            showToast('Ошибка: файл не найден. Сообщите администратору.');
            isDownloading = false;
            btn.classList.remove('loading');
        }
    }, 600);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    
    if (toast && toastText) {
        toastText.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('download-btn-1165');
    if (downloadBtn) {
        downloadBtn.classList.remove('loading');
        isDownloading = false;
    }
});

// Скролл к верху
document.querySelectorAll('.logo').forEach(logo => {
    logo.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Анимации появления
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.animate').forEach(el => observer.observe(el));

// Плавный скролл по якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
