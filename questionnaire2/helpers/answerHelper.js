const moment = require('moment');

function removeSectionIdPrefix(sectionId) {
    return sectionId.replace(/p-{1,2}/, '');
}

function dateFormatter(date) {
    return moment(date).format('DD MMMM YYYY');
}

function isValidDate(str) {
    const d = Date.parse(str);
    // eslint-disable-next-line no-restricted-globals
    return !isNaN(d);
}

function arrayFormatter(array) {
    let returnValue = '';
    array.forEach(answer => {
        returnValue += `${answer}, `;
    });
    return returnValue.substring(0, returnValue.length - 2);
}

function textFormatter(string) {
    if (string === '') {
        return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/-/g, ' ');
}

function questionNameFormatter(str) {
    return str.replace(/-/g, '_');
}

function formatAnswer(answer) {
    const isADate = isValidDate(answer);
    const isArray = Array.isArray(answer);
    switch (answer) {
        case true: // If it's a true values
        case 'true':
            return 'Yes';
        case false: // If it's a false value
        case 'false':
            return 'No';
        default:
            if (isADate) {
                return dateFormatter(answer);
            }
            if (isArray) {
                return arrayFormatter(answer);
            }
            return textFormatter(answer); // If it's a single value string
    }
}

function multipleAnswersFormat(sectionObject) {
    let answerInstructions = '';
    if (!sectionObject) {
        return ''; // If the sectionObject is empty, return a blank string.
    }
    let lineEnd = ' '; // Default break between questions is a space.
    Object.values(sectionObject).forEach(question => {
        lineEnd = Object.keys(sectionObject).length > 3 ? '<br>' : ' '; // For large numbers of fields, insert a line break.
        if (question !== '') {
            // Ignore empty lines
            const formattedQuestion = formatAnswer(question); // Format the individual answer.
            lineEnd = formattedQuestion === 'Yes' || formattedQuestion === 'No' ? ', ' : lineEnd; // If a question was a boolean, follow it with a comma, not a space.
            answerInstructions += `${formattedQuestion}${lineEnd}`; // append the answer and the line end to the return string.
        }
    });
    return answerInstructions.substring(0, answerInstructions.length - lineEnd.length); // remove trailing break
}

function summaryFormatter(answerObject) {
    const answerIndex = {};
    if (answerObject) {
        Object.keys(answerObject).forEach(question => {
            const correctedName = questionNameFormatter(question);
            answerIndex[correctedName] = {};
            answerIndex[correctedName].href = `/apply/${removeSectionIdPrefix(
                question
            )}?next=check-your-answers`;
            if (answerObject[question] !== {}) {
                // Ignore non-question entries
                if (Object.keys(answerObject[question]).length === 1) {
                    answerIndex[correctedName].value = formatAnswer(
                        Object.values(answerObject[question])[0]
                    );
                } else {
                    answerIndex[correctedName].value = multipleAnswersFormat(
                        answerObject[question]
                    ); // A question with more than one answer appears in a multi-line format
                }
            }
        });
    }

    return answerIndex;
}

module.exports = {
    summaryFormatter,
    dateFormatter,
    isValidDate,
    textFormatter,
    multipleAnswersFormat,
    questionNameFormatter,
    arrayFormatter
};
