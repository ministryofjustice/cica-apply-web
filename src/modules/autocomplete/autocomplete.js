/* global accessibleAutocomplete */
function createAutocomplete(window) {
    function inputValueTemplate(result) {
        if (typeof result === 'string') {
            return result;
        }
        return result && result.name;
    }

    function suggestionTemplate(result) {
        let templateString;
        if (typeof result === 'string') {
            // on page load.
            templateString = `<strong>${result}</strong>`;
        } else {
            templateString = `<strong>${result.name}</strong>`;
        }
        return templateString;
    }

    function onConfirm(result) {
        const element = window.document.querySelector('.govuk-select');
        if (result) {
            const valueToSelect = result.code;
            element.value = valueToSelect;
        } else {
            element.value = '';
        }
    }

    function htmlCollectionToArray(ddElement) {
        // Turn the array-like html collection into an array
        return [...ddElement.options];
    }

    function formatResults(optionArray) {
        // <option value="100000001">Ayrshire & Arran</option>
        // =>
        // [{code: 100000001, name: 'Ayrshire & Arran'}, ....]
        return optionArray.map(option => ({
            code: option.value,
            name: option.innerHTML
        }));
    }

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

                accessibleAutocomplete.enhanceSelectElement({
                    selectElement: selectElements[i],
                    minLength: 2,
                    defaultValue: '',
                    autoselect: true,
                    confirmOnBlur: false,
                    showAllValues: true,
                    displayMenu: 'overlay',
                    onConfirm,
                    // eslint-disable-next-line no-loop-func
                    source: (query, syncResults) => {
                        const resultsArray = htmlCollectionToArray(selectElements[i]);
                        const results = formatResults(resultsArray);

                        syncResults(
                            query
                                ? results.filter(result => {
                                      // Make the user unable to search for and select the place holder.
                                      if (result.code === '') {
                                          return false;
                                      }
                                      return (
                                          result.name.toLowerCase().indexOf(query.toLowerCase()) !==
                                          -1
                                      );
                                  })
                                : []
                        );
                    },
                    templates: {
                        inputValue: inputValueTemplate,
                        suggestion: suggestionTemplate
                    },
                    tAssistiveHintVisible: true
                });
            }
        }
    }

    return Object.freeze({
        inputValueTemplate,
        suggestionTemplate,
        onConfirm,
        htmlCollectionToArray,
        formatResults,
        init
    });
}

export default createAutocomplete;
