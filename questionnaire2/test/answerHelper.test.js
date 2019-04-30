/* eslint-disable no-prototype-builtins */
const answerFormatHelper = require('../helpers/answerHelper');
const policeLookup = require('../helpers/policeLookup');

let formattedAnswer = [];

describe('Helper tests', () => {
    describe('Answer helper', () => {
        describe('Dynamic answer formatter', () => {
            beforeAll(() => {
                const answerObject = {
                    'p--start-now': {},
                    'p-applicant-declaration': {},
                    'p-applicant-british-citizen-or-eu-national': {
                        'q-applicant-british-citizen-or-eu-national': 'true'
                    },
                    'p-applicant-are-you-18-or-over': {
                        'q-applicant-are-you-18-or-over': 'true'
                    },
                    'p-applicant-who-are-you-applying-for': {
                        'q-applicant-who-are-you-applying-for': 'myself'
                    },
                    'p-applicant-were-you-a-victim-of-sexual-assault-or-abuse': {
                        'q-applicant-were-you-a-victim-of-sexual-assault-or-abuse': true
                    },
                    'p--before-you-continue': {},
                    'p-applicant-select-the-option-that-applies-to-you': {
                        'q-applicant-option': 'opt1'
                    },
                    'p--was-the-crime-reported-to-police': {
                        'q-was-the-crime-reported-to-police': 'false'
                    },
                    'p--when-was-the-crime-reported-to-police': {
                        'q--when-was-the-crime-reported-to-police': '2019-01-01T09:55:22.130Z'
                    },
                    'p-applicant-enter-your-name': {
                        'q-applicant-name-title': 'Mr',
                        'q-applicant-name-firstname': 'Barry',
                        'q-applicant-name-lastname': 'Piccinni'
                    },
                    'p-applicant-enter-your-address': {
                        'q-applicant-building-and-street': 'Alexander Bain House',
                        'q-applicant-building-and-street2': 'Atlantic Quay',
                        'q-applicant-town-or-city': 'Glasgow',
                        'q-applicant-county': '',
                        'q-applicant-postcode': 'G2 8JQ'
                    }
                };
                formattedAnswer = answerFormatHelper.summaryFormatter(answerObject);
            });

            it('should format all responses into simple objects containing a value key and a href key', () => {
                // eslint-disable-next-line no-restricted-syntax
                for (const answer in formattedAnswer) {
                    if (formattedAnswer.hasOwnProperty(answer)) {
                        expect(Object.keys(formattedAnswer[answer])).toContain('value');
                        expect(Object.keys(formattedAnswer[answer])).toContain('href');
                    }
                }
            });

            it('should format all true/false answers to "Yes" or "No"', () => {
                const answerValues = [];
                // eslint-disable-next-line no-restricted-syntax
                for (const answer in formattedAnswer) {
                    if (formattedAnswer.hasOwnProperty(answer)) {
                        answerValues.push(formattedAnswer[answer].value);
                    }
                }

                expect(answerValues).not.toContain('true');
                expect(answerValues).not.toContain('false');
                expect(answerValues).toContain('Yes');
                expect(answerValues).toContain('No');
            });

            it('should format a question with more than one but less than 4 answers on a single line', () => {
                expect(formattedAnswer['p-applicant-enter-your-name'].value).toMatch(
                    'Mr Barry Piccinni'
                );
            });

            it('should format a question with 4 or more answers appears in a multi-line format', () => {
                expect(formattedAnswer['p-applicant-enter-your-address'].value).toMatch(
                    'Alexander Bain House<br>Atlantic Quay<br>Glasgow<br>G2 8JQ'
                );
            });

            it('should correctly build the url for each question', () => {
                expect(formattedAnswer['p-applicant-enter-your-address'].href).toMatch(
                    '/apply/applicant-enter-your-address?next=check-your-answers'
                );
                expect(formattedAnswer['p-applicant-enter-your-name'].href).toMatch(
                    '/apply/applicant-enter-your-name?next=check-your-answers'
                );
                expect(
                    formattedAnswer['p-applicant-were-you-a-victim-of-sexual-assault-or-abuse'].href
                ).toMatch(
                    '/apply/applicant-were-you-a-victim-of-sexual-assault-or-abuse?next=check-your-answers'
                );
            });
        });
        describe('Helper Methods', () => {
            describe('isValidDate', () => {
                it('should return true is a valid date is entered', () => {
                    const trueString = '2019-01-01T09:55:22.130Z';
                    const falseString = 'not-a-date';

                    const actual1 = answerFormatHelper.isValidDate(trueString);
                    const actual2 = answerFormatHelper.isValidDate(falseString);

                    expect(actual1).toBeTruthy();
                    expect(actual2).not.toBeTruthy();
                });
            });
            describe('dateFormatter', () => {
                it('should return a date in a readable format', () => {
                    const dateString = '2019-01-01T09:55:22.130Z';

                    const actual = answerFormatHelper.dateFormatter(dateString);

                    expect(actual).toMatch('01 January 2019');
                });
            });
            describe('textFormatter', () => {
                it('should return text in a readable format', () => {
                    const inputString = 'i-am-an-answer';

                    const actual = answerFormatHelper.textFormatter(inputString);

                    expect(actual).toMatch('I am an answer');
                });
            });
            describe('multipleAnswersFormat', () => {
                describe('questions with more than 1 but less than 5 fields', () => {
                    it('should return all fields except boolean on a single line separated by spaces', () => {
                        const inputString = {
                            'q-applicant-building-and-street': 'Alexander Bain House',
                            'q-applicant-town-or-city': 'Glasgow',
                            'q-applicant-postcode': 'G2 8JQ'
                        };

                        const actual = answerFormatHelper.multipleAnswersFormat(inputString);

                        expect(actual).toMatch('Alexander Bain House Glasgow G2 8JQ');
                    });

                    it('should return boolean fields on a single comma separated line', () => {
                        const inputString = {
                            'q-do-you-live-in-glasgow': true,
                            'q-applicant-town-or-city': 'Glasgow',
                            'q-applicant-postcode': 'G2 8JQ'
                        };

                        const actual = answerFormatHelper.multipleAnswersFormat(inputString);

                        expect(actual).toMatch('Yes, Glasgow G2 8JQ');
                    });
                });

                describe('questions with more than 4 fields', () => {
                    it('should return as a multi-row string', () => {
                        const inputString = {
                            'q-applicant-building-and-street': 'Alexander Bain House',
                            'q-applicant-building-and-street2': 'Atlantic Quay',
                            'q-applicant-town-or-city': 'Glasgow',
                            'q-applicant-county': '',
                            'q-applicant-postcode': 'G2 8JQ'
                        };

                        const actual = answerFormatHelper.multipleAnswersFormat(inputString);

                        expect(actual).toMatch(
                            'Alexander Bain House<br>Atlantic Quay<br>Glasgow<br>G2 8JQ'
                        );
                    });
                });
            });
        });
        describe('arrayFormatter', () => {
            it('should return all the elements of an array on a single, comma separated line', () => {
                const inputArray = ['i-am-an-answer', 'another-answer', 'a-third-answer'];

                const actual = answerFormatHelper.arrayFormatter(inputArray);

                expect(actual).toMatch('I am an answer<br>Another answer<br>A third answer<br>');
            });
        });
    });

    describe('Police lookup', () => {
        it('Should return the name of a police force given the index code.', () => {
            const ayrshirePoliceIndex = 12157147;
            const actual = policeLookup(ayrshirePoliceIndex);
            const expected = 'Scotland Ayrshire';

            expect(actual).toMatch(expected);
        });
    });
});
