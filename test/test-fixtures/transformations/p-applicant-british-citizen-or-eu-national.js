'use strict';

const transform = `
{% from "radios/macro.njk" import govukRadios %}

{{ govukRadios({
    "idPrefix": "q-applicant-british-citizen-or-eu-national",
    "name": "q-applicant-british-citizen-or-eu-national",
    "fieldset": {
        "legend": {
            "text": "Are you a British citizen or EU national?",
            "isPageHeading": true,
            "classes": "govuk-fieldset__legend--xl"
        }
    },
    "hint": null,
    "items": [
        {
            "value": true,
            "text": "Yes"
        },
        {
            "value": false,
            "text": "No"
        }
    ],
    "classes": "govuk-radios--inline"
}) }}`;

module.exports = transform;
