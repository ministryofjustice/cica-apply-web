function createPostcodeLookup(window) {
    function createContentElements() {
        // Consider changing vars to consts
        // CREATE CONTENT ELEMENT
        const descriptionDiv = window.document.createElement('div');
        descriptionDiv.appendChild(
            window.document.createTextNode(
                'Enter a UK postcode to search for your address, or fill out the fields manually.'
            )
        );
        descriptionDiv.setAttribute('id', 'fill-out-the-fields-manually-hint');
        descriptionDiv.setAttribute('class', 'govuk-hint');
        window.document
            .querySelector('.govuk-form-group')
            .insertAdjacentElement('beforeBegin', descriptionDiv);
    }

    function createPostcodeSearchElements() {
        // CREATE POSTCODE SEARCH ELEMENTS
        const postcodeSearchDiv = window.document.createElement('div');
        postcodeSearchDiv.setAttribute('id', 'postcode-search');
        postcodeSearchDiv.setAttribute('class', 'govuk-form-group');
        const postcodeSearchInput = window.document.createElement('input');
        postcodeSearchInput.setAttribute('class', 'govuk-input govuk-input--width-10');
        postcodeSearchInput.setAttribute('id', 'postcode-search-input');
        postcodeSearchInput.setAttribute('name', 'postcode-search-input');
        // text or search?
        postcodeSearchInput.setAttribute('type', 'search');
        // TODO content for aria-label, is the label required
        postcodeSearchInput.setAttribute('aria-label', 'Find Address lookup');
        // do we want the autocomplete here?
        postcodeSearchInput.setAttribute('autocomplete', 'postal-code');
        const postcodeSearchLabel = window.document.createElement('label');
        const postcodeSearchLabelContent = window.document.createTextNode('Postcode');
        postcodeSearchLabel.appendChild(postcodeSearchLabelContent);
        postcodeSearchLabel.setAttribute('class', 'govuk-label');
        postcodeSearchLabel.setAttribute('for', 'postocde-search-input');
        postcodeSearchDiv.appendChild(postcodeSearchLabel);
        postcodeSearchDiv.appendChild(postcodeSearchInput);
        window.document
            .getElementById('fill-out-the-fields-manually-hint')
            .insertAdjacentElement('afterend', postcodeSearchDiv);
    }

    function createFindAddressButton() {
        // CREATE POSTCODE SEARCH FIND ADDRESS BUTTON
        const searchButton = window.document.createElement('button');
        searchButton.setAttribute('id', 'search-button-id');
        searchButton.setAttribute('class', 'govuk-button govuk-button--secondary');
        searchButton.setAttribute('data-module', 'govuk-button');
        searchButton.setAttribute('type', 'button');
        searchButton.appendChild(window.document.createTextNode('Find Address'));
        window.document
            .getElementById('postcode-search')
            .insertAdjacentElement('afterend', searchButton);
    }

    function createSearchResultsElements() {
        // CREATE INITALLY HIDDEN SEARCH RESULTS SELECT ELEMENT
        const searchResultsDiv = window.document.createElement('div');
        searchResultsDiv.setAttribute('class', 'govuk-form-group');
        searchResultsDiv.setAttribute('id', 'address-search-results');
        searchResultsDiv.setAttribute('name', 'address-search-results');
        searchResultsDiv.setAttribute('role', 'region');
        searchResultsDiv.setAttribute('aria-live', 'polite');
        const addressSearchResultsLabel = window.document.createElement('label');
        addressSearchResultsLabel.appendChild(window.document.createTextNode('Select an address'));
        addressSearchResultsLabel.setAttribute('class', 'govuk-label');
        addressSearchResultsLabel.setAttribute('for', 'postocde-search-input');
        searchResultsDiv.appendChild(addressSearchResultsLabel);
        const searchResults = window.document.createElement('select');
        searchResults.setAttribute('class', 'govuk-select');
        searchResults.setAttribute('id', 'results');
        searchResults.setAttribute('name', 'results');
        searchResultsDiv.appendChild(searchResults);
        searchResultsDiv.style.display = 'none';

        window.document
            .getElementById('search-button-id')
            .insertAdjacentElement('afterend', searchResultsDiv);
    }

    function init() {
        // CHECK FOR EXISTENCE OF REQUIRED ADDRESS FIELDS
        if (window.document.querySelector('[id *= "applicant-building-and-street"]') == null) {
            return;
        }
        createContentElements();
        createPostcodeSearchElements();
        createFindAddressButton();
        createSearchResultsElements();
    }

    return Object.freeze({
        createContentElements,
        createPostcodeSearchElements,
        createFindAddressButton,
        createSearchResultsElements,
        init
    });
}

export default createPostcodeLookup;
