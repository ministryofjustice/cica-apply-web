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
    describe('No signInLink configuration in UISchema', () => {
        it('Should return true by default', () => {
            const result = shouldShowSignInLink('section1', uiSchema);
            expect(result).toBe(true);
        });
        describe('Authenticated', () => {
            it('Should return false', () => {
                const result = shouldShowSignInLink('section1', uiSchema, true);
                expect(result).toBe(false);
            });
        });
        describe('Unauthenticated', () => {
            it('Should return true', () => {
                const result = shouldShowSignInLink('section1', uiSchema, false);
                expect(result).toBe(true);
            });
        });
    });

    describe('signInLink.visible configuration in UISchema', () => {
        describe('signInLink.visible equals `false` configuration in UISchema', () => {
            it('Should return false by default', () => {
                const result = shouldShowSignInLink('section2', uiSchema);
                expect(result).toBe(false);
            });
            describe('Authenticated', () => {
                it('Should return false', () => {
                    const result = shouldShowSignInLink('section2', uiSchema, true);
                    expect(result).toBe(false);
                });
            });
            describe('Unauthenticated', () => {
                it('Should return false', () => {
                    const result = shouldShowSignInLink('section2', uiSchema, false);
                    expect(result).toBe(false);
                });
            });
        });

        describe('signInLink.visible equals `true` configuration in UISchema', () => {
            it('Should return true by default', () => {
                const result = shouldShowSignInLink('section3', uiSchema);
                expect(result).toBe(true);
            });
            describe('Authenticated', () => {
                it('Should return true', () => {
                    const result = shouldShowSignInLink('section3', uiSchema, true);
                    expect(result).toBe(true);
                });
            });
            describe('Unauthenticated', () => {
                it('Should return true', () => {
                    const result = shouldShowSignInLink('section3', uiSchema, false);
                    expect(result).toBe(true);
                });
            });
        });
    });
});
