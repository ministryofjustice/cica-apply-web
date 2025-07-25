import accessibleAutocomplete from './vendor/autocomplete.min.js';

function createAutocomplete(window) {
    /**
     * Initialises the `Enhanced auto-complete` select element implementation.
     *
     * @param {(string|NodeList)} elements - A CSS selector for the elements, or a collection of the elements that are to be turned in to autocomplete select elements.
     *
     * @example
     *
     *     autocomplete.init('.govuk-select');
     *     autocomplete.init(window.document.querySelectorAll('.govuk-select'));
     */
    function init(elements) {
        let selectElements = elements;

        if (typeof selectElements === 'string') {
            selectElements = window.document.querySelectorAll(selectElements);
        }

        if (selectElements.length) {
            // eslint-disable-next-line no-param-reassign
            window.accessibleAutocomplete = accessibleAutocomplete;

            for (let i = 0; i < selectElements.length; i += 1) {
                selectElements[i].parentNode.classList.add('autocomplete__wrapper');

                // Select the hint element
                const hintElement = window.document.querySelector('.govuk-hint');

                // Define the default assistive hint
                let assistiveHint =
                    'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.';

                // Append the innerText of hintElement to assistiveHint if hintElement exists
                if (hintElement && hintElement.innerText.trim() !== '') {
                    assistiveHint = `${hintElement.innerText} ${assistiveHint}`;
                }

                window.accessibleAutocomplete.enhanceSelectElement({
                    selectElement: selectElements[i],
                    minLength: 2,
                    defaultValue: '',
                    placeholder: 'Start typing to find a police force',
                    displayMenu: 'overlay',
                    showAllValues: true,
                    autoselect: true,
                    confirmOnBlur: false,
                    tAssistiveHint: () => assistiveHint
                });
            }
        }
    }

    return Object.freeze({
        init
    });
}

export default createAutocomplete;
