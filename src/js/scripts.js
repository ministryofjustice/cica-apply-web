import {createAutocomplete} from './autocomplete/autocomplete';

(() => {
    const autocomplete = createAutocomplete();

    const selectElement = document.querySelector('.govuk-select');

    if (selectElement) {
        selectElement.parentNode.classList.add('autocomplete__wrapper');

        const placeHolder = '';
        const source = (query, syncResults) => {
            const resultsArray = autocomplete.htmlCollectionToArray(selectElement);
            const results = autocomplete.formatResults(resultsArray);

            syncResults(
                query
                    ? results.filter(result => {
                          // Make the user unable to search for and select the place holder.
                          if (result.code === placeHolder) {
                              return false;
                          }
                          return result.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
                      })
                    : []
            );
        };

        accessibleAutocomplete.enhanceSelectElement({
            selectElement,
            id: 'enhanced-dropdown-id',
            minLength: 2,
            defaultValue: placeHolder,
            autoselect: true,
            confirmOnBlur: true,
            showAllValues: true,
            displayMenu: 'overlay',
            onConfirm: autocomplete.onConfirm,
            source,
            templates: {
                inputValue: autocomplete.inputValueTemplate,
                suggestion: autocomplete.suggestionTemplate
            }
        });
    }
})();
