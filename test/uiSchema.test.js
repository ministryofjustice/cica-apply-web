'use strict';

const uiSchema = require('../questionnaire/questionnaireUISchema');

const findDuplicates = arr => {
    const sortedArr = arr.slice().sort();
    const results = [];
    sortedArr.forEach((item, index) => {
        if (sortedArr[index + 1] === item) {
            results.push(item);
        }
    });
    return results;
};

describe('UISchema', () => {
    describe('Check your answers', () => {
        const pageProperties =
            uiSchema['p--check-your-answers'].options.properties['p-check-your-answers'].options;
        describe('summaryStructure', () => {
            const structure = pageProperties.summaryStructure;
            describe('Question IDs', () => {
                it('Should appear only once in the structure', () => {
                    let keyArr = [];
                    structure.forEach(section => {
                        keyArr = [...keyArr, ...Object.keys(section.questions)];
                    });

                    const output = findDuplicates(keyArr);

                    expect(output).toEqual([]);
                });
            });
        });
    });
});
