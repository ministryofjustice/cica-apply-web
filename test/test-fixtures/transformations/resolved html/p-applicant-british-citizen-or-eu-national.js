'use strict';

const html = `
<div class="govuk-width-container">
    <main class="govuk-main-wrapper" id="main-content">
        <div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">
                <form method="post" novalidate autocomplete="off">
                    <div class="govuk-form-group">
                        <fieldset class="govuk-fieldset">
                            <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 class="govuk-fieldset__heading">
                                    Are you a British citizen or EU national?
                                </h1>
                            </legend>
                            <div class="govuk-radios govuk-radios--inline" data-module="govuk-radios">
                                <div class="govuk-radios__item">
                                    <input class="govuk-radios__input" id="q-applicant-british-citizen-or-eu-national"
                                        name="q-applicant-british-citizen-or-eu-national" type="radio" value="true">
                                    <label class="govuk-label govuk-radios__label"
                                        for="q-applicant-british-citizen-or-eu-national">
                                        Yes
                                    </label>
                                </div>
                                <div class="govuk-radios__item">
                                    <input class="govuk-radios__input" id="q-applicant-british-citizen-or-eu-national-2"
                                        name="q-applicant-british-citizen-or-eu-national" type="radio" value="false">
                                    <label class="govuk-label govuk-radios__label"
                                        for="q-applicant-british-citizen-or-eu-national-2">
                                        No
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <button type="submit" data-prevent-double-click="true" class="govuk-button"
                        data-module="govuk-button">
                        Continue
                    </button>
                    <input type="hidden" name="_csrf" value="sometoken">
                    <input type="hidden" name="_external-id" value="urn:uuid:ce66be9d-5880-4559-9a93-df15928be396">
                </form>
            </div>
        </div>
    </main>
</div>
`;

module.exports = html;
