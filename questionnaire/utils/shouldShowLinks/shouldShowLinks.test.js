'use strict';

const shouldShowLinks = require('.');

const uiSchema = {
    section1: {
        options: {
            foo: 'bar'
        }
    },
    section2: {
        options: {
            links: {
                showSignInLink: false,
                showBackLink: false
            }
        }
    },
    section3: {
        options: {
            links: {
                showSignInLink: true,
                showBackLink: true
            }
        }
    }
};

describe('shouldShowLinks', () => {
    describe('Sign in link', () => {
        describe('No link configuration in UISchema', () => {
            it('Should return true by default', () => {
                const result = shouldShowLinks({sectionId: 'section1', uiSchema});
                expect(result).toMatchObject({
                    showSignInLink: true
                });
            });
            describe('Authenticated user', () => {
                it('Should hide the sign in link', () => {
                    const result = shouldShowLinks({
                        sectionId: 'section1',
                        uiSchema,
                        isAuthenticated: true
                    });
                    expect(result).toMatchObject({
                        showSignInLink: false
                    });
                });
            });
            describe('Unauthenticated user', () => {
                it('Should show the sign in link', () => {
                    const result = shouldShowLinks({
                        sectionId: 'section1',
                        uiSchema,
                        isAuthenticated: false
                    });
                    expect(result).toMatchObject({
                        showSignInLink: true
                    });
                });
            });
        });
        describe('ShowSignInLink is explicitly false in UISchema', () => {
            describe('Authenticated user', () => {
                it('Should hide the sign in link', () => {
                    const result = shouldShowLinks({
                        sectionId: 'section2',
                        uiSchema,
                        isAuthenticated: true
                    });
                    expect(result).toMatchObject({
                        showSignInLink: false
                    });
                });
            });
            describe('Unauthenticated user', () => {
                it('Should hide the sign in link', () => {
                    const result = shouldShowLinks({
                        sectionId: 'section2',
                        uiSchema,
                        isAuthenticated: false
                    });
                    expect(result).toMatchObject({
                        showSignInLink: false
                    });
                });
            });
        });
        describe('ShowSignInLink is explicitly true in UISchema', () => {
            describe('Authenticated user', () => {
                it('Should hide the sign in link', () => {
                    const result = shouldShowLinks({
                        sectionId: 'section3',
                        uiSchema,
                        isAuthenticated: true
                    });
                    expect(result).toMatchObject({
                        showSignInLink: true
                    });
                });
            });
            describe('Unauthenticated user', () => {
                it('Should hide the sign in link', () => {
                    const result = shouldShowLinks({
                        sectionId: 'section3',
                        uiSchema,
                        isAuthenticated: false
                    });
                    expect(result).toMatchObject({
                        showSignInLink: true
                    });
                });
            });
        });
    });
    describe('Back link', () => {
        describe('No link configuration in UISchema', () => {
            it('Should return true by default', () => {
                const result = shouldShowLinks({sectionId: 'section1', uiSchema});
                expect(result).toMatchObject({
                    showBackLink: true
                });
            });
        });
        describe('ShowSignInLink is explicitly false in UISchema', () => {
            it('Should hide the sign in link', () => {
                const result = shouldShowLinks({sectionId: 'section2', uiSchema});
                expect(result).toMatchObject({
                    showSignInLink: false
                });
            });
        });
        describe('ShowSignInLink is explicitly true in UISchema', () => {
            it('Should hide the sign in link', () => {
                const result = shouldShowLinks({sectionId: 'section3', uiSchema});
                expect(result).toMatchObject({
                    showSignInLink: true
                });
            });
        });
    });
});
