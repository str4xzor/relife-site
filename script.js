// Настройки статистики (можно менять)
const STATS_CONFIG = {
    // Онлайн: случайное число между minOnline и maxOnline
    online: {
        min: 3,
        max: 7
    },
    // Продано: случайное число между minSales и maxSales
    sales: {
        min: 16,
        max: 20
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обновляем статистику
    updateStats();

    // Обновляем онлайн каждые 30 секунд
    setInterval(updateStats, 30000);

    // Проверяем статус сервера
    checkServerStatus();

    // Обновляем статус сервера каждую минуту
    setInterval(checkServerStatus, 60000);

    // Копирование IP
    setupCopyButtons();

    // Инициализация FAQ
    initFAQ();
});

// Функция для обновления статистики
function updateStats() {
    // Генерируем случайный онлайн
    const onlineCount = Math.floor(Math.random() * (STATS_CONFIG.online.max - STATS_CONFIG.online.min + 1)) + STATS_CONFIG.online.min;

    // Генерируем случайное количество продаж
    const salesCount = Math.floor(Math.random() * (STATS_CONFIG.sales.max - STATS_CONFIG.sales.min + 1)) + STATS_CONFIG.sales.min;

    // Обновляем элементы на странице
    document.getElementById('online').textContent = onlineCount;
    document.getElementById('miniOnline').textContent = onlineCount;
    document.getElementById('footerOnline').textContent = onlineCount;

    // Форматируем число продаж с разделителями тысяч
    document.getElementById('sales').textContent = salesCount.toLocaleString();

    // Обновляем прогресс-бар онлайн (если есть)
    updateOnlineProgress(onlineCount);
}

// Обновление прогресс-бара онлайн
function updateOnlineProgress(online) {
    const maxOnline = 100;
    const progress = (online / maxOnline) * 100;

    // Можно добавить визуализацию заполнения
    const onlineElement = document.getElementById('online');
    if (onlineElement) {
        onlineElement.style.color = progress > 80 ? '#ff5555' :
                                   progress > 60 ? '#ffaa00' : '#00ff88';
    }
}

// Проверка статуса сервера
async function checkServerStatus() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const footerStatus = document.getElementById('footerStatus');

    try {
        // В реальном проекте здесь будет запрос к API сервера
        // Для демо - случайный статус с вероятностью 90% онлайн

        const isOnline = Math.random() > 0.1; // 90% шанс быть онлайн

        if (isOnline) {
            statusDot.className = 'status-dot online';
            statusText.textContent = 'СЕРВЕР ОНЛАЙН';
            footerStatus.textContent = 'Онлайн';
            footerStatus.style.color = '#00ff88';
        } else {
            statusDot.className = 'status-dot offline';
            statusText.textContent = 'СЕРВЕР ОФФЛАЙН';
            footerStatus.textContent = 'Оффлайн';
            footerStatus.style.color = '#ff5555';
        }
    } catch (error) {
        console.error('Ошибка проверки статуса:', error);
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'ОШИБКА ПРОВЕРКИ';
        footerStatus.textContent = 'Ошибка';
        footerStatus.style.color = '#ffaa00';
    }
}

// Копирование IP
function copyIP() {
    const ip = 'relife.play.ski';

    navigator.clipboard.writeText(ip)
        .then(() => showNotification('IP скопирован в буфер обмена!', 'success'))
        .catch(() => {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = ip;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('IP скопирован!', 'success');
        });
}

// Настройка кнопок копирования
function setupCopyButtons() {
    document.querySelectorAll('.copy-btn, .btn-small').forEach(button => {
        if (button.textContent.includes('Скопировать') || button.querySelector('.fa-copy')) {
            button.addEventListener('click', copyIP);
        }
    });
}

// Показать уведомление
function showNotification(message, type = 'success') {
    // Удаляем старые уведомления
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Модальное окно входа
function loginModal() {
    showNotification('Функция входа будет доступна скоро!', 'error');
}

// Открытие модального окна оплаты
function openPaymentModal(productName, price, count) {
    const modal = document.getElementById('paymentModal');
    const productInfo = document.getElementById('modalProductInfo');
    const selectedProduct = document.getElementById('selectedProduct');
    const selectedPrice = document.getElementById('selectedPrice');
    const selectedCount = document.getElementById('selectedCount');
    const additionalNicks = document.getElementById('additionalNicks');
    if (count > 1) {
        additionalNicks.style.display = 'block';

        // Показываем нужное количество полей
        if (count == 2) {
            document.getElementById('nickname3').parentElement.style.display = 'none';
        } else if (count == 3) {
            document.getElementById('nickname3').parentElement.style.display = 'block';
        }
    } else {
        additionalNicks.style.display = 'none';
    }

    // Заполняем информацию о товаре
    productInfo.innerHTML = `
        <div class="product-summary">
            <h3><i class="fas fa-ticket-alt"></i> ${productName}</h3>
            <p><i class="fas fa-users"></i> Количество проходок: <strong>${count}</strong></p>
            <p><i class="fas fa-wallet"></i> Сумма к оплате: <strong>${price} ₽</strong></p>
        </div>
    `;

    // Сохраняем данные
    selectedProduct.value = productName;
    selectedPrice.value = price;
    selectedCount.value = count;

    // Показываем дополнительные поля для ников
    if (count > 1) {
        additionalNicks.style.display = 'block';
    } else {
        additionalNicks.style.display = 'none';
    }

    // Сбрасываем форму
    document.getElementById('paymentForm').reset();

    // Показываем модальное окно
    modal.style.display = 'block';
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Обработка оплаты
function processPayment(event) {
    event.preventDefault();

    const nickname = document.getElementById('nickname').value;
    const email = document.getElementById('email').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const productName = document.getElementById('selectedProduct').value;
    const price = document.getElementById('selectedPrice').value;

    // Здесь будет интеграция с платежной системой
    // Для демо - показываем сообщение об успехе

    showNotification(`Заказ на ${productName} оформлен! На ${email} отправлены инструкции.`, 'success');

    // Закрываем модальное окно
    closeModal();

    // Обновляем статистику продаж (имитация)
    setTimeout(() => {
        updateStats();
    }, 1000);
}

// Инициализация FAQ
function initFAQ() {
    // Открываем первый вопрос
    const firstFaq = document.querySelector('.faq-item');
    if (firstFaq) {
        toggleFAQ(firstFaq);
    }
}

// Переключение FAQ
function toggleFAQ(element) {
    const isActive = element.classList.contains('active');

    // Закрываем все другие FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Открываем текущий, если он был закрыт
    if (!isActive) {
        element.classList.add('active');
    }
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('paymentModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Функция для ручного обновления статистики (может быть вызвана из консоли)
function refreshStats() {
    updateStats();
    showNotification('Статистика обновлена!', 'success');

}

