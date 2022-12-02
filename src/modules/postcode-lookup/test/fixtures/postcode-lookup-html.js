const victimAddressHtml = `<form method="post" autocomplete="off"><fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
Your address
</h1>
</legend>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-building-and-street">
Building and street
</label>
<input class="govuk-input" id="q-applicant-building-and-street" name="q-applicant-building-and-street"
type="text" autocomplete="address-line1">
</div>

<div class="govuk-form-group">
<label class="govuk-label govuk-visually-hidden" for="q-applicant-building-and-street-2">
Building and street line 2
</label>
<input class="govuk-input" id="q-applicant-building-and-street-2"
name="q-applicant-building-and-street-2" type="text" autocomplete="address-line2">
</div>

<div class="govuk-form-group">
<label class="govuk-label govuk-visually-hidden" for="q-applicant-building-and-street-2">
Building and street line 2
</label>
<input class="govuk-input" id="q-applicant-building-and-street-3"
name="q-applicant-building-and-street-3" type="text" autocomplete="address-line3">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-town-or-city">
Town or city
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-town-or-city"
name="q-applicant-town-or-city" type="text" autocomplete="address-level2">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-county">
County (optional)
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-county" name="q-applicant-county"
type="text" autocomplete="address-level1">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-postcode">
Postcode (optional)
</label>
<input class="govuk-input govuk-input--width-10" id="q-applicant-postcode" name="q-applicant-postcode"
type="text" autocomplete="postal-code">
</div>
</fieldset></form>`;

const postcodeLookupHtmlEnhanced = `<form method="post" autocomplete="off"><fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
Your address
</h1>
</legend><div id="fill-out-the-fields-manually-hint" class="govuk-hint">Enter a UK postcode to search for your address, or fill out the fields manually.</div><div id="address-search" class="govuk-form-group"><label class="govuk-label" for="address-search-input">Postcode</label><input class="govuk-input govuk-input--width-10" id="address-search-input" name="address-search-input" type="search" autocomplete="postal-code"></div><button id="search-button" class="govuk-button govuk-button--secondary" data-module="govuk-button" type="button">Find Address</button><div class="govuk-form-group" id="address-search-results" name="address-search-results" role="region" aria-live="polite" style="display: none;"><label class="govuk-label" for="address-search-results-dropdown">Select an address</label><select class="govuk-select" id="address-search-results-dropdown" name="address-search-results-dropdown"></select></div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-building-and-street">
Building and street
</label>
<input class="govuk-input" id="q-applicant-building-and-street" name="q-applicant-building-and-street" type="text" autocomplete="address-line1">
</div>

<div class="govuk-form-group">
<label class="govuk-label govuk-visually-hidden" for="q-applicant-building-and-street-2">
Building and street line 2
</label>
<input class="govuk-input" id="q-applicant-building-and-street-2" name="q-applicant-building-and-street-2" type="text" autocomplete="address-line2">
</div>

<div class="govuk-form-group">
<label class="govuk-label govuk-visually-hidden" for="q-applicant-building-and-street-2">
Building and street line 2
</label>
<input class="govuk-input" id="q-applicant-building-and-street-3" name="q-applicant-building-and-street-3" type="text" autocomplete="address-line3">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-town-or-city">
Town or city
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-town-or-city" name="q-applicant-town-or-city" type="text" autocomplete="address-level2">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-county">
County (optional)
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-county" name="q-applicant-county" type="text" autocomplete="address-level1">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-postcode">
Postcode (optional)
</label>
<input class="govuk-input govuk-input--width-10" id="q-applicant-postcode" name="q-applicant-postcode" type="text" autocomplete="postal-code">
</div>

</fieldset></form>`;

module.exports = {
    victimAddressHtml,
    postcodeLookupHtmlEnhanced
};
