document.addEventListener('DOMContentLoaded', () => {
  renderBook();
  initPageFlip();
  startLoveTimer();
});

// 1. Генерация всех страниц книги из массива MEMORIES
function renderBook() {
  const bookContainer = document.getElementById('book');
  let html = '';

  // Передняя обложка
  html += `
    <div class="page page-cover" data-density="hard">
      <div class="cover-content">
        <h1>${BOOK_CONFIG.title}</h1>
        <p class="subtitle">${BOOK_CONFIG.subtitle}</p>
        <span class="hint">Потяни за уголок →</span>
      </div>
    </div>
  `;

  // Страницы из массива
  MEMORIES.forEach((item, index) => {
    const pageNum = index + 1;
    // Чередуем наклон фото влево и вправо для естественности
    const tiltAngle = index % 2 === 0 ? '-1.5deg' : '1.5deg';

    // Если фото указано — рендерим полароид, если нет — декоративный заголовок
    const mediaBlock = item.img
      ? `<div class="polaroid" style="transform: rotate(${tiltAngle});">
           <img src="${item.img}" alt="${item.caption}" loading="lazy">
           <span class="caption">${item.caption}</span>
         </div>`
      : `<h3 class="text-only-title">${item.caption}</h3>`;

    html += `
      <div class="page">
        <div class="page-content">
          ${item.date ? `<span class="memory-date">${item.date}</span>` : ''}
          ${mediaBlock}
          <p class="story-text">${item.text}</p>
          <span class="page-number">${pageNum}</span>
        </div>
      </div>
    `;
  });

  // Если страниц нечетное количество, добавим пустую форзац-страницу перед задней обложкой,
  // чтобы книга корректно закрывалась разворотом на ПК
  if (MEMORIES.length % 2 !== 0) {
    html += `
      <div class="page">
        <div class="page-content center-all">
          <p class="story-text" style="font-style: italic; opacity: 0.7;">
            Место для наших будущих фотографий...
          </p>
        </div>
      </div>
    `;
  }

  // Задняя обложка с таймером
  html += `
    <div class="page page-cover" data-density="hard">
      <div class="cover-content">
        <h2>Продолжение следует...</h2>
        <div id="love-timer" class="love-timer"></div>
        <p class="dev-sign" onclick="showEasterEgg()">${BOOK_CONFIG.authorSign}</p>
      </div>
    </div>
  `;

  bookContainer.innerHTML = html;
}

// 2. Инициализация физики перелистывания
function initPageFlip() {
  const pageFlip = new St.PageFlip(document.getElementById('book'), {
    width: 400,
    height: 550,
    size: 'stretch',
    minWidth: 280,
    maxWidth: 450,
    minHeight: 400,
    maxHeight: 600,
    maxShadowOpacity: 0.5,
    showCover: true,
    mobileScrollSupport: false
  });

  pageFlip.loadFromHTML(document.querySelectorAll('.page'));

  const flipSound = document.getElementById('flip-sound');
  pageFlip.on('flip', () => {
    if (flipSound) {
      flipSound.currentTime = 0;
      flipSound.play().catch(() => {});
    }
  });
}

// 3. Живой счетчик времени вместе на последней обложке
function startLoveTimer() {
  const timerEl = document.getElementById('love-timer');
  const startDate = new Date(BOOK_CONFIG.relationshipStart).getTime();

  setInterval(() => {
    const now = Date.now();
    const diff = now - startDate;
    if (diff < 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    timerEl.innerHTML = `Мы вместе уже:<br><strong>${days} дн. ${hours} ч. ${minutes} мин. ${seconds} сек.</strong>`;
  }, 1000);
}

// 4. Пароль и музыка
function unlockBook() {
  const input = document.getElementById('pass-input').value.trim();
  if (input === BOOK_CONFIG.secretDate) {
    document.getElementById('lock-screen').style.display = 'none';
    toggleMusic();
  } else {
    document.getElementById('error-msg').textContent = "Неверная дата, попробуй еще раз ❤️";
  }
}

function toggleMusic() {
  const music = document.getElementById('bg-music');
  const btn = document.getElementById('music-btn');
  if (music.paused) {
    music.play().then(() => { btn.textContent = "⏸ Пауза"; }).catch(() => {});
  } else {
    music.pause();
    btn.textContent = "🎵 Включить музыку";
  }
}

function showEasterEgg() {
  alert("System Status:\n• Love level: 100%\n• Memory leaks: 0\n• Happiness: Infinite");
}