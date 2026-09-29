import { Popover } from '../popover.js';

describe('Popover', () => {
  let trigger, popover;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="test-btn" class="popover-trigger"
        data-title="Test Title"
        data-content="Test Content"
      >
        Toggle
      </button>
    `;
    trigger = document.querySelector('#test-btn');
    popover = new Popover(trigger);
  });

  afterEach(() => {
    if (popover.popoverEl && popover.popoverEl.parentNode) {
      popover.popoverEl.remove();
    }
  });

  test('создает popover с заголовком и контентом', () => {
    popover.show();
    expect(popover.popoverEl).toBeInTheDocument();
    expect(popover.popoverEl.querySelector('.popover-header').textContent).toBe('Test Title');
    expect(popover.popoverEl.querySelector('.popover-body').textContent).toBe('Test Content');
  });

  test('позиционирует popover сверху и по центру', () => {
    popover.show();
    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.popoverEl.getBoundingClientRect();

    // проверка, что popover сверху
    expect(popoverRect.bottom).toBeLessThanOrEqual(triggerRect.top);

    // проверка центрирования (допуск 2px из-за округлений)
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    const popoverCenter = popoverRect.left + popoverRect.width / 2;
    expect(Math.abs(triggerCenter - popoverCenter)).toBeLessThanOrEqual(2);
  });

  test('hide удаляет popover из DOM', () => {
    popover.show();
    expect(popover.popoverEl).toBeInTheDocument();
    popover.hide();
    expect(popover.popoverEl).not.toBeInTheDocument();
  });
});
