/**
 * Returns a postocde lookup module.
 * @param {Object} window  Global window object
 */
function createPostcodeLookup(window) {
    // Define an empty JSON object to temporarily store matched address results.
    // eslint-disable-next-line no-unused-vars
    let tmpAddressSearchResultsJson = {};
    async function addressSearch() {
        const postcodeInput = window.document.getElementById('postcode-search-input').value;

        return fetch(`/address-finder/postcode?postcode=${postcodeInput}`)
            .then(async response => {
                if (response.ok) {
                    return response.json();
                }
                // TODO proper error handling
                const msg = 'TBC API Error Status error handling.';
                throw msg;
            })
            .then(data => {
                // TODO add proper error handling for no results found
                if (data.header.totalresults === 0 || !data.results) {
                    const msg = 'TBC No matching results found.';
                    throw msg;
                }

                const selectElementResults = window.document.getElementById(
                    'address-search-results-dropdown'
                );
                // Clear the results drop-down list.
                const options = window.document.querySelectorAll(
                    '#address-search-results-dropdown option'
                );
                options.forEach(o => o.remove());

                // Update the JSON object with the data results.
                tmpAddressSearchResultsJson = data.results;
                const option = window.document.createElement('option');
                option.text =
                    data.header.totalresults === 1
                        ? '1 address found'
                        : `${data.header.totalresults} addresses found`;
                selectElementResults.add(option);

                // See also {@link https://apidocs.os.uk/reference/os-places-dpa-output}
                const dataset = 'DPA';
                // Loop through the data results; adding the address string as a new option
                // to the results drop-down list.
                data.results.forEach(function addElemets(val, i) {
                    const opt = window.document.createElement('option');
                    opt.value = i;
                    opt.text = val[dataset.toUpperCase()].ADDRESS;
                    selectElementResults.add(opt);
                });

                // Display the hidden search results div
                const searchResultsDiv = window.document.getElementById('address-search-results');
                searchResultsDiv.style.display = 'block';
            })
            .catch(e => {
                throw e;
            });
    }

    function createContentElements() {
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
        postcodeSearchInput.setAttribute('aria-label', 'Enter a postcode');
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

    async function createFindAddressButton() {
        // CREATE POSTCODE SEARCH FIND ADDRESS BUTTON
        const searchButton = window.document.createElement('button');
        searchButton.setAttribute('id', 'search-button');
        searchButton.setAttribute('class', 'govuk-button govuk-button--secondary');
        searchButton.setAttribute('data-module', 'govuk-button');
        searchButton.setAttribute('type', 'button');
        searchButton.appendChild(window.document.createTextNode('Find Address'));
        window.document
            .getElementById('postcode-search')
            .insertAdjacentElement('afterend', searchButton);
        // Add an event listener to handle when the user clicks the 'Find Address' button.
        searchButton.addEventListener('click', async () => {
            await addressSearch();
        });
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
        searchResults.setAttribute('id', 'address-search-results-dropdown');
        searchResults.setAttribute('name', 'address-search-results-dropdown');
        searchResultsDiv.appendChild(searchResults);
        searchResultsDiv.style.display = 'none';

        window.document
            .getElementById('search-button')
            .insertAdjacentElement('afterend', searchResultsDiv);
    }

    async function init() {
        // CHECK FOR EXISTENCE OF REQUIRED ADDRESS FIELDS
        if (window.document.querySelector('[id *= "applicant-building-and-street"]') == null) {
            return;
        }
        createContentElements();
        createPostcodeSearchElements();
        await createFindAddressButton();
        createSearchResultsElements();
    }

    return Object.freeze({
        addressSearch,
        createContentElements,
        createPostcodeSearchElements,
        createFindAddressButton,
        createSearchResultsElements,
        init
    });
}

export default createPostcodeLookup;
