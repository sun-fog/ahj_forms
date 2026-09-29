import './style.css';
import { Popover } from './popover.js';

document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('.popover-trigger');
  const popovers = [];

  triggers.forEach((trigger) => {
    const popover = new Popover(trigger);
    popovers.push(popover);

    trigger.addEventListener('click', (e) => {
      e.stopPropagation(); // Защита от всплытия
      
      // Сначала закрываем все остальные
      popovers.forEach((p) => {
        if (p !== popover) p.hide();
      });
      
      // Потом переключаем текущий
      popover.toggle();
    });
  });

  // Глобальное закрытие при клике вне
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.popover') && !e.target.closest('.popover-trigger')) {
      popovers.forEach(p => p.hide());
    }
  });
});
