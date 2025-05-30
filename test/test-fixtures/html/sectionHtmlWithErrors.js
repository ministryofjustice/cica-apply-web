'use strict';

const sectionHtmlWithErrorshtml = `
<!DOCTYPE html>
<html lang="en" class="govuk-template">
    <head>
        <meta charset="utf-8">
        <title>Error: You should not apply again - Claim criminal injuries compensation - GOV.UK </title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="theme-color" content="#0b0c0c">
        <link rel="icon" sizes="48x48" href="/assets/images/favicon.ico">
        <link rel="icon" sizes="any" href="/assets/images/favicon.svg" type="image/svg+xml">
        <link rel="mask-icon" href="/assets/images/govuk-icon-mask.svg" color="#0b0c0c">
        <link rel="apple-touch-icon" href="/assets/images/govuk-icon-180.png">
        <link rel="manifest" href="/assets/manifest.json">
        <link href="/govuk-frontend/all.css?v=1.2.3&c=Qnefc5ywgazsrupSws1uk" rel="stylesheet" />
        <link rel="stylesheet" href="/dist/css/accessible-autocomplete.css?v=1.2.3&c=Qnefc5ywgazsrupSws1uk" />
        <link rel="stylesheet" href="/dist/css/accessible-autocomplete-wrapper.css?v=1.2.3&c=Qnefc5ywgazsrupSws1uk" />
    </head>

    <body class="govuk-template__body">
        <script nonce="vxRGNXkIRC4wZnzoZC_dk">document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' govuk-frontend-supported' : '');</script>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script nonce="vxRGNXkIRC4wZnzoZC_dk" async src="https://www.googletagmanager.com/gtag/js?id="></script>
        <script nonce="vxRGNXkIRC4wZnzoZC_dk">
            window.dataLayer = window.dataLayer || [];
            function gtag() {
                dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('set', {
                cookie_flags: 'SameSite=Lax;Secure',
                cookie_domain: 'www.b44e2eaa-baf5-47aa-8ac9-5d23ee2a7297.gov.uk' 
            });
            gtag('config', '', {
                'user_id': ''
            });
        </script>
        <a href="#main-content" class="govuk-skip-link" data-module="govuk-skip-link">Skip to main content</a>
        <div class="cookie-banner govuk-width-container" id="cookie-banner">
            <div class="govuk-grid-row">
                <div class=" govuk-grid-column-two-thirds">
                    <div class="cookie-banner__message">
                        <h2 class="govuk-heading-m">Tell us whether you accept cookies</h2>
                        <p class="govuk-body">This
                            service uses cookies that are essential for the site to work. We also use non-essential cookies
                            to help us improve your experience.</p>
                        <p class="govuk-body">Do you accept these
                            non-essential cookies?</p>
                    </div>
                    <div class="cookie-banner__buttons">
                        <div
                            class="cookie-banner__button cookie-banner__button-accept govuk-grid-column-full govuk-grid-column-one-half-from-desktop govuk-!-padding-left-0">
                            <a href="/cookies" id="cookie-banner-accept-all" class="govuk-button button--inline"
                                role="button">Accept all cookies</a>
                        </div>
                        <div
                            class="cookie-banner__button govuk-grid-column-full govuk-grid-column-one-half-from-desktop govuk-!-padding-left-0">
                            <a href="/cookies" id="cookie-banner-set-preferences"
                                class="govuk-button govuk-button--secondary button--inline" role="button">Set cookie
                                preferences</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <header class="govuk-header" data-module="govuk-header">
            <div class="govuk-header__container govuk-width-container">
                <div class="govuk-header__logo"> <a href="https://www.gov.uk"
                        class="govuk-header__link govuk-header__link--homepage"> <svg focusable="false" role="img"
                            class="govuk-header__logotype" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 148 30"
                            height="30" width="148" aria-label="GOV.UK">
                            <title>GOV.UK</title>
                            <path
                                d="M22.6 10.4c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m-5.9 6.7c-.9.4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m10.8-3.7c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s0 2-1 2.4m3.3 4.8c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4M17 4.7l2.3 1.2V2.5l-2.3.7-.2-.2.9-3h-3.4l.9 3-.2.2c-.1.1-2.3-.7-2.3-.7v3.4L15 4.7c.1.1.1.2.2.2l-1.3 4c-.1.2-.1.4-.1.6 0 1.1.8 2 1.9 2.2h.7c1-.2 1.9-1.1 1.9-2.1 0-.2 0-.4-.1-.6l-1.3-4c-.1-.2 0-.2.1-.3m-7.6 5.7c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m-5 3c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s.1 2 1 2.4m-3.2 4.8c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m14.8 11c4.4 0 8.6.3 12.3.8 1.1-4.5 2.4-7 3.7-8.8l-2.5-.9c.2 1.3.3 1.9 0 2.7-.4-.4-.8-1.1-1.1-2.3l-1.2 4c.7-.5 1.3-.8 2-.9-1.1 2.5-2.6 3.1-3.5 3-1.1-.2-1.7-1.2-1.5-2.1.3-1.2 1.5-1.5 2.1-.1 1.1-2.3-.8-3-2-2.3 1.9-1.9 2.1-3.5.6-5.6-2.1 1.6-2.1 3.2-1.2 5.5-1.2-1.4-3.2-.6-2.5 1.6.9-1.4 2.1-.5 1.9.8-.2 1.1-1.7 2.1-3.5 1.9-2.7-.2-2.9-2.1-2.9-3.6.7-.1 1.9.5 2.9 1.9l.4-4.3c-1.1 1.1-2.1 1.4-3.2 1.4.4-1.2 2.1-3 2.1-3h-5.4s1.7 1.9 2.1 3c-1.1 0-2.1-.2-3.2-1.4l.4 4.3c1-1.4 2.2-2 2.9-1.9-.1 1.5-.2 3.4-2.9 3.6-1.9.2-3.4-.8-3.5-1.9-.2-1.3 1-2.2 1.9-.8.7-2.3-1.2-3-2.5-1.6.9-2.2.9-3.9-1.2-5.5-1.5 2-1.3 3.7.6 5.6-1.2-.7-3.1 0-2 2.3.6-1.4 1.8-1.1 2.1.1.2.9-.3 1.9-1.5 2.1-.9.2-2.4-.5-3.5-3 .6 0 1.2.3 2 .9l-1.2-4c-.3 1.1-.7 1.9-1.1 2.3-.3-.8-.2-1.4 0-2.7l-2.9.9C1.3 23 2.6 25.5 3.7 30c3.7-.5 7.9-.8 12.3-.8m28.3-11.6c0 .9.1 1.7.3 2.5.2.8.6 1.5 1 2.2.5.6 1 1.1 1.7 1.5.7.4 1.5.6 2.5.6.9 0 1.7-.1 2.3-.4s1.1-.7 1.5-1.1c.4-.4.6-.9.8-1.5.1-.5.2-1 .2-1.5v-.2h-5.3v-3.2h9.4V28H55v-2.5c-.3.4-.6.8-1 1.1-.4.3-.8.6-1.3.9-.5.2-1 .4-1.6.6s-1.2.2-1.8.2c-1.5 0-2.9-.3-4-.8-1.2-.6-2.2-1.3-3-2.3-.8-1-1.4-2.1-1.8-3.4-.3-1.4-.5-2.8-.5-4.3s.2-2.9.7-4.2c.5-1.3 1.1-2.4 2-3.4.9-1 1.9-1.7 3.1-2.3 1.2-.6 2.6-.8 4.1-.8 1 0 1.9.1 2.8.3.9.2 1.7.6 2.4 1s1.4.9 1.9 1.5c.6.6 1 1.3 1.4 2l-3.7 2.1c-.2-.4-.5-.9-.8-1.2-.3-.4-.6-.7-1-1-.4-.3-.8-.5-1.3-.7-.5-.2-1.1-.2-1.7-.2-1 0-1.8.2-2.5.6-.7.4-1.3.9-1.7 1.5-.5.6-.8 1.4-1 2.2-.3.8-.4 1.9-.4 2.7zM71.5 6.8c1.5 0 2.9.3 4.2.8 1.2.6 2.3 1.3 3.1 2.3.9 1 1.5 2.1 2 3.4s.7 2.7.7 4.2-.2 2.9-.7 4.2c-.4 1.3-1.1 2.4-2 3.4-.9 1-1.9 1.7-3.1 2.3-1.2.6-2.6.8-4.2.8s-2.9-.3-4.2-.8c-1.2-.6-2.3-1.3-3.1-2.3-.9-1-1.5-2.1-2-3.4-.4-1.3-.7-2.7-.7-4.2s.2-2.9.7-4.2c.4-1.3 1.1-2.4 2-3.4.9-1 1.9-1.7 3.1-2.3 1.2-.5 2.6-.8 4.2-.8zm0 17.6c.9 0 1.7-.2 2.4-.5s1.3-.8 1.7-1.4c.5-.6.8-1.3 1.1-2.2.2-.8.4-1.7.4-2.7v-.1c0-1-.1-1.9-.4-2.7-.2-.8-.6-1.6-1.1-2.2-.5-.6-1.1-1.1-1.7-1.4-.7-.3-1.5-.5-2.4-.5s-1.7.2-2.4.5-1.3.8-1.7 1.4c-.5.6-.8 1.3-1.1 2.2-.2.8-.4 1.7-.4 2.7v.1c0 1 .1 1.9.4 2.7.2.8.6 1.6 1.1 2.2.5.6 1.1 1.1 1.7 1.4.6.3 1.4.5 2.4.5zM88.9 28 83 7h4.7l4 15.7h.1l4-15.7h4.7l-5.9 21h-5.7zm28.8-3.6c.6 0 1.2-.1 1.7-.3.5-.2 1-.4 1.4-.8.4-.4.7-.8.9-1.4.2-.6.3-1.2.3-2v-13h4.1v13.6c0 1.2-.2 2.2-.6 3.1s-1 1.7-1.8 2.4c-.7.7-1.6 1.2-2.7 1.5-1 .4-2.2.5-3.4.5-1.2 0-2.4-.2-3.4-.5-1-.4-1.9-.9-2.7-1.5-.8-.7-1.3-1.5-1.8-2.4-.4-.9-.6-2-.6-3.1V6.9h4.2v13c0 .8.1 1.4.3 2 .2.6.5 1 .9 1.4.4.4.8.6 1.4.8.6.2 1.1.3 1.8.3zm13-17.4h4.2v9.1l7.4-9.1h5.2l-7.2 8.4L148 28h-4.9l-5.5-9.4-2.7 3V28h-4.2V7zm-27.6 16.1c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z">
                            </path>
                        </svg> </a> </div>
                <div class="govuk-header__content"> <a
                        href="https://www.gov.uk/claim-compensation-criminal-injury/make-claim"
                        class="govuk-header__link govuk-header__service-name"> Claim criminal injuries compensation </a>
                </div>
            </div>
        </header>
        <div class="govuk-width-container" role="navigation">
            <div class="govuk-grid-column-two-thirds">
                <a href="/apply/previous/info-context-you-should-not-apply-again" class="govuk-back-link">Previous page</a>
            </div>
        </div>
        <div class="govuk-width-container">
            <main class="govuk-main-wrapper" id="main-content">
                <div class="govuk-grid-row">
                    <div class="govuk-grid-column-two-thirds">
                        <form method="post" novalidate autocomplete="off">
                            <div class="govuk-error-summary" data-module="govuk-error-summary">
                                <div role="alert">
                                    <h2 class="govuk-error-summary__title"> There is a problem </h2>
                                    <div class="govuk-error-summary__body">
                                        <ul class="govuk-list govuk-error-summary__list">
                                            <li> <a href="#q--duplicate-application-confirmation">Select that you understand
                                                    what happens if you apply more than once for injuries related to the
                                                    same crime</a> </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <h1 class="govuk-heading-xl">You should not apply again</h1>
                            <div id="you-should-not-apply-again">
                                <p class="govuk-body">If you’ve applied before, or someone’s applied for you, for injuries
                                    related to this crime, we cannot accept another application from you.</p>
                                <h2 class="govuk-heading-m">If you’re waiting to hear from us</h2>
                                <p class="govuk-body">We have your application and are processing it. We’ll contact you if
                                    we need any more information.</p>
                                <p class="govuk-body">In the majority of cases we make a decision within 12 months, but it
                                    can take longer. You may not hear from us during this time, but we are working hard to
                                    process your application as quickly as possible.</p>
                                <p class="govuk-body">If your information has changed and you need to let us know, you can
                                    <a class="govuk-link"
                                        href="/contact-us">contact us to update
                                        your existing application. </a>
                                </p>
                                <h2 class="govuk-heading-m">If you applied in the past but were not successful</h2>
                                <p class="govuk-body">We cannot accept another application from you, for injuries related to
                                    this crime. You should not apply again.</p>
                                <p class="govuk-body"> If you want to exit this application, you can close this window or
                                    tab. You can still continue, if you would like to.</p>
                            </div>
                            <div class="govuk-form-group govuk-form-group--error">
                                <p id="q--duplicate-application-confirmation-error" class="govuk-error-message"> <span
                                        class="govuk-visually-hidden">Error:</span> Select that you understand what happens
                                    if you apply more than once for injuries related to the same crime </p>
                                <div class="govuk-checkboxes" data-module="govuk-checkboxes">
                                    <div class="govuk-checkboxes__item"> <input class="govuk-checkboxes__input"
                                            id="q--duplicate-application-confirmation"
                                            name="q--duplicate-application-confirmation" type="checkbox"
                                            value="I understand"
                                            aria-describedby="q--duplicate-application-confirmation-error"> <label
                                            class="govuk-label govuk-checkboxes__label"
                                            for="q--duplicate-application-confirmation"> I understand that if I apply more
                                            than once for injuries related to the same crime, my second application won’t be
                                            considered by CICA. </label> </div>
                                </div>
                            </div> <button type="submit" data-prevent-double-click="true"
                                class="govuk-button govuk-button--secondary" data-module="govuk-button"> Continue
                                anyway</button> <input type="hidden" name="_csrf"
                                value="ihjsOcdp-XAWRzksu5YpE2tczpQzK02VWEKg"> <input type="hidden" name="_external-id"
                                value="urn:uuid:ce66be9d-5880-4559-9a93-df15928be396">
                        </form>
                    </div>
                </div>
            </main>
        </div>
        <div class="govuk-width-container">
            <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible">
            <p class="govuk-body-s">
                <a class="govuk-link" href="https://www.surveymonkey.co.uk/r/YourFeedbackPB" target="_blank">Tell us your
                    feedback (opens in new tab)</a> to help us to improve our service.
            </p>
        </div>
        <footer class="govuk-footer">
            <div class="govuk-width-container">
                <div class="govuk-footer__meta">
                    <div class="govuk-footer__meta-item govuk-footer__meta-item--grow">
                        <h2 class="govuk-visually-hidden">Support links</h2>
                        <ul class="govuk-footer__inline-list">
                            <li class="govuk-footer__inline-list-item"> <a class="govuk-footer__link"
                                    href="https://www.gov.uk/guidance/cica-privacy-notice"> Privacy </a> </li>
                            <li class="govuk-footer__inline-list-item"> <a class="govuk-footer__link" href="/cookies">
                                    Cookies </a> </li>
                            <li class="govuk-footer__inline-list-item"> <a class="govuk-footer__link" href="/contact-us">
                                    Contact </a> </li>
                            <li class="govuk-footer__inline-list-item"> <a class="govuk-footer__link"
                                    href="/accessibility-statement"> Accessibility statement </a> </li>
                        </ul> <svg aria-hidden="true" focusable="false" class="govuk-footer__licence-logo"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 483.2 195.7" height="17" width="41">
                            <path fill="currentColor"
                                d="M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.2h3v-87.8h-80l24.3 27.5zM97.8 145c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S123.8 145 97.8 145" />
                        </svg> <span class="govuk-footer__licence-description"> All content is available under the <a
                                class="govuk-footer__link"
                                href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                                rel="license">Open Government Licence v3.0</a>, except where otherwise stated </span>
                    </div>
                    <div class="govuk-footer__meta-item"> <a class="govuk-footer__link govuk-footer__copyright-logo"
                            href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/">
                            © Crown copyright </a> </div>
                </div>
            </div>
        </footer>
        <div class="govuk-modal" id="govuk-modal-session-timing-out" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog id="session-timing-out" class="govuk-modal__box" aria-labelledby="session-timing-out-title"
                    aria-describedby="session-timing-out-content" aria-modal="true" role="alertdialog" tabindex="0">
                    <div class="govuk-modal__header"> <svg aria-hidden="true" focusable="false"
                            class="govuk-header__logotype-crown govuk-modal__header-image"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 30" height="30" width="32">
                            <path fill="currentColor" fill-rule="evenodd"
                                d="M22.6 10.4c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m-5.9 6.7c-.9.4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m10.8-3.7c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s0 2-1 2.4m3.3 4.8c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4M17 4.7l2.3 1.2V2.5l-2.3.7-.2-.2.9-3h-3.4l.9 3-.2.2c-.1.1-2.3-.7-2.3-.7v3.4L15 4.7c.1.1.1.2.2.2l-1.3 4c-.1.2-.1.4-.1.6 0 1.1.8 2 1.9 2.2h.7c1-.2 1.9-1.1 1.9-2.1 0-.2 0-.4-.1-.6l-1.3-4c-.1-.2 0-.2.1-.3m-7.6 5.7c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m-5 3c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s.1 2 1 2.4m-3.2 4.8c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m14.8 11c4.4 0 8.6.3 12.3.8 1.1-4.5 2.4-7 3.7-8.8l-2.5-.9c.2 1.3.3 1.9 0 2.7-.4-.4-.8-1.1-1.1-2.3l-1.2 4c.7-.5 1.3-.8 2-.9-1.1 2.5-2.6 3.1-3.5 3-1.1-.2-1.7-1.2-1.5-2.1.3-1.2 1.5-1.5 2.1-.1 1.1-2.3-.8-3-2-2.3 1.9-1.9 2.1-3.5.6-5.6-2.1 1.6-2.1 3.2-1.2 5.5-1.2-1.4-3.2-.6-2.5 1.6.9-1.4 2.1-.5 1.9.8-.2 1.1-1.7 2.1-3.5 1.9-2.7-.2-2.9-2.1-2.9-3.6.7-.1 1.9.5 2.9 1.9l.4-4.3c-1.1 1.1-2.1 1.4-3.2 1.4.4-1.2 2.1-3 2.1-3h-5.4s1.7 1.9 2.1 3c-1.1 0-2.1-.2-3.2-1.4l.4 4.3c1-1.4 2.2-2 2.9-1.9-.1 1.5-.2 3.4-2.9 3.6-1.9.2-3.4-.8-3.5-1.9-.2-1.3 1-2.2 1.9-.8.7-2.3-1.2-3-2.5-1.6.9-2.2.9-3.9-1.2-5.5-1.5 2-1.3 3.7.6 5.6-1.2-.7-3.1 0-2 2.3.6-1.4 1.8-1.1 2.1.1.2.9-.3 1.9-1.5 2.1-.9.2-2.4-.5-3.5-3 .6 0 1.2.3 2 .9l-1.2-4c-.3 1.1-.7 1.9-1.1 2.3-.3-.8-.2-1.4 0-2.7l-2.9.9C1.3 23 2.6 25.5 3.7 30c3.7-.5 7.9-.8 12.3-.8">
                            </path>
                        </svg> </div>
                    <div class="govuk-modal__main"> <span class="govuk-modal__heading govuk-heading-l"
                            id="session-timing-out-title"> <span aria-live="assertive">Your session will time out in <span
                                    class="govuk-modal__time-remaining" aria-atomic="true"
                                    aria-live="assertive"></span></span> </span>
                        <div class="govuk-modal__content" id="session-timing-out-content">
                            <p class="govuk-body">
                                You'll lose your unsaved progress if you don't continue. We do this to keep your
                                information secure.</p>
                        </div> <button type="button" class="govuk-button govuk-modal__continue ga-event--click"
                            data-module="govuk-button" data-tracking-category="modal-button"
                            data-tracking-label="Continue application"> Continue
                            application</button>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay">
            </div>
        </div>
        <div class="govuk-modal" id="govuk-modal-session-ended" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog id="session-ended" class="govuk-modal__box" aria-labelledby="session-ended-title"
                    aria-describedby="session-ended-content" aria-modal="true" role="alertdialog" tabindex="0">
                    <div class="govuk-modal__header"> <svg aria-hidden="true" focusable="false"
                            class="govuk-header__logotype-crown govuk-modal__header-image"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 30" height="30" width="32">
                            <path fill="currentColor" fill-rule="evenodd"
                                d="M22.6 10.4c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m-5.9 6.7c-.9.4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m10.8-3.7c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s0 2-1 2.4m3.3 4.8c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4M17 4.7l2.3 1.2V2.5l-2.3.7-.2-.2.9-3h-3.4l.9 3-.2.2c-.1.1-2.3-.7-2.3-.7v3.4L15 4.7c.1.1.1.2.2.2l-1.3 4c-.1.2-.1.4-.1.6 0 1.1.8 2 1.9 2.2h.7c1-.2 1.9-1.1 1.9-2.1 0-.2 0-.4-.1-.6l-1.3-4c-.1-.2 0-.2.1-.3m-7.6 5.7c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m-5 3c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s.1 2 1 2.4m-3.2 4.8c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m14.8 11c4.4 0 8.6.3 12.3.8 1.1-4.5 2.4-7 3.7-8.8l-2.5-.9c.2 1.3.3 1.9 0 2.7-.4-.4-.8-1.1-1.1-2.3l-1.2 4c.7-.5 1.3-.8 2-.9-1.1 2.5-2.6 3.1-3.5 3-1.1-.2-1.7-1.2-1.5-2.1.3-1.2 1.5-1.5 2.1-.1 1.1-2.3-.8-3-2-2.3 1.9-1.9 2.1-3.5.6-5.6-2.1 1.6-2.1 3.2-1.2 5.5-1.2-1.4-3.2-.6-2.5 1.6.9-1.4 2.1-.5 1.9.8-.2 1.1-1.7 2.1-3.5 1.9-2.7-.2-2.9-2.1-2.9-3.6.7-.1 1.9.5 2.9 1.9l.4-4.3c-1.1 1.1-2.1 1.4-3.2 1.4.4-1.2 2.1-3 2.1-3h-5.4s1.7 1.9 2.1 3c-1.1 0-2.1-.2-3.2-1.4l.4 4.3c1-1.4 2.2-2 2.9-1.9-.1 1.5-.2 3.4-2.9 3.6-1.9.2-3.4-.8-3.5-1.9-.2-1.3 1-2.2 1.9-.8.7-2.3-1.2-3-2.5-1.6.9-2.2.9-3.9-1.2-5.5-1.5 2-1.3 3.7.6 5.6-1.2-.7-3.1 0-2 2.3.6-1.4 1.8-1.1 2.1.1.2.9-.3 1.9-1.5 2.1-.9.2-2.4-.5-3.5-3 .6 0 1.2.3 2 .9l-1.2-4c-.3 1.1-.7 1.9-1.1 2.3-.3-.8-.2-1.4 0-2.7l-2.9.9C1.3 23 2.6 25.5 3.7 30c3.7-.5 7.9-.8 12.3-.8">
                            </path>
                        </svg> </div>
                    <div class="govuk-modal__main"> <span class="govuk-modal__heading govuk-heading-l"
                            id="session-ended-title"> Your session has
                            timed out </span>
                        <div class="govuk-modal__content" id="session-ended-content">
                            <p class="govuk-body">Your session has been timed out due to 30 minutes of inactivity. You
                                can sign back in to resume your application if you saved your progress. If not, you'll have
                                to start a new application.</p>
                        </div> <a href="/apply" role="button" draggable="false" class="govuk-button ga-event--click"
                            data-module="govuk-button" data-tracking-category="modal-button"
                            data-tracking-label="Start again"> Continue</a>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay"></div>
        </div>
        <div class="govuk-modal" id="govuk-modal-session-resume-error" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog id="session-resume-error" class="govuk-modal__box" aria-labelledby="session-resume-error-title"
                    aria-describedby="session-resume-error-content" aria-modal="true" role="alertdialog" tabindex="0">
                    <div class="govuk-modal__header">
                        <svg aria-hidden="true" focusable="false"
                            class="govuk-header__logotype-crown govuk-modal__header-image"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 30" height="30" width="32">
                            <path fill="currentColor" fill-rule="evenodd"
                                d="M22.6 10.4c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m-5.9 6.7c-.9.4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m10.8-3.7c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s0 2-1 2.4m3.3 4.8c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4M17 4.7l2.3 1.2V2.5l-2.3.7-.2-.2.9-3h-3.4l.9 3-.2.2c-.1.1-2.3-.7-2.3-.7v3.4L15 4.7c.1.1.1.2.2.2l-1.3 4c-.1.2-.1.4-.1.6 0 1.1.8 2 1.9 2.2h.7c1-.2 1.9-1.1 1.9-2.1 0-.2 0-.4-.1-.6l-1.3-4c-.1-.2 0-.2.1-.3m-7.6 5.7c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m-5 3c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s.1 2 1 2.4m-3.2 4.8c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m14.8 11c4.4 0 8.6.3 12.3.8 1.1-4.5 2.4-7 3.7-8.8l-2.5-.9c.2 1.3.3 1.9 0 2.7-.4-.4-.8-1.1-1.1-2.3l-1.2 4c.7-.5 1.3-.8 2-.9-1.1 2.5-2.6 3.1-3.5 3-1.1-.2-1.7-1.2-1.5-2.1.3-1.2 1.5-1.5 2.1-.1 1.1-2.3-.8-3-2-2.3 1.9-1.9 2.1-3.5.6-5.6-2.1 1.6-2.1 3.2-1.2 5.5-1.2-1.4-3.2-.6-2.5 1.6.9-1.4 2.1-.5 1.9.8-.2 1.1-1.7 2.1-3.5 1.9-2.7-.2-2.9-2.1-2.9-3.6.7-.1 1.9.5 2.9 1.9l.4-4.3c-1.1 1.1-2.1 1.4-3.2 1.4.4-1.2 2.1-3 2.1-3h-5.4s1.7 1.9 2.1 3c-1.1 0-2.1-.2-3.2-1.4l.4 4.3c1-1.4 2.2-2 2.9-1.9-.1 1.5-.2 3.4-2.9 3.6-1.9.2-3.4-.8-3.5-1.9-.2-1.3 1-2.2 1.9-.8.7-2.3-1.2-3-2.5-1.6.9-2.2.9-3.9-1.2-5.5-1.5 2-1.3 3.7.6 5.6-1.2-.7-3.1 0-2 2.3.6-1.4 1.8-1.1 2.1.1.2.9-.3 1.9-1.5 2.1-.9.2-2.4-.5-3.5-3 .6 0 1.2.3 2 .9l-1.2-4c-.3 1.1-.7 1.9-1.1 2.3-.3-.8-.2-1.4 0-2.7l-2.9.9C1.3 23 2.6 25.5 3.7 30c3.7-.5 7.9-.8 12.3-.8">
                            </path>
                        </svg> <button type="button" class="govuk-button govuk-modal__close" data-module="govuk-button"
                            aria-label="Close modal"> ×</button>
                    </div>
                    <div class="govuk-modal__main"> <span class="govuk-modal__heading govuk-heading-l"
                            id="session-resume-error-title"> Something went wrong </span>
                        <div class="govuk-modal__content" id="session-resume-error-content">
                            <p class="govuk-body">
                                We're unable to resume this application. Unless you were signed in and saved your progress,
                                you'll have to start your application again.</p>
                        </div> <a href="/apply" role="button" draggable="false" class="govuk-button ga-event--click"
                            data-module="govuk-button" data-tracking-category="modal-button"
                            data-tracking-label="Start again"> Continue</a>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay"></div>
        </div>
        <script nonce="vxRGNXkIRC4wZnzoZC_dk">
            window.CICA = {
                SERVICE_URL: 'http://www.b44e2eaa-baf5-47aa-8ac9-5d23ee2a7297.gov.uk',
                ANALYTICS_TRACKING_ID: '',
                CICA_ANALYTICS_ID: 'urn:uuid:ce66be9d-5880-4559-9a93-df15928be396'
            };
        </script>

        <script type="module" nonce="vxRGNXkIRC4wZnzoZC_dk">
            import { initAll } from '/govuk-frontend/all.js?v=1.2.3&c=Qnefc5ywgazsrupSws1uk'
            initAll();
        </script>

        <script nonce="vxRGNXkIRC4wZnzoZC_dk" src="https://code.jquery.com/jquery-3.6.3.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>
        <script nonce="vxRGNXkIRC4wZnzoZC_dk" src="/dist/js/autocomplete.min.js?v=1.2.3&c=Qnefc5ywgazsrupSws1uk"></script>
        <script nonce="vxRGNXkIRC4wZnzoZC_dk" src="/dist/js/bundle.js?v=1.2.3&c=Qnefc5ywgazsrupSws1uk"></script>
    </body>
</html>`;

module.exports = sectionHtmlWithErrorshtml;
