'use strict';

const shouldShowSignInLink = require('.');

const flags = {
    AUTHENTICATED: true,
    UNAUTHENTICATED: false
};
const sections = {
    sectionWithNoSignInLinkOptions: {
        options: {
            foo: 'bar'
        }
    },
    sectionWithSignInLinkVisibleFalseOption: {
        options: {
            signInLink: {
                visible: false
            }
        }
    },
    sectionWithSignInLinkVisibleTrueOption: {
        options: {
            signInLink: {
                visible: true
            }
        }
    }
};

describe('shouldShowSignInLink', () => {
    describe('Unauthenticated', () => {
        describe('No section-modifying options', () => {
            it('Should return true', () => {
                const result = shouldShowSignInLink(flags.UNAUTHENTICATED);
                expect(result).toBe(true);
            });
        });
        describe('No applicable section-modifying options', () => {
            it('Should return true', () => {
                const result = shouldShowSignInLink(
                    flags.UNAUTHENTICATED,
                    sections.sectionWithNoSignInLinkOptions.options
                );
                expect(result).toBe(true);
            });
        });
        describe('"signInLink.visible = false" section option', () => {
            it('Should return false', () => {
                const result = shouldShowSignInLink(
                    flags.UNAUTHENTICATED,
                    sections.sectionWithSignInLinkVisibleFalseOption.options
                );
                expect(result).toBe(false);
            });
        });
        describe('"signInLink.visible = true" section option', () => {
            it('Should return true', () => {
                const result = shouldShowSignInLink(
                    flags.UNAUTHENTICATED,
                    sections.sectionWithSignInLinkVisibleTrueOption.options
                );
                expect(result).toBe(true);
            });
        });
    });
    describe('Authenticated', () => {
        describe('No section-modifying options', () => {
            it('Should return false', () => {
                const result = shouldShowSignInLink(flags.AUTHENTICATED);
                expect(result).toBe(false);
            });
        });
        describe('No applicable section-modifying options', () => {
            it('Should return false', () => {
                const result = shouldShowSignInLink(
                    flags.AUTHENTICATED,
                    sections.sectionWithNoSignInLinkOptions.options
                );
                expect(result).toBe(false);
            });
        });
        describe('"signInLink.visible = false" section option', () => {
            it('Should return false', () => {
                const result = shouldShowSignInLink(
                    flags.AUTHENTICATED,
                    sections.sectionWithSignInLinkVisibleFalseOption.options
                );
                expect(result).toBe(false);
            });
        });
        describe('"signInLink.visible = true" section option', () => {
            it('Should return true', () => {
                const result = shouldShowSignInLink(
                    flags.AUTHENTICATED,
                    sections.sectionWithSignInLinkVisibleTrueOption.options
                );
                expect(result).toBe(true);
            });
        });
    });
});
