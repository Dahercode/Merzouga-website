import { LitElement, html, css } from 'lit';

class DateRangePicker extends LitElement {
  static properties = {
    startDate: { type: String },
    endDate: { type: String },
    isOpen: { type: Boolean },
    currentMonth: { type: Number },
    currentYear: { type: Number },
    hoveredDate: { type: String },
    _isFocused: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .date-range-container {
      position: relative;
    }

    .date-range-input {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.75rem;
      border: 1px solid var(--form-field-border-color, #d0d0d0);
      border-radius: var(--form-field-border-radius, 0.6rem);
      background: color-mix(in srgb, var(--theme-surface-1, #ffffff) 12%, #ffffff);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }

    .date-range-input.focused {
      border-color: var(--theme-primary, #5b4cff);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-primary, #5b4cff) 14%, transparent);
    }

    .date-range-input svg {
      width: 20px;
      height: 20px;
      opacity: 0.7;
      color: color-mix(in srgb, var(--theme-on-surface-2, #4a4a4a) 85%, #7a7a7a);
    }

    .date-range-display {
      font-size: 0.95rem;
      color: var(--theme-on-surface-1, #1f1f1f);
    }

    .date-range-display.placeholder {
      color: color-mix(in srgb, var(--theme-on-surface-1, #1f1f1f) 48%, transparent);
    }

    .calendar-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      background: var(--theme-bg, #ffffff);
      border: 1px solid var(--theme-outline-variant, #d0d0d0);
      border-radius: var(--form-field-border-radius, 0.6rem);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      opacity: 0;
      transform: translateY(-10px);
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      min-width: 320px;
    }

    .calendar-dropdown.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid var(--theme-outline-variant, #d0d0d0);
    }

    .calendar-header button {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: background-color 0.2s ease;
      color: var(--theme-on-bg, #1f1f1f);
    }

    .calendar-header button:hover {
      background: color-mix(in srgb, var(--theme-primary, #5b4cff) 10%, transparent);
    }

    .calendar-month-year {
      font-weight: 600;
      font-size: 1rem;
      color: var(--theme-on-bg, #1f1f1f);
    }

    .calendar-grid {
      padding: 1rem;
    }

    .calendar-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .calendar-weekday {
      text-align: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: color-mix(in srgb, var(--theme-on-bg, #1f1f1f) 60%, transparent);
      padding: 0.5rem 0;
    }

    .calendar-days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.25rem;
    }

    .calendar-day {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.4rem;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.15s ease;
      border: 1px solid transparent;
      position: relative;
    }

    .calendar-day:not(.disabled):hover {
      background: color-mix(in srgb, var(--theme-primary, #5b4cff) 10%, transparent);
      border-color: var(--theme-primary, #5b4cff);
    }

    .calendar-day.disabled {
      color: color-mix(in srgb, var(--theme-on-bg, #1f1f1f) 30%, transparent);
      cursor: not-allowed;
    }

    .calendar-day.other-month {
      color: color-mix(in srgb, var(--theme-on-bg, #1f1f1f) 40%, transparent);
    }

    .calendar-day.selected {
      background: var(--theme-primary, #5b4cff);
      color: var(--theme-on-primary, #ffffff);
      font-weight: 600;
    }

    .calendar-day.in-range {
      background: color-mix(in srgb, var(--theme-primary, #5b4cff) 20%, transparent);
      border-radius: 0;
    }

    .calendar-day.range-start {
      border-radius: 0.4rem 0 0 0.4rem;
    }

    .calendar-day.range-end {
      border-radius: 0 0.4rem 0.4rem 0;
    }

    .calendar-day.range-start.range-end {
      border-radius: 0.4rem;
    }

    .calendar-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 1rem;
      border-top: 1px solid var(--theme-outline-variant, #d0d0d0);
    }

    .calendar-footer button {
      padding: 0.5rem 1rem;
      border-radius: 0.4rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .calendar-footer .btn-clear {
      background: transparent;
      color: var(--theme-on-bg, #1f1f1f);
    }

    .calendar-footer .btn-clear:hover {
      background: color-mix(in srgb, var(--theme-surface-2, #f5f5f5) 50%, transparent);
    }

    .calendar-footer .btn-apply {
      background: var(--theme-primary, #5b4cff);
      color: var(--theme-on-primary, #ffffff);
    }

    .calendar-footer .btn-apply:hover {
      background: color-mix(in srgb, var(--theme-primary, #5b4cff) 90%, #000);
    }
  `;

  constructor() {
    super();
    console.log('DateRangePicker constructor called');
    this.startDate = '';
    this.endDate = '';
    this.isOpen = false;
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.hoveredDate = '';
    this._isFocused = false;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('DateRangePicker connected to DOM');
    document.addEventListener('click', this._handleOutsideClick, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleOutsideClick, true);
  }

  _handleOutsideClick = (e) => {
    const path = e.composedPath();
    if (!path.includes(this)) {
      console.log('Outside click detected, closing calendar');
      this.isOpen = false;
      this._isFocused = false;
      this.requestUpdate();
    }
  };

  _toggleCalendar = (e) => {
    e.stopPropagation();
    console.log('Toggle calendar clicked, current isOpen:', this.isOpen);
    this.isOpen = !this.isOpen;
    this._isFocused = this.isOpen;
    console.log('New isOpen state:', this.isOpen);
    this.requestUpdate();
  };

  _prevMonth = () => {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  };

  _nextMonth = () => {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  };

  _selectDate = (dateStr) => {
    const clickedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Don't allow past dates
    if (clickedDate < today) return;

    if (!this.startDate || (this.startDate && this.endDate)) {
      // Start new selection
      this.startDate = dateStr;
      this.endDate = '';
    } else {
      // Select end date
      const start = new Date(this.startDate);
      if (clickedDate < start) {
        // If clicked date is before start, swap them
        this.endDate = this.startDate;
        this.startDate = dateStr;
      } else {
        this.endDate = dateStr;
      }
    }
    this._notifyChange();
  };

  _clearDates = () => {
    this.startDate = '';
    this.endDate = '';
    this._notifyChange();
  };

  _applyDates = () => {
    if (this.startDate && this.endDate) {
      this.isOpen = false;
      this._isFocused = false;
    }
  };

  _notifyChange() {
    this.dispatchEvent(
      new CustomEvent('date-change', {
        detail: {
          startDate: this.startDate,
          endDate: this.endDate,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  _getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  _getFirstDayOfMonth(month, year) {
    return new Date(year, month, 1).getDay();
  }

  _isDateInRange(dateStr) {
    if (!this.startDate || !this.endDate) return false;
    const date = new Date(dateStr);
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return date > start && date < end;
  }

  _isDateSelected(dateStr) {
    return dateStr === this.startDate || dateStr === this.endDate;
  }

  _getDateClasses(dateStr, day, isCurrentMonth) {
    const classes = ['calendar-day'];
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      classes.push('disabled');
    }

    if (!isCurrentMonth) {
      classes.push('other-month');
    }

    if (this._isDateSelected(dateStr)) {
      classes.push('selected');
      if (dateStr === this.startDate) classes.push('range-start');
      if (dateStr === this.endDate) classes.push('range-end');
    } else if (this._isDateInRange(dateStr)) {
      classes.push('in-range');
    }

    return classes.join(' ');
  }

  _renderCalendar() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const daysInMonth = this._getDaysInMonth(this.currentMonth, this.currentYear);
    const firstDay = this._getFirstDayOfMonth(this.currentMonth, this.currentYear);
    const daysInPrevMonth = this._getDaysInMonth(
      this.currentMonth === 0 ? 11 : this.currentMonth - 1,
      this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear
    );

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
      const prevYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ day, dateStr, isCurrentMonth: false });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ day, dateStr, isCurrentMonth: true });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
      const nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ day, dateStr, isCurrentMonth: false });
    }

    return html`
      <div class="calendar-header">
        <button @click="${this._prevMonth}" aria-label="Previous month">
          ‹
        </button>
        <div class="calendar-month-year">
          ${monthNames[this.currentMonth]} ${this.currentYear}
        </div>
        <button @click="${this._nextMonth}" aria-label="Next month">
          ›
        </button>
      </div>
      <div class="calendar-grid">
        <div class="calendar-weekdays">
          ${weekdays.map(day => html`<div class="calendar-weekday">${day}</div>`)}
        </div>
        <div class="calendar-days">
          ${days.map(({ day, dateStr, isCurrentMonth }) => html`
            <div
              class="${this._getDateClasses(dateStr, day, isCurrentMonth)}"
              @click="${() => this._selectDate(dateStr)}"
            >
              ${day}
            </div>
          `)}
        </div>
      </div>
      <div class="calendar-footer">
        <button class="btn-clear" @click="${this._clearDates}">Clear</button>
        <button class="btn-apply" @click="${this._applyDates}">Apply</button>
      </div>
    `;
  }

  render() {
    const displayText = this.startDate && this.endDate
      ? `${this._formatDate(this.startDate)} - ${this._formatDate(this.endDate)}`
      : '';

    const placeholder = 'Select dates';
    const inputClass = `date-range-input ${this._isFocused ? 'focused' : ''}`;

    return html`
      <div class="date-range-container">
        <div class="${inputClass}" @click="${this._toggleCalendar}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
          </svg>
          <div class="date-range-display ${displayText ? '' : 'placeholder'}">
            ${displayText || placeholder}
          </div>
        </div>
        <div class="calendar-dropdown ${this.isOpen ? 'open' : ''}" @click="${(e) => e.stopPropagation()}">
          ${this._renderCalendar()}
        </div>
      </div>
    `;
  }
}

console.log('Registering date-range-picker custom element');
customElements.define('date-range-picker', DateRangePicker);
console.log('date-range-picker registered successfully');
