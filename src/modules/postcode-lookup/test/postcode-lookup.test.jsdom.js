import createPostcodeLookup from '../index';
import {victimAddressHtml, postcodeLookupHtmlEnhanced} from './fixtures/postcode-lookup-html';
import {
    addressSearchThreeAddressesFoundResponse,
    addressSearchOneAddressFoundResponse
} from './fixtures/validAddressCollectionResponse';

/* eslint-disable import/no-extraneous-dependencies */
require('jest-fetch-mock').enableMocks();

describe('postcode lookup progressive enhancement', () => {
    describe('adding postcode elements to a page', () => {
        let postcodeLookup;

        beforeEach(() => {
            window.document.body.innerHTML = victimAddressHtml;
            postcodeLookup = createPostcodeLookup(window);
        });

        describe('on page load', () => {
            it('Should add the postcode lookup html when the page contains victim building and street question', async () => {
                await postcodeLookup.init();
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
            it('Should not add the postcode lookup when the page contains a mainapplicant address', async () => {
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
                await postcodeLookup.init();
                expect(
                    window.document.getElementById('fill-out-the-fields-manually-hint')
                ).toBeNull();
            });
            it('Should not add the postcode lookup when the page contains a rep address', async () => {
                window.document.body.innerHTML = `<fieldset class="govuk-fieldset">
                <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
                <h1 class="govuk-fieldset__heading">
                Your address
                </h1>
                </legend>

                <div class="govuk-form-group">
                <label class="govuk-label" for="q-rep-building-and-street">
                Building and street
                </label>
                <input class="govuk-input" id="q-rep-building-and-street" name="q-rep-building-and-street"
                type="text" autocomplete="address-line1">
                </div>
                </fieldset>`;
                postcodeLookup = createPostcodeLookup(window);
                await postcodeLookup.init();
                expect(
                    window.document.getElementById('fill-out-the-fields-manually-hint')
                ).toBeNull();
            });
            it('Should not add the postcode lookup when the page contains a gp address', async () => {
                window.document.body.innerHTML = `<fieldset class="govuk-fieldset">
                <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
                <h1 class="govuk-fieldset__heading">
                What is the GP's address?
                </h1>
                </legend>

                <div class="govuk-form-group">
                <label class="govuk-label" for="q-rep-building-and-street">
                Building and street
                </label>
                <input class="govuk-input" id="q-rep-building-and-street" name="q-rep-building-and-street"
                type="text" autocomplete="address-line1">
                </div>
                </fieldset>`;
                postcodeLookup = createPostcodeLookup(window);
                await postcodeLookup.init();
                expect(
                    window.document.getElementById('fill-out-the-fields-manually-hint')
                ).toBeNull();
            });
            it('Should not add the postcode lookup when the page contains a dentist address', async () => {
                window.document.body.innerHTML = `<fieldset class="govuk-fieldset">
                <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
                <h1 class="govuk-fieldset__heading">
                What is the dentist's address?
                </h1>
                </legend>

                <div class="govuk-form-group">
                <label class="govuk-label" for="q-applicant-dentist-address-building-and-street">
                Building and street
                </label>
                <input class="govuk-input" id="q-applicant-dentist-address-building-and-street" name="q-applicant-dentist-address-building-and-street"
                type="text" autocomplete="address-line1">
                </div>
                </fieldset>`;
                postcodeLookup = createPostcodeLookup(window);
                await postcodeLookup.init();
                expect(
                    window.document.getElementById('fill-out-the-fields-manually-hint')
                ).toBeNull();
            });
            it('Should not add the postcode lookup when the page contains a treatment address', async () => {
                window.document.body.innerHTML = `<fieldset class="govuk-fieldset">
                <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
                <h1 class="govuk-fieldset__heading">
                Where did you have treatment?
                </h1>
                </legend>

                <div class="govuk-form-group">
                <label class="govuk-label" for="q-applicant-treatment-building-and-street">
                Building and street
                </label>
                <input class="govuk-input" id="q-applicant-treatment-building-and-street" name="q-applicant-treatment-building-and-street"
                type="text" autocomplete="address-line1">
                </div>
                </fieldset>`;
                postcodeLookup = createPostcodeLookup(window);
                await postcodeLookup.init();
                expect(
                    window.document.getElementById('fill-out-the-fields-manually-hint')
                ).toBeNull();
            });
        });
        describe('on postcode lookup find address button simulated click', () => {
            describe('200', () => {
                it('Should return 3 results for valid postcode', async () => {
                    fetch.mockResponse(async () => {
                        return JSON.stringify(addressSearchThreeAddressesFoundResponse);
                    });

                    await postcodeLookup.init();
                    await postcodeLookup.addressSearch();

                    expect(
                        window.document.getElementById('address-search-results-dropdown')[0].text
                    ).toEqual('3 addresses found');

                    expect(
                        window.document.getElementById('address-search-results-dropdown')[1].text
                    ).toEqual('2, FOOR ROAD, LARBAR, FOOARTH, FO12 3BA');

                    expect(
                        window.document.getElementById('address-search-results-dropdown')[2].text
                    ).toEqual('BARUFOO, FOOR ROAD, LARBAR, FOOARTH, FO12 3BA');

                    expect(
                        window.document.getElementById('address-search-results-dropdown')[3].text
                    ).toEqual('CHURCH HOUSE, FOOR ROAD, LARBAR, FOOARTH, FO12 3BA');
                });
                it('Should return 1 results for valid postcode', async () => {
                    fetch.mockResponse(async () => {
                        return JSON.stringify(addressSearchOneAddressFoundResponse);
                    });

                    await postcodeLookup.init();
                    await postcodeLookup.addressSearch();
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

                    await postcodeLookup.init();
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

                    await postcodeLookup.init();
                    expect.assertions(1);
                    await expect(postcodeLookup.addressSearch()).rejects.toEqual(
                        'TBC API Error Status error handling.'
                    );
                });
            });
        });
    });
});
