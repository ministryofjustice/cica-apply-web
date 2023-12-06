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
            for (let i = 0; i < selectElements.length; i += 1) {
                selectElements[i].parentNode.classList.add('autocomplete__wrapper');

                window.accessibleAutocomplete.enhanceSelectElement({
                    selectElement: selectElements[i],
                    minLength: 2,
                    defaultValue: '',
                    displayMenu: 'overlay',
                    showAllValues: true,
                    autoselect: true,
                    confirmOnBlur: false
                });
            }
        }
    }

    return Object.freeze({
        init
    });
}

export default createAutocomplete;
