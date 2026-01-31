import { LitElement, html, css } from 'lit';

// Countries data with validation rules and formatting
const COUNTRIES = [
  { name: 'Morocco', code: 'MA', dialCode: '+212', flag: '🇲🇦', length: 9, format: 'X XX XX XX XX' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', length: 9, format: 'X XX XX XX XX' },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸', length: 9, format: 'XXX XX XX XX' },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', length: 10, format: '(XXX) XXX-XXXX' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', length: 10, format: 'XXXX XXX XXX' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', length: 10, format: 'XXX XXXXXXX' },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹', length: 10, format: 'XXX XXX XXXX' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱', length: 9, format: 'X XX XX XX XX' },
  { name: 'Belgium', code: 'BE', dialCode: '+32', flag: '🇧🇪', length: 9, format: 'XXX XX XX XX' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭', length: 9, format: 'XX XXX XX XX' },
  { name: 'Portugal', code: 'PT', dialCode: '+351', flag: '🇵🇹', length: 9, format: 'XXX XXX XXX' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', length: 10, format: '(XXX) XXX-XXXX' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦', length: 9, format: 'XX XXX XXXX' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪', length: 9, format: 'XX XXX XXXX' },
  { name: 'Qatar', code: 'QA', dialCode: '+974', flag: '🇶🇦', length: 8, format: 'XXXX XXXX' },
  { name: 'Algeria', code: 'DZ', dialCode: '+213', flag: '🇩🇿', length: 9, format: 'XXX XX XX XX' },
  { name: 'Tunisia', code: 'TN', dialCode: '+216', flag: '🇹🇳', length: 8, format: 'XX XXX XXX' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬', length: 10, format: 'XXX XXX XXXX' },
  { name: 'Turkey', code: 'TR', dialCode: '+90', flag: '🇹🇷', length: 10, format: 'XXX XXX XX XX' },
  { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳', length: 11, format: 'XXX XXXX XXXX' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵', length: 10, format: 'XX XXXX XXXX' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', length: 9, format: 'XXX XXX XXX' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷', length: 11, format: 'XX XXXXX XXXX' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', length: 10, format: 'XXXXX XXXXX' },
  { name: 'Russia', code: 'RU', dialCode: '+7', flag: '🇷🇺', length: 10, format: 'XXX XXX XX XX' },
];

class PhoneInput extends LitElement {
  static properties = {
    value: { type: String },
    selectedCountry: { type: Object },
    phoneNumber: { type: String },
    dropdownOpen: { type: Boolean },
    searchQuery: { type: String },
    validationState: { type: String }, // 'idle', 'valid', 'error'
    errorMessage: { type: String },
    required: { type: Boolean },
    _isFocused: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .phone-input-container {
      position: relative;
    }

    .phone-input-wrapper {
      position: relative;
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: stretch;
      border: 1px solid var(--form-field-border-color, #d0d0d0);
      border-radius: var(--form-field-border-radius, 0.6rem);
      background: color-mix(in srgb, var(--theme-surface-1, #ffffff) 12%, #ffffff);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      overflow: hidden;
    }

    .phone-input-wrapper.focused {
      border-color: var(--theme-primary, #5b4cff);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-primary, #5b4cff) 14%, transparent);
    }

    .phone-input-wrapper.error {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .phone-input-wrapper.valid {
      border-color: #16a34a;
      box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
    }

    .country-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.75rem;
      cursor: pointer;
      background: transparent;
      border: none;
      border-right: 1px solid color-mix(in srgb, var(--theme-outline-variant, #d0d0d0) 50%, transparent);
      transition: background-color 0.2s ease;
      font-size: 0.95rem;
      min-width: 100px;
    }

    .country-selector:hover {
      background: color-mix(in srgb, var(--theme-surface-2, #f5f5f5) 50%, transparent);
    }

    .country-flag {
      font-size: 1.25rem;
      line-height: 1;
    }

    .country-dial-code {
      font-weight: 500;
      color: var(--theme-on-surface-1, #1f1f1f);
    }

    .dropdown-arrow {
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid currentColor;
      opacity: 0.6;
      transition: transform 0.2s ease;
    }

    .dropdown-arrow.open {
      transform: rotate(180deg);
    }

    .phone-number-input {
      border: none;
      outline: none;
      background: transparent;
      padding: 0.45rem 0.75rem;
      font-size: 0.95rem;
      color: var(--theme-on-surface-1, #1f1f1f);
      width: 100%;
    }

    .phone-number-input::placeholder {
      color: color-mix(in srgb, var(--theme-on-surface-1, #1f1f1f) 48%, transparent);
    }

    .validation-icon {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.1rem;
      pointer-events: none;
    }

    .validation-icon.valid {
      color: #16a34a;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.35rem;
      font-size: 0.85rem;
      color: #dc2626;
      font-weight: 500;
    }

    .dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      right: 0;
      background: var(--theme-bg, #ffffff);
      border: 1px solid var(--theme-outline-variant, #d0d0d0);
      border-radius: var(--form-field-border-radius, 0.6rem);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      max-height: 320px;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: translateY(-10px);
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }

    .dropdown.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .dropdown-search {
      padding: 0.75rem;
      border-bottom: 1px solid var(--theme-outline-variant, #d0d0d0);
    }

    .dropdown-search input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--theme-outline-variant, #d0d0d0);
      border-radius: 0.4rem;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .dropdown-search input:focus {
      border-color: var(--theme-primary, #5b4cff);
    }

    .dropdown-list {
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--theme-primary, #5b4cff) transparent;
    }

    .dropdown-list::-webkit-scrollbar {
      width: 6px;
    }

    .dropdown-list::-webkit-scrollbar-thumb {
      background: var(--theme-primary, #5b4cff);
      border-radius: 3px;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      cursor: pointer;
      transition: background-color 0.15s ease;
      border-bottom: 1px solid color-mix(in srgb, var(--theme-outline-variant, #d0d0d0) 30%, transparent);
    }

    .dropdown-item:hover {
      background: color-mix(in srgb, var(--theme-primary, #5b4cff) 8%, transparent);
    }

    .dropdown-item.selected {
      background: color-mix(in srgb, var(--theme-primary, #5b4cff) 12%, transparent);
    }

    .dropdown-item-flag {
      font-size: 1.5rem;
      line-height: 1;
    }

    .dropdown-item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .dropdown-item-name {
      font-weight: 500;
      font-size: 0.9rem;
      color: var(--theme-on-bg, #1f1f1f);
    }

    .dropdown-item-code {
      font-size: 0.8rem;
      color: var(--theme-primary, #5b4cff);
      font-weight: 600;
    }
  `;

  constructor() {
    super();
    this.selectedCountry = COUNTRIES[0]; // Default: Morocco
    this.phoneNumber = '';
    this.dropdownOpen = false;
    this.searchQuery = '';
    this.validationState = 'idle';
    this.errorMessage = '';
    this.required = false;
    this._isFocused = false;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleOutsideClick, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleOutsideClick, true);
  }

  _handleOutsideClick = (e) => {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.dropdownOpen = false;
    }
  };

  _toggleDropdown = (e) => {
    e.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.requestUpdate();
      setTimeout(() => {
        const searchInput = this.shadowRoot.querySelector('.dropdown-search input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 150);
    }
  };

  _selectCountry = (country, e) => {
    if (e) {
      e.stopPropagation();
    }
    this.selectedCountry = country;
    this.dropdownOpen = false;
    this.searchQuery = '';
    this._validatePhone();
    this._notifyChange();
    this.requestUpdate();
  };

  _handlePhoneInput = (e) => {
    const input = e.target.value;
    // Remove all non-digit characters
    const digitsOnly = input.replace(/\D/g, '');
    this.phoneNumber = digitsOnly;
    this._validatePhone();
    this._notifyChange();
    this.requestUpdate();
  };

  _handleSearchInput = (e) => {
    this.searchQuery = e.target.value.toLowerCase();
  };

  _getFilteredCountries() {
    if (!this.searchQuery) return COUNTRIES;
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(this.searchQuery) ||
        country.code.toLowerCase().includes(this.searchQuery) ||
        country.dialCode.includes(this.searchQuery)
    );
  }

  _formatPhoneNumber(number, format) {
    if (!number) return '';
    let formatted = '';
    let digitIndex = 0;

    for (let i = 0; i < format.length && digitIndex < number.length; i++) {
      if (format[i] === 'X') {
        formatted += number[digitIndex];
        digitIndex++;
      } else {
        formatted += format[i];
      }
    }

    return formatted;
  }

  _validatePhone() {
    const length = this.phoneNumber.length;
    const requiredLength = this.selectedCountry.length;

    if (!this.phoneNumber || length === 0) {
      this.validationState = 'idle';
      this.errorMessage = '';
      return;
    }

    if (length < requiredLength) {
      this.validationState = 'error';
      const remaining = requiredLength - length;
      this.errorMessage = `Invalid phone number | ${this.selectedCountry.code}: too short (${remaining} digit${remaining > 1 ? 's' : ''} missing)`;
    } else if (length === requiredLength) {
      this.validationState = 'valid';
      this.errorMessage = '';
    } else {
      this.validationState = 'error';
      this.errorMessage = `Invalid phone number | ${this.selectedCountry.code}: too long`;
    }

    // Dispatch validation event
    this.dispatchEvent(
      new CustomEvent('validation-change', {
        detail: { isValid: this.validationState === 'valid' },
        bubbles: true,
        composed: true,
      })
    );
  }

  _notifyChange() {
    const fullNumber = this.selectedCountry.dialCode + this.phoneNumber;
    this.dispatchEvent(
      new CustomEvent('phone-change', {
        detail: {
          phone: fullNumber,
          countryCode: this.selectedCountry.code,
          isValid: this.validationState === 'valid',
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleFocus = () => {
    this._isFocused = true;
    this.requestUpdate();
  };

  _handleBlur = () => {
    setTimeout(() => {
      this._isFocused = false;
      this.requestUpdate();
    }, 100);
  };

  render() {
    const filteredCountries = this._getFilteredCountries();
    const formattedNumber = this._formatPhoneNumber(this.phoneNumber, this.selectedCountry.format);
    const placeholder = this.selectedCountry.format.replace(/X/g, '0');

    const wrapperClass = [
      'phone-input-wrapper',
      this._isFocused ? 'focused' : '',
      this.validationState === 'error' ? 'error' : '',
      this.validationState === 'valid' ? 'valid' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div class="phone-input-container">
        <div class="${wrapperClass}">
          <button
            type="button"
            class="country-selector"
            @click="${this._toggleDropdown}"
            aria-label="Select country"
          >
            <span class="country-flag">${this.selectedCountry.flag}</span>
            <span class="country-dial-code">${this.selectedCountry.dialCode}</span>
            <span class="dropdown-arrow ${this.dropdownOpen ? 'open' : ''}"></span>
          </button>

          <input
            type="tel"
            class="phone-number-input"
            .value="${formattedNumber}"
            @input="${this._handlePhoneInput}"
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
            placeholder="${placeholder}"
            ?required="${this.required}"
            autocomplete="tel"
          />

          ${this.validationState === 'valid'
            ? html`<span class="validation-icon valid">✓</span>`
            : ''}
        </div>

        ${this.validationState === 'error' && this.errorMessage
          ? html`<div class="error-message">⚠ ${this.errorMessage}</div>`
          : ''}

        <div
          class="dropdown ${this.dropdownOpen ? 'open' : ''}"
          @click="${(e) => e.stopPropagation()}"
        >
          <div class="dropdown-search">
            <input
              type="text"
              placeholder="Search country..."
              .value="${this.searchQuery}"
              @input="${this._handleSearchInput}"
              @click="${(e) => e.stopPropagation()}"
            />
          </div>
          <div class="dropdown-list">
            ${filteredCountries.map(
              (country) => html`
                <div
                  class="dropdown-item ${country.code === this.selectedCountry.code
                    ? 'selected'
                    : ''}"
                  @click="${(e) => this._selectCountry(country, e)}"
                >
                  <span class="dropdown-item-flag">${country.flag}</span>
                  <div class="dropdown-item-info">
                    <span class="dropdown-item-name">${country.name}</span>
                    <span class="dropdown-item-code">${country.dialCode}</span>
                  </div>
                </div>
              `
            )}
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('phone-input')) {
  customElements.define('phone-input', PhoneInput);
}

