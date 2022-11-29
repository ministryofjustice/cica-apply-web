'use strict';

const getFormSubmitButtonText = require('.');

const uiSchema = {
    section1: {
        options: {
            someother: {
                setting: true
            }
        }
    },
    section2: {
        options: {
            buttonText: 'Foo'
        }
    },
    section3: {
        options: {
            buttonText: ''
        }
    }
};

describe('getFormSubmitButtonText', () => {
    it('Should return the default for an authenticated user', () => {
        const result = getFormSubmitButtonText('section1', uiSchema, true);
        expect(result).toBe('Save and continue');
    });

    it('Should return the default for an unauthenticated user', () => {
        const result = getFormSubmitButtonText('section1', uiSchema, false);
        expect(result).toBe('Continue');
    });

    it('Should return the uischema value for an authenticated user', () => {
        const result = getFormSubmitButtonText('section2', uiSchema, true);
        expect(result).toBe('Foo');
    });

    it('Should return the uischema value for an unauthenticated user', () => {
        const result = getFormSubmitButtonText('section2', uiSchema, false);
        expect(result).toBe('Foo');
    });

    it('Should return the default for an authenticated user when custom is falsy', () => {
        const result = getFormSubmitButtonText('section3', uiSchema, true);
        expect(result).toBe('Save and continue');
    });

    it('Should return the default for an unauthenticated user when custom is falsy', () => {
        const result = getFormSubmitButtonText('section3', uiSchema, false);
        expect(result).toBe('Continue');
    });
});
