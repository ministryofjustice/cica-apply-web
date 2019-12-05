function createAutocomplete() {
    function inputValueTemplate(result) {
        if (typeof result === 'string') {
            return result;
        }
        return result && result.name;
    }

    function suggestionTemplate(result) {
        if (typeof result === 'string') {
            return `<strong>${result.name}</strong>`;
        }
        return result && `<strong>${result.name}</strong>`;
    }

    function onConfirm(result) {
        // eslint-disable-next-line no-undef
        const element = document.querySelector('.govuk-select');
        if (result) {
            const valueToSelect = result.code;
            element.value = valueToSelect;
        } else {
            element.value = '';
        }
    }

    function htmlCollectionToArray(ddElement) {
        // Turn the array-like html collection into an array
        // eslint-disable-next-line prefer-spread
        return Array.apply(null, ddElement.options);
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

    return Object.freeze({
        inputValueTemplate,
        suggestionTemplate,
        onConfirm,
        htmlCollectionToArray,
        formatResults
    });
}

// eslint-disable-next-line import/prefer-default-export
export {createAutocomplete};
