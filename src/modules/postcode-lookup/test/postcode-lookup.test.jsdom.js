import {setTimeout} from 'timers/promises';
import createPostcodeLookup from '../index';
import {victimAddressHtml, postcodeLookupHtmlEnhanced} from './fixtures/postcode-lookup-html';
import {
    addressSearchCollectionResponse,
    addressSearchOneAddressFoundResponse
} from './fixtures/validAddressCollectionResponse';

/* eslint-disable import/no-extraneous-dependencies */
require('jest-fetch-mock').enableMocks();

function addressSelectionIndexFinder(selectionText) {
    const elementToSelect = Array.from(
        window.document.querySelectorAll('#address-search-results-dropdown option')
    ).find(option => option.text === selectionText);

    return +elementToSelect.value + 1;
}

describe('postcode lookup progressive enhancement', () => {
    let postcodeLookup;

    beforeEach(() => {
        window.document.body.innerHTML = victimAddressHtml;
        postcodeLookup = createPostcodeLookup(window);
    });
    describe('adding postcode elements to a page', () => {
        describe('on page load', () => {
            it('Should add the postcode lookup html when the page contains victim building and street question', async () => {
                postcodeLookup.init();
                expect(window.document.body.innerHTML.replace(/[\n\r]/g, '')).toBe(
                    postcodeLookupHtmlEnhanced.replace(/[\n\r]/g, '')
                );
                expect(
                    window.document.getElementById('fill-out-the-fields-manually-hint')
                ).toBeDefined();
            });
            it('Should not fail when the page does not contain address elements', async () => {
                window.document.body.innerHTML = `<label for="dropdown-menu">Dropdown</label>
                <select id="dropdown-menu" class="govuk-select">
                    <option value="">Item 1</option>
                    <option value="2">Item 2</option>
                    <option value="3">Item 3</option>
                    <option value="4">Item 4</option>
                    <option value="5">Item 5</option>
                </select>`;
                postcodeLookup = createPostcodeLookup(window);
                postcodeLookup.init();
                expect(
                    window.document.getElementById('fill-out-the-fields-manually-hint')
                ).toBeNull();
            });
            it('Should not add the postcode lookup when the page does not conatin the correct address fields', async () => {
                window.document.body.innerHTML = `<fieldset class="govuk-fieldset">
                <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
                <h1 class="govuk-fieldset__heading">
                Your address
                </h1>
                </legend>

                <div class="govuk-form-group">
                <label class="govuk-label" for=q-mainapplicant-building-and-street">
                Building and street
                </label>
                <input class="govuk-input" id="q-mainapplicant-building-and-street" name="q-mainapplicant-building-and-street"
                type="text" autocomplete="address-line1">
                </div>
                </fieldset>`;
                postcodeLookup = createPostcodeLookup(window);
                postcodeLookup.init();
                expect(
                    window.document.getElementById('fill-out-the-fields-manually-hint')
                ).toBeNull();
            });
        });
    });
    describe('clicking postcode lookup find address button', () => {
        describe('200', () => {
            it('Should return all results for valid postcode and set focus to the results dropdown', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchCollectionResponse);
                });

                postcodeLookup.init();
                window.document.getElementById('search-button').click();
                await setTimeout(0);

                expect(
                    window.document.getElementById('address-search-results-dropdown')[0].text
                ).toEqual('8 addresses found');
                expect(window.document.activeElement.id).toEqual('address-search-results-dropdown');
            });
            it('Should return 1 results for valid postcode', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchOneAddressFoundResponse);
                });

                postcodeLookup.init();
                window.document.getElementById('search-button').click();
                await setTimeout(0);
                expect(
                    window.document.getElementById('address-search-results-dropdown')[0].text
                ).toEqual('1 address found');

                expect(
                    window.document.getElementById('address-search-results-dropdown')[1].text
                ).toEqual('2, FOOR ROAD, LARBAR, FOOARTH, FO12 3BA');
            });
            // TODO further analyis on Error handling
            it('promise rejected when no results found for valid postcode', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify({
                        header: {
                            uri: 'https://api.os.uk/search/places/v1/postcode?postcode=A123AB',
                            query: 'postcode=A123AB',
                            offset: 0,
                            totalresults: 0,
                            format: 'JSON',
                            dataset: 'DPA',
                            lr: 'EN,CY',
                            maxresults: 100,
                            epoch: '97',
                            lastupdate: '2022-11-17',
                            output_srs: 'EPSG:27700'
                        }
                    });
                });

                postcodeLookup.init();
                expect.assertions(1);
                await expect(postcodeLookup.addressSearch()).rejects.toEqual(
                    'TBC No matching results found.'
                );
            });
        });
        describe('4XX', () => {
            it('promise rejected when the os-api returns a 400 status code', async () => {
                fetch.mockResponseOnce('{}', {
                    status: 400,
                    headers: {'content-type': 'application/json'}
                });

                postcodeLookup.init();
                expect.assertions(1);
                await expect(postcodeLookup.addressSearch()).rejects.toEqual(
                    'TBC API Error Status error handling.'
                );
            });
        });
    });
    describe('pressing a key on postcode lookup find input field', () => {
        describe('Pressing enter for valid postcode', () => {
            it('Should return all results for valid postcode and set focus to the results dropdown', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchCollectionResponse);
                });

                postcodeLookup.init();

                // eslint-disable-next-line
                const event = new KeyboardEvent('keypress', {
                    code: 'Enter'
                });

                window.document.getElementById('address-search-input').dispatchEvent(event);
                await setTimeout(0);

                const searchResultsDropDown = window.document.getElementById(
                    'address-search-results-dropdown'
                );
                expect(searchResultsDropDown[0].text).toContain('addresses found');
            });
        });
        describe('Pressing any other key for valid postcode', () => {
            it('Should do nothing', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchCollectionResponse);
                });

                postcodeLookup.init();

                // eslint-disable-next-line
                const event = new KeyboardEvent('keypress', {
                    code: 'SomethingElse'
                });

                window.document.getElementById('address-search-input').dispatchEvent(event);
                await setTimeout(0);

                const searchResultsDiv = window.document.getElementById('address-search-results');
                expect(searchResultsDiv.style.display).toBe('none');
                const searchResultsDropDown = window.document.getElementById(
                    'address-search-results-dropdown'
                );
                expect(searchResultsDropDown[0]).not.toBeDefined();
            });
        });
    });
    describe('selecting an option from the search results drop down', () => {
        describe('selection contains sub building name', () => {
            it('maps to correct fields when building name contains number and letter suffix', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchCollectionResponse);
                });
                postcodeLookup.init();
                window.document.getElementById('search-button').click();
                await setTimeout(0);

                const searchResultsDropDown = window.document.getElementById(
                    'address-search-results-dropdown'
                );
                expect(searchResultsDropDown[0].text).toContain('addresses found');

                const selectionIndex = addressSelectionIndexFinder(
                    'FLAT B, 41A, FOOBAR DRIVE, FOOTOWN, B41 2FO'
                );
                searchResultsDropDown.selectedIndex = selectionIndex;
                searchResultsDropDown.selectedIndex = searchResultsDropDown.dispatchEvent(
                    new Event('change')
                );
                expect(searchResultsDropDown[selectionIndex].text).toEqual(
                    'FLAT B, 41A, FOOBAR DRIVE, FOOTOWN, B41 2FO'
                );

                expect(
                    window.document.getElementById('q-applicant-building-and-street').value
                ).toBe('FLAT B');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-2').value
                ).toBe('41A FOOBAR DRIVE');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-3').value
                ).toBe('');
                expect(window.document.getElementById('q-applicant-town-or-city').value).toBe(
                    'FOOTOWN'
                );
                expect(window.document.getElementById('q-applicant-county').value).toBe(
                    'CITY OF FOOTOWN'
                );
                expect(window.document.getElementById('q-applicant-postcode').value).toBe(
                    'B41 2FO'
                );
            });
            it('maps to correct fields when building name contains number range', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchCollectionResponse);
                });
                postcodeLookup.init();
                window.document.getElementById('search-button').click();
                await setTimeout(0);

                const searchResultsDropDown = window.document.getElementById(
                    'address-search-results-dropdown'
                );
                expect(searchResultsDropDown[0].text).toContain('addresses found');

                const selectionIndex = addressSelectionIndexFinder(
                    'CARETAKERS FLAT, 110-114, FOO STREET WEST, BARTOL, A12 2FO'
                );
                searchResultsDropDown.selectedIndex = selectionIndex;
                searchResultsDropDown.dispatchEvent(new Event('change'));

                expect(searchResultsDropDown[selectionIndex].text).toEqual(
                    'CARETAKERS FLAT, 110-114, FOO STREET WEST, BARTOL, A12 2FO'
                );

                expect(
                    window.document.getElementById('q-applicant-building-and-street').value
                ).toBe('CARETAKERS FLAT');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-2').value
                ).toBe('110-114 FOO STREET WEST');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-3').value
                ).toBe('');
                expect(window.document.getElementById('q-applicant-town-or-city').value).toBe(
                    'BARTOL'
                );
                expect(window.document.getElementById('q-applicant-county').value).toBe(
                    'CITY OF FOOTOWN'
                );
                expect(window.document.getElementById('q-applicant-postcode').value).toBe(
                    'A12 2FO'
                );
            });
            it('maps to the correct fields when building name does not contain number and letter suffix or number range', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchCollectionResponse);
                });
                postcodeLookup.init();
                window.document.getElementById('search-button').click();
                await setTimeout(0);

                const searchResultsDropDown = window.document.getElementById(
                    'address-search-results-dropdown'
                );
                expect(searchResultsDropDown[0].text).toContain('addresses found');

                const selectionIndex = addressSelectionIndexFinder(
                    'FLAT 3, BARWOOD, 7, ST. FOOBAR STREET, ST. FIVES, FO26 1BA'
                );
                searchResultsDropDown.selectedIndex = selectionIndex;
                searchResultsDropDown.dispatchEvent(new Event('change'));

                expect(searchResultsDropDown[selectionIndex].text).toEqual(
                    'FLAT 3, BARWOOD, 7, ST. FOOBAR STREET, ST. FIVES, FO26 1BA'
                );

                expect(
                    window.document.getElementById('q-applicant-building-and-street').value
                ).toBe('FLAT 3');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-2').value
                ).toBe('BARWOOD');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-3').value
                ).toBe('7 ST. FOOBAR STREET');
                expect(window.document.getElementById('q-applicant-town-or-city').value).toBe(
                    'ST. FIVES'
                );
                expect(window.document.getElementById('q-applicant-county').value).toBe('CORNFOO');
                expect(window.document.getElementById('q-applicant-postcode').value).toBe(
                    'FO26 1BA'
                );
            });
        });
        describe('selection contains no sub building name', () => {
            it('maps to the correct address when building name does not contain letters and numbers', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchCollectionResponse);
                });
                postcodeLookup.init();
                window.document.getElementById('search-button').click();
                await setTimeout(0);

                const searchResultsDropDown = window.document.getElementById(
                    'address-search-results-dropdown'
                );
                expect(searchResultsDropDown[0].text).toContain('addresses found');

                const selectionIndex = addressSelectionIndexFinder(
                    'CHURCH HOUSE, FOOR ROAD, LARBAR, FOOARTH, FO12 3BA'
                );
                searchResultsDropDown.selectedIndex = selectionIndex;
                searchResultsDropDown.dispatchEvent(new Event('change'));

                expect(searchResultsDropDown[selectionIndex].text).toEqual(
                    'CHURCH HOUSE, FOOR ROAD, LARBAR, FOOARTH, FO12 3BA'
                );

                expect(
                    window.document.getElementById('q-applicant-building-and-street').value
                ).toBe('CHURCH HOUSE');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-2').value
                ).toBe('FOOR ROAD');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-3').value
                ).toBe('LARBAR');
                expect(window.document.getElementById('q-applicant-town-or-city').value).toBe(
                    'FOOARTH'
                );
                expect(window.document.getElementById('q-applicant-county').value).toBe(
                    'BALE OF FOOMORGBAR'
                );
                expect(window.document.getElementById('q-applicant-postcode').value).toBe(
                    'FO12 3BA'
                );
            });

            it('maps to the correct address fields when building number and thouroughfare present', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchCollectionResponse);
                });
                postcodeLookup.init();
                window.document.getElementById('search-button').click();
                await setTimeout(0);

                const searchResultsDropDown = window.document.getElementById(
                    'address-search-results-dropdown'
                );
                expect(searchResultsDropDown[0].text).toContain('addresses found');

                const selectionIndex = addressSelectionIndexFinder(
                    '0/1, 55, FOOBAR DRIVE, FOOTOWN, A12 2BC'
                );
                searchResultsDropDown.selectedIndex = selectionIndex;
                searchResultsDropDown.dispatchEvent(new Event('change'));
                expect(searchResultsDropDown[selectionIndex].text).toEqual(
                    '0/1, 55, FOOBAR DRIVE, FOOTOWN, A12 2BC'
                );
                expect(
                    window.document.getElementById('q-applicant-building-and-street').value
                ).toBe('0/1');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-2').value
                ).toBe('55 FOOBAR DRIVE');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-3').value
                ).toBe('');
                expect(window.document.getElementById('q-applicant-town-or-city').value).toBe(
                    'FOOTOWN'
                );
                expect(window.document.getElementById('q-applicant-county').value).toBe('FOOBURGH');
                expect(window.document.getElementById('q-applicant-postcode').value).toBe(
                    'A12 2BC'
                );
            });
            it('maps to the correct address fields when a PO Box is present', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchCollectionResponse);
                });
                postcodeLookup.init();
                window.document.getElementById('search-button').click();
                await setTimeout(0);

                const searchResultsDropDown = window.document.getElementById(
                    'address-search-results-dropdown'
                );
                expect(searchResultsDropDown[0].text).toContain('addresses found');

                const selectionIndex = addressSelectionIndexFinder(
                    'PO BOX 12345, FOO COMPANY, FOOBURGH, AB12 3CD'
                );
                searchResultsDropDown.selectedIndex = selectionIndex;
                searchResultsDropDown.dispatchEvent(new Event('change'));
                expect(searchResultsDropDown[selectionIndex].text).toEqual(
                    'PO BOX 12345, FOO COMPANY, FOOBURGH, AB12 3CD'
                );
                expect(
                    window.document.getElementById('q-applicant-building-and-street').value
                ).toBe('PO BOX 12345');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-2').value
                ).toBe('FOO COMPANY');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-3').value
                ).toBe('');
                expect(window.document.getElementById('q-applicant-town-or-city').value).toBe(
                    'FOOBURGH'
                );
                expect(window.document.getElementById('q-applicant-county').value).toBe('FOOBURGH');
                expect(window.document.getElementById('q-applicant-postcode').value).toBe(
                    'AB12 3CD'
                );
            });
            it('maps to the correct address fields when a dependent thouroughfare name', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchCollectionResponse);
                });
                postcodeLookup.init();
                window.document.getElementById('search-button').click();
                await setTimeout(0);

                const searchResultsDropDown = window.document.getElementById(
                    'address-search-results-dropdown'
                );
                expect(searchResultsDropDown[0].text).toContain('addresses found');

                const selectionIndex = addressSelectionIndexFinder(
                    '1, FOOBAR VIEW, BAR ROAD, FOOBARHALL, FOOBARHAM, FB17 1BO'
                );
                searchResultsDropDown.selectedIndex = selectionIndex;
                searchResultsDropDown.dispatchEvent(new Event('change'));
                expect(searchResultsDropDown[selectionIndex].text).toEqual(
                    '1, FOOBAR VIEW, BAR ROAD, FOOBARHALL, FOOBARHAM, FB17 1BO'
                );
                expect(
                    window.document.getElementById('q-applicant-building-and-street').value
                ).toBe('1 FOOBAR VIEW');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-2').value
                ).toBe('BAR ROAD');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-3').value
                ).toBe('FOOBARHALL');
                expect(window.document.getElementById('q-applicant-town-or-city').value).toBe(
                    'FOOBARHAM'
                );
                expect(window.document.getElementById('q-applicant-county').value).toBe(
                    'EAST FOOBAR'
                );
                expect(window.document.getElementById('q-applicant-postcode').value).toBe(
                    'FB17 1BO'
                );
            });
        });

        describe('selection contains building number and thouroughfare only', () => {
            it('maps to the correct address fields when building number and thouroughfare present', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchCollectionResponse);
                });
                postcodeLookup.init();
                window.document.getElementById('search-button').click();
                await setTimeout(0);

                const searchResultsDropDown = window.document.getElementById(
                    'address-search-results-dropdown'
                );
                expect(searchResultsDropDown[0].text).toContain('addresses found');

                const selectionIndex = addressSelectionIndexFinder(
                    '1, FOOBAR DRIVE, FOOTOWN, A12 2BC'
                );
                searchResultsDropDown.selectedIndex = selectionIndex;
                searchResultsDropDown.dispatchEvent(new Event('change'));
                expect(searchResultsDropDown[selectionIndex].text).toEqual(
                    '1, FOOBAR DRIVE, FOOTOWN, A12 2BC'
                );
                expect(
                    window.document.getElementById('q-applicant-building-and-street').value
                ).toBe('1 FOOBAR DRIVE');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-2').value
                ).toBe('');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-3').value
                ).toBe('');
                expect(window.document.getElementById('q-applicant-town-or-city').value).toBe(
                    'FOOTOWN'
                );
                expect(window.document.getElementById('q-applicant-county').value).toBe(
                    'CITY OF FOOBAR'
                );
                expect(window.document.getElementById('q-applicant-postcode').value).toBe(
                    'A12 2BC'
                );
            });
        });
        describe('selection contains organisation name', () => {
            it('maps to the correct address fields', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchCollectionResponse);
                });
                postcodeLookup.init();
                window.document.getElementById('search-button').click();
                await setTimeout(0);

                const searchResultsDropDown = window.document.getElementById(
                    'address-search-results-dropdown'
                );
                expect(searchResultsDropDown[0].text).toContain('addresses found');

                const selectionIndex = addressSelectionIndexFinder(
                    'BRIGHTERFOO HOME, CLAREBAR COURT, 234, FOO ROAD, FOOTOWN, F11 7BA'
                );
                searchResultsDropDown.selectedIndex = selectionIndex;
                searchResultsDropDown.dispatchEvent(new Event('change'));

                expect(searchResultsDropDown[selectionIndex].text).toEqual(
                    'BRIGHTERFOO HOME, CLAREBAR COURT, 234, FOO ROAD, FOOTOWN, F11 7BA'
                );

                expect(
                    window.document.getElementById('q-applicant-building-and-street').value
                ).toBe('BRIGHTERFOO HOME');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-2').value
                ).toBe('CLAREBAR COURT');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-3').value
                ).toBe('234 FOO ROAD');
                expect(window.document.getElementById('q-applicant-town-or-city').value).toBe(
                    'FOOTOWN'
                );
                expect(window.document.getElementById('q-applicant-county').value).toBe(
                    'CITY OF FOOBAR'
                );
                expect(window.document.getElementById('q-applicant-postcode').value).toBe(
                    'F11 7BA'
                );
            });
        });
        describe('selection contains address header', () => {
            it('does nothing, no state is changed, no errors are thrown', async () => {
                fetch.mockResponse(async () => {
                    return JSON.stringify(addressSearchCollectionResponse);
                });
                postcodeLookup.init();
                window.document.getElementById('search-button').click();
                await setTimeout(0);

                const searchResultsDropDown = window.document.getElementById(
                    'address-search-results-dropdown'
                );
                expect(searchResultsDropDown[0].text).toContain('addresses found');

                searchResultsDropDown.value = '8 addresses found';
                searchResultsDropDown.dispatchEvent(new Event('change'));

                expect(searchResultsDropDown.value).toEqual('8 addresses found');

                expect(
                    window.document.getElementById('q-applicant-building-and-street').value
                ).toBe('');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-2').value
                ).toBe('');
                expect(
                    window.document.getElementById('q-applicant-building-and-street-3').value
                ).toBe('');
                expect(window.document.getElementById('q-applicant-town-or-city').value).toBe('');
                expect(window.document.getElementById('q-applicant-county').value).toBe('');
                expect(window.document.getElementById('q-applicant-postcode').value).toBe('');
            });
        });
    });
});
