import createPostcodeLookup from './index';
import {victimAddressHtml, postcodeLookupHtmlEnhanced} from './test/fixtures/postcode-lookup-html';

describe('postcode lookup progressive enhancement', () => {
    describe('adding postcode elements to a page', () => {
        let postcodeLookup;

        beforeEach(() => {
            window.document.body.innerHTML = victimAddressHtml;
            postcodeLookup = createPostcodeLookup(window);
        });

        describe('on page load', () => {
            it('Should add the postcode lookup html when the page contains victim building and street question', () => {
                postcodeLookup.init();
                expect(window.document.body.innerHTML.replace(/[\n\r]/g, '')).toBe(
                    postcodeLookupHtmlEnhanced.replace(/[\n\r]/g, '')
                );
                expect(
                    window.document.querySelector('fill-out-the-fields-manually-hint')
                ).toBeDefined();
            });
            it('Should not fail when the page does not contain address elements', () => {
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
                    window.document.querySelector('fill-out-the-fields-manually-hint')
                ).toBeNull();
            });
            it('Should not add the postcode lookup when the page contains a rep address', () => {
                window.document.body.innerHTML = `<<fieldset class="govuk-fieldset">
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
                postcodeLookup.init();
                expect(
                    window.document.querySelector('fill-out-the-fields-manually-hint')
                ).toBeNull();
            });
            it('Should not add the postcode lookup when the page contains a gp address', () => {
                window.document.body.innerHTML = `<<fieldset class="govuk-fieldset">
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
                postcodeLookup.init();
                expect(
                    window.document.querySelector('fill-out-the-fields-manually-hint')
                ).toBeNull();
            });
            it('Should not add the postcode lookup when the page contains a dentist address', () => {
                window.document.body.innerHTML = `<<fieldset class="govuk-fieldset">
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
                postcodeLookup.init();
                expect(
                    window.document.querySelector('fill-out-the-fields-manually-hint')
                ).toBeNull();
            });
            it('Should not add the postcode lookup when the page contains a treatment address', () => {
                window.document.body.innerHTML = `<<fieldset class="govuk-fieldset">
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
                postcodeLookup.init();
                expect(
                    window.document.querySelector('fill-out-the-fields-manually-hint')
                ).toBeNull();
            });
        });
        describe('on postcode lookup find address button click', () => {
            it('Should call the os-api to retrieve results', () => {
                postcodeLookup.init();
                expect(
                    window.document.querySelector('fill-out-the-fields-manually-hint')
                ).toBeNull();
            });
        });
    });
});
