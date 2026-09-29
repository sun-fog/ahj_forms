// src/popover.js

export class Popover {
  constructor(trigger) {
    this.trigger = trigger;
    // Берем данные из data-атрибутов кнопки
    this.title = trigger.getAttribute('data-title') || '';
    this.content = trigger.getAttribute('data-content') || '';
    
    this.popoverEl = null;
    this.isVisible = false;
  }

  /**
   * Создает HTML-разметку попапа, если она еще не создана
   */
  createPopover() {
    const popover = document.createElement('div');
    popover.className = 'popover';

    // Стрелка (треугольник)
    const arrow = document.createElement('div');
    arrow.className = 'popover-arrow';
    popover.appendChild(arrow);

    // Заголовок
    const title = document.createElement('h3');
    title.className = 'popover-header';
    title.textContent = this.title;
    popover.appendChild(title);

    // Контент
    const body = document.createElement('div');
    body.className = 'popover-body';
    body.textContent = this.content;
    popover.appendChild(body);

    this.popoverEl = popover;
  }

  show() {
    if (this.isVisible) return;

    // 1. Создаем элемент, если его нет
    if (!this.popoverEl) {
      this.createPopover();
    }

    // Добавляем в DOM (в body), чтобы он не зависел от потока документа
    document.body.appendChild(this.popoverEl);

    // 2. ВАЖНО: Сначала делаем видимым (display: block), чтобы браузер просчитал реальные размеры
    this.popoverEl.style.display = 'block';
    
    // Принудительный Reflow: заставляем браузер пересчитать макет прямо сейчас.
    // Без этой строки popoverRect.width и height будут равны 0.
    // Читаем любое свойство, вызывающее перерисовку
    this.popoverEl.offsetHeight; 

    const triggerRect = this.trigger.getBoundingClientRect();
    const popoverRect = this.popoverEl.getBoundingClientRect();

    const offset = 12; // Отступ между кнопкой и попапом

    // 3. Расчет позиции: СТРОГО СВЕРХУ
    // Top = верх кнопки минус высота попапа минус отступ
    let top = triggerRect.top - popoverRect.height - offset;
    
    // Left = центр кнопки (левый край + половина ширины) минус половина ширины попапа
    let left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);

    // 4. ЗАЩИТА ОТ ВЫЛЕТА ЗА ЛЕВЫЙ/ПРАВЫЙ КРАЙ
    const maxRight = window.innerWidth - popoverRect.width;
    if (left > maxRight) {
      left = maxRight;
    }
    if (left < 0) {
      left = 0;
    }

    // 5. ЗАЩИТА ОТ ВЫЛЕТА ЗА ВЕРХ
    // Если top < 0 (улетел выше экрана), прижимаем к 0, но НЕ меняем сторону на "снизу"
    if (top < 0) {
      top = 0;
    }

    // 6. Применяем стили (ИСПРАВЛЕНО: \${top}, а не \${top})
    this.popoverEl.style.top = `\${top}px`;
    this.popoverEl.style.left = `\${left}px`;

    // Добавляем класс для анимации и видимости
    this.popoverEl.classList.add('active');
    this.isVisible = true;
  }

  hide() {
    if (!this.isVisible || !this.popoverEl) return;
    
    // ОПТИМИЗАЦИЯ: Не удаляем элемент из DOM, а просто скрываем его.
    // Это позволяет сохранить состояние и ускорить повторное открытие.
    this.popoverEl.classList.remove('active');
    this.popoverEl.style.display = 'none';
    
    this.isVisible = false;
    // НЕ делаем this.popoverEl = null, чтобы сохранить ссылку на элемент
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
}
