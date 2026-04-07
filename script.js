let food = 0;
let sleep = 0;
let happy = 0;
let score = 0;
let seconds = 0;
let gameActive = false;
let selectedHero = "";
let gameTimer, lifeTimer;

// 1. Функція вибору героя
function selectHero(heroName) {
    selectedHero = heroName;
    // Встановлюємо початкове звичайне зображення
    document.getElementById("photo").src = `images/${heroName}_звичайний.png`;
    // Ховаємо екран вибору
    document.getElementById("selection-screen").classList.add("hidden");
}

// 2. Оновлення всього інтерфейсу
function updateUI() {
    // Оновлюємо рахунок монет
    document.getElementById("rez").innerText = "💰 " + score;
    
    // Оновлюємо смужки
    updateBar("food-bar", food);
    updateBar("sleep-bar", sleep);
    updateBar("happy-bar", happy);
    
    // Перевіряємо, які кнопки можна розблокувати
    updateButtons();
}

// 3. Логіка роботи смужок (колір та ширина)
function updateBar(id, value) {
    const bar = document.getElementById(id);
    bar.style.width = value + "%";
    
    // Зміна кольору від зеленого до червоного
    if (value > 60) bar.style.background = "#4caf50"; // Зелений
    else if (value > 30) bar.style.background = "#ff9800"; // Помаранчевий
    else bar.style.background = "#f44336"; // Червоний
}

// 4. Логіка блокування кнопок товарів
function updateButtons() {
    if (!gameActive) return; // Якщо гра не йде, кнопки не чіпаємо

    // Товари за 5 монет
    const items5 = ["apple", "pillow", "ball"];
    items5.forEach(id => {
        const el = document.getElementById(id);
        if (score >= 5) el.classList.remove("locked");
        else el.classList.add("locked");
    });

    // Товари за 15 монет
    const items15 = ["burger", "bed", "joystick"];
    items15.forEach(id => {
        const el = document.getElementById(id);
        if (score >= 15) el.classList.remove("locked");
        else el.classList.add("locked");
    });
}

// 5. Клікер по тамагочі
function clicker() {
    if (gameActive) {
        score++;
        updateUI();
    }
}

// 6. Функції догляду (їжа, сон, розваги)
function eat1() { if (score >= 5 && food < 100) { score -= 5; food += 5; updateUI(); } }
function eat2() { if (score >= 15 && food <= 75) { score -= 15; food += 25; updateUI(); } }
function sleep1() { if (score >= 5 && sleep < 100) { score -= 5; sleep += 5; updateUI(); } }
function sleep2() { if (score >= 15 && sleep <= 75) { score -= 15; sleep += 25; updateUI(); } }
function play1() { if (score >= 5 && happy < 100) { score -= 5; happy += 5; updateUI(); } }
function play2() { if (score >= 15 && happy <= 75) { score -= 15; happy += 25; updateUI(); } }

// 7. Запуск гри
function startGame() {
    if (gameActive) return; // Запобігаємо повторному запуску (один клік)
    
    gameActive = true;
    food = 50; sleep = 50; happy = 50; // Початкові потреби
    
    // Розблоковуємо картинку та кнопки
    document.getElementById("photo").classList.remove("locked");
    
    // Робимо кнопку старту неактивною
    const startBtn = document.getElementById("start-btn");
    startBtn.disabled = true; 
    startBtn.style.opacity = "0.5";
    startBtn.innerText = "ГРА ЙДЕ...";

    updateUI();
    
    // Запускаємо таймери
    lifeTimer = setInterval(life, 1000); // Зменшення потреб щосекунди
    gameTimer = setInterval(updateTime, 1000); // Рахунок часу життя
}

// 8. Оновлення таймера життя
function updateTime() {
    seconds++;
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    // Форматуємо час як 00:00
    document.getElementById("timer").innerText = `❤️ ${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
}

// 9. Основний цикл життя (зменшення потреб)
function life() {
    if (food > 0) food--;
    if (sleep > 0) sleep--;
    if (happy > 0) happy--;
    
    updateUI();
    updateImage(); // Перевіряємо, яку емоцію показати

    // Перевірка на смерть
    if (food <= 0 || sleep <= 0 || happy <= 0) {
        endGame();
    }
}

// 10. Зміна емоції залежно від потреб
function updateImage() {
    if (!gameActive) return;
    
    let state = "звичайний";
    // Пріоритет емоцій: голод -> сон -> розваги -> щастя
    if (food < 20) state = "голодний";
    else if (sleep < 20) state = "хочеСпати";
    else if (happy < 20) state = "хочеРозваг";
    else if (food > 80 && sleep > 80 && happy > 80) state = "щасливий";
    
    // Формуємо шлях до картинки: images/ІМ'Я_емоція.png
    document.getElementById("photo").src = `images/${selectedHero}_${state}.png`;
}

// 11. Кінець гри
function endGame() {
    gameActive = false;
    clearInterval(lifeTimer);
    clearInterval(gameTimer);
    
    // Ефект розмиття фону
    document.body.classList.add("die");
    
    // Вивід фінального рахунку
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    document.getElementById("final-score").innerText = `Твій герой прожив: ${m} хв. ${s} сек.`;
    
    // Показуємо вікно Game Over
    document.getElementById("game-over").classList.remove("hidden");
}