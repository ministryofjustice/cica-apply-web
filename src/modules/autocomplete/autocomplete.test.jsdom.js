/* globals document */
import {createAutocomplete} from './autocomplete';

describe('autoComplete.js', () => {
    describe('autoComplete helper funtions', () => {
        const autoComplete = createAutocomplete();
        describe('inputValueTemplate', () => {
            it('Should return the name given a valid result', () => {
                const result = {name: 'result-name', value: 10001};

                const actual = autoComplete.inputValueTemplate(result);
                expect(actual).toEqual('result-name');
            });

            it('Should return the name given a valid string', () => {
                const result = 'result-name';

                const actual = autoComplete.inputValueTemplate(result);
                expect(actual).toEqual('result-name');
            });
        });

        describe('suggestionTemplate', () => {
            it('Should return a string containing the name given a valid result', () => {
                const result = {name: 'result-name', value: 10001};

                const actual = autoComplete.suggestionTemplate(result);
                expect(actual).toEqual(`<strong>result-name</strong>`);
            });

            it('Should return a string containing the name given a valid string', () => {
                const result = 'result-name';

                const actual = autoComplete.suggestionTemplate(result);
                expect(actual).toEqual(`<strong>result-name</strong>`);
            });
        });

        describe('onConfirm', () => {
            window.document.body.innerHTML = `
                <div>
                    <select id="dropdown-menu" class="govuk-select">
                        <option value="">Default</option>
                        <option value="2">Item 2</option>
                        <option value="3">Item 3</option>
                        <option value="4">Item 4</option>
                        <option value="5">Item 5</option>
                    </select>
                </div>
                `;
            it('Should set the dropdown to the result', () => {
                // eslint-disable-next-line no-shadow
                const autoComplete = createAutocomplete(window);
                autoComplete.onConfirm({code: '2'});
                expect(window.document.querySelector("[value='2']").selected).toEqual(true);
            });

            it('Should set the dropdown to the blank string value if there is no result the result', () => {
                // eslint-disable-next-line no-shadow
                const autoComplete = createAutocomplete(window);
                autoComplete.onConfirm();
                expect(window.document.querySelector("[value='']").selected).toEqual(true);
            });
        });

        describe('htmlCollectionToArray', () => {
            it('Should transform an array-like collection of HTMLElements into an array', () => {
                document.body.innerHTML = `<label for="dropdown-menu">Dropdown</label>
                    <select id="dropdown-menu" class="govuk-dropdown">
                        <option value="1">Item 1</option>
                        <option value="2">Item 2</option>
                        <option value="3">Item 3</option>
                        <option value="4">Item 4</option>
                        <option value="5">Item 5</option>
                    </select>`;
                const selectElement = document.querySelector('#dropdown-menu');

                const actual = autoComplete.htmlCollectionToArray(selectElement);
                expect(typeof actual).toBeDefined();
                expect(typeof actual).toEqual('object');
                expect(actual.length).toEqual(5);
            });
        });

        describe('formatResults', () => {
            it('Should transform an array of option elements to an array of result objects', () => {
                document.body.innerHTML = `<label for="dropdown-menu">Dropdown</label>
                    <select id="dropdown-menu" class="govuk-dropdown">
                        <option value="101">Item 1</option>
                        <option value="102">Item 2</option>
                        <option value="103">Item 3</option>
                        <option value="104">Item 4</option>
                        <option value="105">Item 5</option>
                    </select>`;

                const selectElement = document.querySelector('#dropdown-menu');
                const resultArray = autoComplete.htmlCollectionToArray(selectElement);

                const actual = autoComplete.formatResults(resultArray);
                expect(typeof actual).toBeDefined();
                expect(typeof actual).toEqual('object');
                expect(actual.length).toEqual(5);
                expect(actual).toContainEqual({code: '101', name: 'Item 1'});
                expect(actual).toContainEqual({code: '102', name: 'Item 2'});
                expect(actual).toContainEqual({code: '103', name: 'Item 3'});
                expect(actual).toContainEqual({code: '104', name: 'Item 4'});
                expect(actual).toContainEqual({code: '105', name: 'Item 5'});
            });
        });
    });

    describe('init', () => {
        it('Should not fail if it cannot find a drop down', () => {
            window.document.body.innerHTML = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Title</title>
                </head>
                <body>
                <div>
                    <select class="govuk-select" id="q-police-force-id-select" name="q-police-force-id">
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
