/**
 * Returns a postocde lookup module.
 * @param {Object} window  Global window object
 */
function createPostcodeLookup(window) {
    // Define an empty JSON object to temporarily store matched address results.
    // eslint-disable-next-line no-unused-vars
    let tmpAddressSearchResultsJson = {};

    let apiNoAddressesFoundErrorMessage;
    let apiResponseNotOkErrorMessage;
    const INVALID_POSTCODE_ERROR = 'Enter a valid postcode';
    let emptySearchInputErrorMessage;
    let searchResultsDiv;
    let selectElementResults;
    let addressSearchResultsOptions;
    let addressSearchInput;

    function isSelectedValueInteger(str) {
        const num = Number(str);
        if (Number.isInteger(num)) {
            return true;
        }

        return false;
    }

    function clearAddressForm() {
        const elements = window.document.querySelectorAll("form input[type='text']");
        elements.forEach(el => {
            const addressInput = el;
            addressInput.value = '';
        });
    }

    function mapSelectionToAddressFormInputs() {
        const selectedValue = this.options[this.selectedIndex].value;
        if (!isSelectedValueInteger(selectedValue)) {
            return;
        }
        const dataset = 'DPA';
        const result = tmpAddressSearchResultsJson[selectedValue][dataset];

        clearAddressForm();

        // The following is based on the rules for generating multi-line addresses which are
        // documented in Chapter 9 of the AddressBase Premium Getting Started Guide:
        // https://www.ordnancesurvey.co.uk/documents/product-support/getting-started/addressbase-premium-getting-started-guide.pdf

        // Define constants for DPA address components (blank if NULL).
        let dpaOrganisationName = result.ORGANISATION_NAME || '';
        const dpaSubBuildingName = result.SUB_BUILDING_NAME || '';
        const dpaBuildingName = result.BUILDING_NAME || '';
        const dpaBuildingNumber = result.BUILDING_NUMBER || '';
        let dpaPOBoxNumber = result.PO_BOX_NUMBER || '';
        const dpaDependentThoroughfareName = result.DEPENDENT_THOROUGHFARE_NAME || '';
        const dpaThoroughfareName = result.THOROUGHFARE_NAME || '';
        const dpaDependentLocality = result.DEPENDENT_LOCALITY || '';
        const dpaPostTown = result.POST_TOWN;
        const dpaPostcode = result.POSTCODE;
        const dpaCounty =
            result.LOCAL_CUSTODIAN_CODE_DESCRIPTION === 'ORDNANCE SURVEY'
                ? ''
                : result.LOCAL_CUSTODIAN_CODE_DESCRIPTION;

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

        // Does the page contain an organisation name?
        const organisationName = window.document.querySelector('[id *= "organisation-name"]');
        if (organisationName) {
            organisationName.value = dpaOrganisationName;
            dpaOrganisationName = '';
        }

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
        addressCounty.value = dpaCounty;

        const addressPostcode = window.document.querySelector('[id *= "postcode"]');
        addressPostcode.value = dpaPostcode;
    }

    function clearAddressResultsDropdown() {
        addressSearchResultsOptions = window.document.querySelectorAll(
            '#address-search-results-dropdown option'
        );
        addressSearchResultsOptions.forEach(option => option.remove());
    }

    function addSearchResultsToSelectElement(data) {
        clearAddressResultsDropdown();

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
        searchResultsDiv.style.display = 'block';
        selectElementResults.focus();
    }

    let addressSearchDiv;

    function displayFieldErrors(message) {
        const errorInnerSpan = window.document.createElement('span');
        errorInnerSpan.setAttribute('class', 'govuk-visually-hidden');
        const errorInnerSpanText = window.document.createTextNode('Error:');
        errorInnerSpan.appendChild(errorInnerSpanText);

        const errorOuterSpan = window.document.createElement('span');
        errorOuterSpan.setAttribute('id', 'address-search-input-error');
        errorOuterSpan.setAttribute('class', 'govuk-error-message');
        const errorOuterSpanText = window.document.createTextNode(message);
        errorOuterSpan.appendChild(errorOuterSpanText);
        errorOuterSpan.appendChild(errorInnerSpan);

        // const addressSearchInput = window.document.getElementById('address-search-input');
        addressSearchInput.setAttribute(
            'class',
            'govuk-input govuk-input--error govuk-input--width-10'
        );
        addressSearchInput.setAttribute('aria-describedby', 'address-search-input-error');

        addressSearchInput.insertAdjacentElement('beforebegin', errorOuterSpan);

        addressSearchDiv.setAttribute('class', 'govuk-form-group govuk-form-group--error');
        addressSearchDiv.className = 'govuk-form-group govuk-form-group--error';
    }

    function handleErrorSummaryListElement(message) {
        if (
            message === apiResponseNotOkErrorMessage ||
            message === apiNoAddressesFoundErrorMessage
        ) {
            return window.document.createTextNode(message);
        }
        const errorAnchor = window.document.createElement('a');

        const link = window.document.createTextNode(message);
        errorAnchor.appendChild(link);
        errorAnchor.href = '#address-search-input';
        /* eslint-disable func-names */
        errorAnchor.onclick = function() {
            const assocLabel = window.document.querySelector(
                `label[for='${addressSearchInput.id}']`
            );
            assocLabel.scrollIntoView();
            addressSearchInput.focus({preventScroll: true});
            return false;
        };
        return errorAnchor;
    }

    function displayErrorSummary(message) {
        const error = window.document.createElement('li');
        error.appendChild(handleErrorSummaryListElement(message));

        const errorList = window.document.createElement('ul');
        errorList.setAttribute('class', 'govuk-list govuk-error-summary__list');
        errorList.appendChild(error);

        const errorSummaryBody = window.document.createElement('div');
        errorSummaryBody.setAttribute('class', 'govuk-error-summary__body');
        errorSummaryBody.appendChild(errorList);

        const errorHeading = window.document.createElement('h2');
        errorHeading.setAttribute('class', 'govuk-error-summary__title');
        errorHeading.setAttribute('id', 'error-summary-title');
        const errorHeadingText = window.document.createTextNode('There is a problem');
        errorHeading.appendChild(errorHeadingText);

        const errorSummary = window.document.createElement('div');
        errorSummary.setAttribute('class', 'govuk-error-summary');
        errorSummary.setAttribute('aria-labelledby', 'error-summary-title');
        errorSummary.setAttribute('role', 'alert');
        errorSummary.setAttribute('tabindex', '-1');
        errorSummary.setAttribute('data-module', 'govuk-error-summary');

        errorSummary.appendChild(errorHeading);
        errorSummary.appendChild(errorSummaryBody);

        const form = window.document.querySelector('form');
        form.insertAdjacentElement('afterbegin', errorSummary);
        errorSummary.focus();
    }

    function removeErrorMessages() {
        const pageTitle = window.document.title.replace('Error: ', '');
        // eslint-disable-next-line no-param-reassign
        window.document.title = pageTitle;
        const errorSummary = window.document.querySelector('.govuk-error-summary');
        if (errorSummary) {
            errorSummary.remove();
        } else {
            return;
        }

        const errorSpans = window.document.querySelectorAll('.govuk-error-message');
        errorSpans.forEach(errorSpan => {
            errorSpan.remove();
        });

        const errorInputs = window.document.querySelectorAll('.govuk-input--error');
        errorInputs.forEach(errorInput => {
            const inputClass = errorInput.getAttribute('class');
            errorInput.setAttribute('class', inputClass.replace('govuk-input--error', ''));
            errorInput.removeAttribute('aria-describedby');
        });

        const errorDivs = window.document.querySelectorAll('.govuk-form-group--error');
        errorDivs.forEach(errorDiv => {
            errorDiv.setAttribute('class', 'govuk-form-group');
        });
    }

    function removeAddressSearchElements() {
        addressSearchDiv.remove();
        const hintTextDiv = window.document.getElementById('fill-out-the-fields-manually-hint');
        hintTextDiv.remove();
        const addressSearchButton = window.document.getElementById('search-button');
        addressSearchButton.remove();
        const addressSearchResults = window.document.getElementById('address-search-results');
        addressSearchResults.remove();
    }

    function displayErrors(message) {
        displayErrorSummary(message);
        if (message !== apiNoAddressesFoundErrorMessage) {
            displayFieldErrors(message);
        }
        searchResultsDiv.style.display = 'none';
        clearAddressResultsDropdown();
        const pageErrorTitle = `Error: ${window.document.title}`;
        // eslint-disable-next-line no-param-reassign
        window.document.title = pageErrorTitle;
    }

    // A simple postcode regular expression, or postcode regex, checks the general shape of the postcode is correct. i.e.
    // Is the string between 5 to 7 characters?
    // Is the inward code first character numeric?
    // Are the last 2 characters non-numeric?
    // removes all whitespace, before, after, within as the OS-places api will handle that
    function isValidPostcode(postcode) {
        const regex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i;
        return regex.test(postcode.replace(/\s/g, ''));
    }

    async function addressSearch() {
        removeErrorMessages();
        clearAddressForm();
        const addressSearchInputValue = addressSearchInput.value;

        if (addressSearchInputValue === '') {
            displayErrors(emptySearchInputErrorMessage);
            return;
        }

        // test for a valid postcode
        if (!isValidPostcode(addressSearchInputValue)) {
            displayErrors(INVALID_POSTCODE_ERROR);
            return;
        }

        const response = await fetch(
            `/address-finder/postcode?postcode=${addressSearchInputValue}`
        );
        if (!response.ok) {
            if (response.status === 400) {
                displayErrors(INVALID_POSTCODE_ERROR);
                return;
            }
            displayErrors(apiResponseNotOkErrorMessage);
            removeAddressSearchElements();
            return;
        }

        const data = await response.json();

        if (data.header.totalresults === 0 || !data.results) {
            displayErrors(apiNoAddressesFoundErrorMessage);
            return;
        }

        addSearchResultsToSelectElement(data);
    }

    function createContentElements() {
        const descriptionDiv = window.document.createElement('div');
        descriptionDiv.appendChild(
            window.document.createTextNode(
                'Enter a UK postcode to search for and select an address. Or, you can enter the address manually.'
            )
        );
        descriptionDiv.setAttribute('id', 'fill-out-the-fields-manually-hint');
        descriptionDiv.setAttribute('class', 'govuk-hint');
        window.document
            .querySelector('.govuk-form-group')
            .insertAdjacentElement('beforeBegin', descriptionDiv);
    }

    function createPostcodeSearchElements() {
        const addressSearchLabelContent = window.document.createTextNode('Postcode');

        const addressSearchLabel = window.document.createElement('label');
        addressSearchLabel.appendChild(addressSearchLabelContent);
        addressSearchLabel.setAttribute('class', 'govuk-label');
        addressSearchLabel.setAttribute('for', 'address-search-input');

        addressSearchInput = window.document.createElement('input');
        addressSearchInput.setAttribute('class', 'govuk-input govuk-input--width-10');
        addressSearchInput.setAttribute('id', 'address-search-input');
        addressSearchInput.setAttribute('name', 'address-search-input');
        addressSearchInput.setAttribute('type', 'search');
        addressSearchInput.setAttribute('autocomplete', 'postal-code');

        addressSearchInput.addEventListener('keypress', event => {
            if (event.code === 'Enter') {
                event.preventDefault();
                window.document.getElementById('search-button').click();
            }
        });

        addressSearchDiv = window.document.createElement('div');
        addressSearchDiv.setAttribute('id', 'address-search');
        addressSearchDiv.setAttribute('class', 'govuk-form-group');
        addressSearchDiv.appendChild(addressSearchLabel);
        addressSearchDiv.appendChild(addressSearchInput);

        window.document
            .getElementById('fill-out-the-fields-manually-hint')
            .insertAdjacentElement('afterend', addressSearchDiv);
    }

    function createFindAddressButton() {
        const searchButton = window.document.createElement('button');
        searchButton.setAttribute('id', 'search-button');
        searchButton.setAttribute(
            'class',
            'govuk-button govuk-button--secondary ga-event ga-event--click'
        );
        searchButton.setAttribute('data-module', 'govuk-button');
        searchButton.setAttribute('type', 'button');
        searchButton.setAttribute('data-tracking-label', 'Find address');
        searchButton.setAttribute('data-tracking-category', 'button');
        searchButton.appendChild(window.document.createTextNode('Find address'));
        window.document
            .getElementById('address-search')
            .insertAdjacentElement('afterend', searchButton);

        searchButton.addEventListener('click', addressSearch);
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

        searchResultsDiv = window.document.createElement('div');
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

    function addRemovePostcodeInputTextOnSubmitHandler() {
        const form = window.document.getElementsByTagName('form')[0];
        form.addEventListener('submit', () => {
            addressSearchInput.removeAttribute('name');
            window.document
                .getElementById('address-search-results-dropdown')
                .removeAttribute('name');
        });
    }

    function setContextualisationMessages() {
        const h1TextContent = window.document.querySelector('h1').textContent;

        let pageContext = 'the';
        if (h1TextContent.includes('their') || h1TextContent.includes('your')) {
            pageContext = h1TextContent.includes('their') ? 'their' : 'your';
        }

        apiNoAddressesFoundErrorMessage = `We could not find any addresses for that postcode. Check ${pageContext} postcode is correct, or enter ${pageContext} address manually.`;
        apiResponseNotOkErrorMessage = `The system is experiencing an issue. Enter ${pageContext} address manually.`;
        emptySearchInputErrorMessage = `Enter ${pageContext} postcode`;
    }

    function init() {
        if (window.document.querySelector('[id *= "building-and-street"]') === null) {
            return;
        }
        createContentElements();
        createPostcodeSearchElements();
        createFindAddressButton();
        createSearchResultsElements();
        addRemovePostcodeInputTextOnSubmitHandler();
        setContextualisationMessages();
    }

    return Object.freeze({
        init
    });
}

export default createPostcodeLookup;
