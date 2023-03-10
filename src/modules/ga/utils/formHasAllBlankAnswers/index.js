/* globals FormData */
const keysToIngore = ['_csrf'];
function formHasAllBlankAnswers(form) {
    const formData = new FormData(form);
    const answeredQuestions = Array.from(formData.entries())
        .filter(entry => !keysToIngore.includes(entry[0]))
        .filter(entry => !!entry[1]);

    return answeredQuestions.length === 0;
}

export default formHasAllBlankAnswers;
