import createAutocomplete from './autocomplete';

describe('autoComplete.js', () => {
    describe('init', () => {
        it('Should initialise an enhanced autocomplete drop down using a DOM element', () => {
            window.document.body.innerHTML = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Title</title>
                    </head>
                    <body>
                        <div>
                            <select class="govuk-select" id="q-police-force-id" name="q-police-force-id">
                                <option value="">Select police force</option>
                                <option value="10000033">Avon And Somerset Constabulary</option>
                                <option value="10000035">Bedfordshire Police</option>
                                <option value="10000001">British Transport Police</option>
                            </select>
                        </div>
                    </body>
                </html>
                `;
            const autocomplete = createAutocomplete(window);
            autocomplete.init(window.document.querySelectorAll('#q-police-force-id'));
            expect(window.document.querySelector('.autocomplete__wrapper').children.length).toBe(2);
            expect(window.document.querySelector('#q-police-force-id-select')).not.toBeNull();
            expect(window.document.querySelector('#q-police-force-id').getAttribute('type')).toBe(
                'text'
            );
        });
        it('Should initialise an enhanced autocomplete drop down using a string CSS selector', () => {
            window.document.body.innerHTML = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Title</title>
                </head>
                <body>
                    <div>
                        <select class="govuk-select" id="q-police-force-id" name="q-police-force-id">
                            <option value="">Select police force</option>
                            <option value="10000033">Avon And Somerset Constabulary</option>
                            <option value="10000035">Bedfordshire Police</option>
                            <option value="10000001">British Transport Police</option>
                        </select>
                    </div>
                </body>
            </html>
            `;

            const autocomplete = createAutocomplete(window);
            autocomplete.init('#q-police-force-id');
            expect(window.document.querySelector('.autocomplete__wrapper').children.length).toBe(2);
            expect(window.document.querySelector('#q-police-force-id-select')).not.toBeNull();
            expect(window.document.querySelector('#q-police-force-id').getAttribute('type')).toBe(
                'text'
            );
        });

        it('Should not fail if it cannot find a drop down', () => {
            window.document.body.innerHTML = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Title</title>
                    </head>
                    <body>
                        <div>
                            <select class="govuk-select" id="q-police-force-id" name="q-police-force-id">
                                <option value="">Select police force</option>
                                <option value="10000033">Avon And Somerset Constabulary</option>
                                <option value="10000035">Bedfordshire Police</option>
                                <option value="10000001">British Transport Police</option>
                            </select>
                        </div>
                    </body>
                </html>
                `;

            const autocomplete = createAutocomplete(window);
            autocomplete.init(window.document.querySelectorAll('.govuk-wrong-class'));
            expect(window.document.querySelector('.govuk-select').getAttribute('style')).toBeNull();
        });
    });
});
