import { getDOMElements } from './domElements.js';

let elements;

export function initUIElements() {
    elements = getDOMElements();
}

export function showLoader() {
    if (elements && elements.loaderWrapper) {
        elements.loaderWrapper.classList.remove('hidden');
        elements.loaderWrapper.style.opacity = '1';
    }
}

export function hideLoader() {
    if (elements && elements.loaderWrapper) {
        elements.loaderWrapper.style.opacity = '0';
        elements.loaderWrapper.addEventListener('transitionend', function() {
            elements.loaderWrapper.classList.add('hidden');
        }, { once: true });
    }
}

export function displayErrorMessage(message) {
    if (elements && elements.errorMessageElement) {
        elements.errorMessageElement.textContent = message;
    }
}