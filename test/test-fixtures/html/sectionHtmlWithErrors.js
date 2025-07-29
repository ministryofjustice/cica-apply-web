'use strict';

const sectionHtmlWithErrorshtml = `
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
                            <a class="govuk-link" href="/contact-us">contact us to update
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
                                    name="q--duplicate-application-confirmation" type="checkbox" value="I understand"
                                    aria-describedby="q--duplicate-application-confirmation-error"> <label
                                    class="govuk-label govuk-checkboxes__label"
                                    for="q--duplicate-application-confirmation"> I understand that if I apply more
                                    than once for injuries related to the same crime, my second application won’t be
                                    considered by CICA. </label> </div>
                        </div>
                    </div> <button type="submit" data-prevent-double-click="true"
                        class="govuk-button govuk-button--secondary" data-module="govuk-button"> Continue
                        anyway</button> <input type="hidden" name="_csrf" value="ihjsOcdp-XAWRzksu5YpE2tczpQzK02VWEKg">
                    <input type="hidden" name="_external-id" value="urn:uuid:ce66be9d-5880-4559-9a93-df15928be396">
                </form>
            </div>
        </div>
    </main>
</div>
`;

module.exports = sectionHtmlWithErrorshtml;
