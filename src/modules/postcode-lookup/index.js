/**
 * Returns a postocde lookup module.
 * @param {Object} window  Global window object
 */
function createPostcodeLookup(window) {
    // Define an empty JSON object to temporarily store matched address results.
    // eslint-disable-next-line no-unused-vars
    let tmpAddressSearchResultsJson = {};

    function isSelectedValueInteger(str) {
        if (typeof str !== 'string') {
            return false;
        }

        const num = Number(str);
        if (Number.isInteger(num)) {
            return true;
        }

        return false;
    }

    function mapSelectionToAddressFormInputs() {
        const selectedValue = this.options[this.selectedIndex].value;
        if (!isSelectedValueInteger(selectedValue)) {
            return;
        }
        const dataset = 'DPA';
        const result = tmpAddressSearchResultsJson[selectedValue][dataset];

        // Clear the form.
        const elements = window.document.querySelectorAll("form input[type='text']");
        elements.forEach(el => {
            const addressInput = el;
            addressInput.value = '';
        });

        // The following is based on the rules for generating multi-line addresses which are
        // documented in Chapter 9 of the AddressBase Premium Getting Started Guide:
        // https://www.ordnancesurvey.co.uk/documents/product-support/getting-started/addressbase-premium-getting-started-guide.pdf

        // Define constants for DPA address components (blank if NULL).
        const dpaOrganisationName = result.ORGANISATION_NAME || '';
        const dpaSubBuildingName = result.SUB_BUILDING_NAME || '';
        const dpaBuildingName = result.BUILDING_NAME || '';
        const dpaBuildingNumber = result.BUILDING_NUMBER || '';
        let dpaPOBoxNumber = result.PO_BOX_NUMBER || '';
        const dpaDependentThoroughfareName = result.DEPENDENT_THOROUGHFARE_NAME || '';
        const dpaThoroughfareName = result.THOROUGHFARE_NAME || '';
        const dpaDependentLocality = result.DEPENDENT_LOCALITY || '';
        const dpaPostTown = result.POST_TOWN || '';
        const dpaPostcode = result.POSTCODE || '';
        const dpaCounty = result.LOCAL_CUSTODIAN_CODE_DESCRIPTION || '';

        // Add a "PO BOX " prefix to the PO Box Number integer.
        if (dpaPOBoxNumber !== '') {
            dpaPOBoxNumber = `PO BOX ${dpaPOBoxNumber}`;
        }

        // Remove empty values from the array
        const thoroughfareLocality = [
            dpaDependentThoroughfareName,
            dpaThoroughfareName,
            dpaDependentLocality
        ].filter(item => item);

        const premises = [];
        if (dpaSubBuildingName !== '') {
            premises.push(dpaSubBuildingName);
        }

        let premisesThoroughfareLocality = '';
        // Define a regular expression to test for a letter suffix (e.g. '11A') or number
        // range (e.g. '110-114'). Combine the first values from the premises and thoroughfare
        const regex = /(^[0-9]+[a-zA-Z]$)|(^[0-9]+-[0-9]+$)/;
        if (regex.test(dpaBuildingName)) {
            // add to thouroughfare
            premisesThoroughfareLocality = `${dpaBuildingName} ${thoroughfareLocality[0]}`;
            thoroughfareLocality.shift();
        } else {
            premises.push(dpaBuildingName);
        }

        if (dpaBuildingNumber !== '') {
            premisesThoroughfareLocality = `${dpaBuildingNumber} ${thoroughfareLocality[0]}`;
            thoroughfareLocality.shift();
        }

        let addressLines = [];

        // Push the Organisation Name and PO Box Number to the address array.
        addressLines.push(dpaPOBoxNumber, dpaOrganisationName);

        // Merge the structured premises and thoroughfare components into the address array.
        addressLines = addressLines.concat(premises);
        addressLines = addressLines.concat(premisesThoroughfareLocality);
        addressLines = addressLines.concat(thoroughfareLocality);

        // Remove any duplicates and blanks from the address array.
        addressLines = [...new Set(addressLines)];
        addressLines = addressLines.filter(item => item);

        const [selectionLine1, selectionLine2, selectionLine3] = addressLines;

        const addressLine1 = window.document.querySelector('[id *= "street"]');
        addressLine1.value = selectionLine1;

        const addressLine2 = window.document.querySelector('[id *= "street-2"]');
        addressLine2.value = selectionLine2 || '';

        const addressLine3 = window.document.querySelector('[id *= "street-3"]');
        addressLine3.value = selectionLine3 || '';

        const addressTown = window.document.querySelector('[id *= "town-or-city"]');
        addressTown.value = dpaPostTown;

        const addressCounty = window.document.querySelector('[id *= "county"]');
        addressCounty.value = dpaCounty || '';

        const addressPostcode = window.document.querySelector('[id *= "-postcode"]');
        addressPostcode.value = dpaPostcode;
    }

    let selectElementResults;

    function addSearchResultsToSelectElement(data) {
        const options = window.document.querySelectorAll('#address-search-results-dropdown option');
        options.forEach(option => option.remove());

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
        data.results.forEach(function addElements(val, i) {
            const opt = window.document.createElement('option');
            opt.value = i;
            opt.text = val[dataset].ADDRESS;
            selectElementResults.add(opt);
        });

        // Display the hidden search results div
        const searchResultsDiv = window.document.getElementById('address-search-results');
        searchResultsDiv.style.display = 'block';
    }

    async function addressSearch() {
        const postcodeInput = window.document.getElementById('postcode-search-input').value;

        const response = await fetch(`/address-finder/postcode?postcode=${postcodeInput}`);
        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`);
            // TODO proper error handling
            const msg = 'TBC API Error Status error handling.';
            throw msg;
        }

        const data = await response.json();

        // TODO add proper error handling for no results found
        if (data.header.totalresults === 0 || !data.results) {
            const msg = 'TBC No matching results found.';
            throw msg;
        }

        addSearchResultsToSelectElement(data);
    }

    function createContentElements() {
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
        const postcodeSearchLabelContent = window.document.createTextNode('Postcode');

        const postcodeSearchLabel = window.document.createElement('label');
        postcodeSearchLabel.appendChild(postcodeSearchLabelContent);
        postcodeSearchLabel.setAttribute('class', 'govuk-label');
        postcodeSearchLabel.setAttribute('for', 'postcode-search-input');

        const postcodeSearchInput = window.document.createElement('input');
        postcodeSearchInput.setAttribute('class', 'govuk-input govuk-input--width-10');
        postcodeSearchInput.setAttribute('id', 'postcode-search-input');
        postcodeSearchInput.setAttribute('name', 'postcode-search-input');
        postcodeSearchInput.setAttribute('type', 'search');
        postcodeSearchInput.setAttribute('autocomplete', 'postal-code');

        const postcodeSearchDiv = window.document.createElement('div');
        postcodeSearchDiv.setAttribute('id', 'postcode-search');
        postcodeSearchDiv.setAttribute('class', 'govuk-form-group');
        postcodeSearchDiv.appendChild(postcodeSearchLabel);
        postcodeSearchDiv.appendChild(postcodeSearchInput);

        window.document
            .getElementById('fill-out-the-fields-manually-hint')
            .insertAdjacentElement('afterend', postcodeSearchDiv);
    }

    async function createFindAddressButton() {
        const searchButton = window.document.createElement('button');
        searchButton.setAttribute('id', 'search-button');
        searchButton.setAttribute('class', 'govuk-button govuk-button--secondary');
        searchButton.setAttribute('data-module', 'govuk-button');
        searchButton.setAttribute('type', 'button');
        searchButton.appendChild(window.document.createTextNode('Find Address'));
        window.document
            .getElementById('postcode-search')
            .insertAdjacentElement('afterend', searchButton);

        searchButton.addEventListener('click', async () => {
            await addressSearch();
        });
    }

    function createSearchResultsElements() {
        // CREATE INITALLY HIDDEN SEARCH RESULTS SELECT ELEMENT
        const addressSearchResultsLabel = window.document.createElement('label');
        addressSearchResultsLabel.appendChild(window.document.createTextNode('Select an address'));
        addressSearchResultsLabel.setAttribute('class', 'govuk-label');
        addressSearchResultsLabel.setAttribute('for', 'address-search-results-dropdown');

        const searchResults = window.document.createElement('select');
        searchResults.setAttribute('class', 'govuk-select');
        searchResults.setAttribute('id', 'address-search-results-dropdown');
        searchResults.setAttribute('name', 'address-search-results-dropdown');
        searchResults.appendChild(addressSearchResultsLabel);

        const searchResultsDiv = window.document.createElement('div');
        searchResultsDiv.setAttribute('class', 'govuk-form-group');
        searchResultsDiv.setAttribute('id', 'address-search-results');
        searchResultsDiv.setAttribute('name', 'address-search-results');
        searchResultsDiv.setAttribute('role', 'region');
        searchResultsDiv.setAttribute('aria-live', 'polite');
        searchResultsDiv.appendChild(addressSearchResultsLabel);
        searchResultsDiv.appendChild(searchResults);
        searchResultsDiv.style.display = 'none';

        window.document
            .getElementById('search-button')
            .insertAdjacentElement('afterend', searchResultsDiv);

        searchResults.addEventListener('change', mapSelectionToAddressFormInputs);

        selectElementResults = window.document.getElementById('address-search-results-dropdown');
    }

    async function init() {
        // CHECK FOR EXISTENCE OF REQUIRED ADDRESS FIELDS
        if (window.document.querySelector('[id *= "q-applicant-building-and-street"]') == null) {
            return;
        }
        createContentElements();
        createPostcodeSearchElements();
        await createFindAddressButton();
        createSearchResultsElements();
    }

    return Object.freeze({
        isSelectedValueInteger,
        mapSelectionToAddressFormInputs,
        addSearchResultsToSelectElement,
        addressSearch,
        createContentElements,
        createPostcodeSearchElements,
        createFindAddressButton,
        createSearchResultsElements,
        init
    });
}

export default createPostcodeLookup;
