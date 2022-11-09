'use strict';

const shouldShowSignInLink = require('.');

const uiSchema = {
    section1: {
        options: {
            foo: 'bar'
        }
    },
    section2: {
        options: {
            signInLink: {
                visible: false
            }
        }
    },
    section3: {
        options: {
            signInLink: {
                visible: true
            }
        }
    }
};

describe('shouldShowSignInLink', () => {
    it('Should return true by default', () => {
        const result = shouldShowSignInLink('section1', uiSchema);
        expect(result).toBe(true);
    });
    it('Should return false', () => {
        const result = shouldShowSignInLink('section2', uiSchema);
        expect(result).toBe(false);
    });
    it('Should return true', () => {
        const result = shouldShowSignInLink('section3', uiSchema);
        expect(result).toBe(true);
    });
});
