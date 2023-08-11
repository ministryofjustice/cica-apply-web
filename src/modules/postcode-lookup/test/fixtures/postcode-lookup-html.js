const victimAddressHtml = `<form method="post" autocomplete="off"><fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
What is your address?
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
<label class="govuk-label govuk-visually-hidden" for="q-applicant-building-and-street-3">
Building and street line 3
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
Postcode
</label>
<div id="q-applicant-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-applicant-postcode" name="q-applicant-postcode" type="text" aria-describedby="q-applicant-postcode-hint" autocomplete="postal-code">
</div>
</fieldset></form>`;

const postcodeLookupHtmlEnhanced = `<form method="post" autocomplete="off"><fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
What is your address?
</h1>
</legend>
<div id="fill-out-the-fields-manually-hint" class="govuk-hint">
Enter a UK postcode to search for and select an address. Or, you can enter the address manually.
</div>
<div id="address-search" class="govuk-form-group">
<label class="govuk-label" for="address-search-input">
Postcode
</label>
<input class="govuk-input govuk-input--width-10" id="address-search-input" name="address-search-input" type="search" autocomplete="postal-code"></div><button id="search-button" class="govuk-button govuk-button--secondary ga-event ga-event--click" data-module="govuk-button" type="button" data-tracking-label="Find address" data-tracking-category="button">Find address</button><div class="govuk-form-group" id="address-search-results" name="address-search-results" role="region" aria-live="polite" style="display: none;"><label class="govuk-label" for="address-search-results-dropdown">Select an address</label><select class="govuk-select" id="address-search-results-dropdown" name="address-search-results-dropdown"></select></div>

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
<label class="govuk-label govuk-visually-hidden" for="q-applicant-building-and-street-3">
Building and street line 3
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
Postcode
</label>
<div id="q-applicant-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-applicant-postcode" name="q-applicant-postcode" type="text" aria-describedby="q-applicant-postcode-hint" autocomplete="postal-code">
</div>

</fieldset></form>`;

const invalidPostcodeErrorEnhancedHtml = `<form method="post" autocomplete="off">
<div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
<h2 class="govuk-error-summary__title" id="error-summary-title">
There is a problem
</h2>
<div class="govuk-error-summary__body"><ul class="govuk-list govuk-error-summary__list"><li><a href="#address-search-input">Enter a valid postcode</a></li></ul></div>
</div>
<fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
What is your address?
</h1>
</legend>
<div id="fill-out-the-fields-manually-hint" class="govuk-hint">Enter a UK postcode to search for and select an address. Or, you can enter the address manually.</div>
<div id="address-search" class="govuk-form-group govuk-form-group--error">
<label class="govuk-label" for="address-search-input">Postcode</label>
<span id="address-search-input-error" class="govuk-error-message">Enter a valid postcode<span class="govuk-visually-hidden">Error:</span></span>
<input class="govuk-input govuk-input--error govuk-input--width-10" id="address-search-input" name="address-search-input" type="search" autocomplete="postal-code" aria-describedby="address-search-input-error">
</div>
<button id="search-button" class="govuk-button govuk-button--secondary ga-event ga-event--click" data-module="govuk-button" type="button" data-tracking-label="Find address" data-tracking-category="button">Find address</button>
<div class="govuk-form-group" id="address-search-results" name="address-search-results" role="region" aria-live="polite" style="display: none;">
<label class="govuk-label" for="address-search-results-dropdown">Select an address</label>
<select class="govuk-select" id="address-search-results-dropdown" name="address-search-results-dropdown"></select>
</div>
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
<label class="govuk-label govuk-visually-hidden" for="q-applicant-building-and-street-3">
Building and street line 3
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
Postcode
</label>
<div id="q-applicant-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-applicant-postcode" name="q-applicant-postcode" type="text" aria-describedby="q-applicant-postcode-hint" autocomplete="postal-code">
</div>
</fieldset>
</form>`;

const emptyPostcodeInputErrorEnhancedHtml = `<form method="post" autocomplete="off">
<div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
<h2 class="govuk-error-summary__title" id="error-summary-title">
There is a problem
</h2>
<div class="govuk-error-summary__body"><ul class="govuk-list govuk-error-summary__list"><li><a href="#address-search-input">Enter your postcode</a></li></ul></div>
</div>
<fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
What is your address?
</h1>
</legend>
<div id="fill-out-the-fields-manually-hint" class="govuk-hint">Enter a UK postcode to search for and select an address. Or, you can enter the address manually.</div>
<div id="address-search" class="govuk-form-group govuk-form-group--error">
<label class="govuk-label" for="address-search-input">Postcode</label>
<span id="address-search-input-error" class="govuk-error-message">Enter your postcode<span class="govuk-visually-hidden">Error:</span></span>
<input class="govuk-input govuk-input--error govuk-input--width-10" id="address-search-input" name="address-search-input" type="search" autocomplete="postal-code" aria-describedby="address-search-input-error">
</div>
<button id="search-button" class="govuk-button govuk-button--secondary ga-event ga-event--click" data-module="govuk-button" type="button" data-tracking-label="Find address" data-tracking-category="button">Find address</button>
<div class="govuk-form-group" id="address-search-results" name="address-search-results" role="region" aria-live="polite" style="display: none;">
<label class="govuk-label" for="address-search-results-dropdown">Select an address</label>
<select class="govuk-select" id="address-search-results-dropdown" name="address-search-results-dropdown"></select>
</div>
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
<label class="govuk-label govuk-visually-hidden" for="q-applicant-building-and-street-3">
Building and street line 3
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
Postcode
</label>
<div id="q-applicant-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-applicant-postcode" name="q-applicant-postcode" type="text" aria-describedby="q-applicant-postcode-hint" autocomplete="postal-code">
</div>
</fieldset>
</form>`;

const emptyPostcodeInputForSomeoneElseErrorEnhancedHtml = `<form method="post" autocomplete="off">
<div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
<h2 class="govuk-error-summary__title" id="error-summary-title">
There is a problem
</h2>
<div class="govuk-error-summary__body"><ul class="govuk-list govuk-error-summary__list"><li><a href="#address-search-input">Enter their postcode</a></li></ul></div>
</div>
<fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
What is their address?
</h1>
</legend>
<div id="fill-out-the-fields-manually-hint" class="govuk-hint">Enter a UK postcode to search for and select an address. Or, you can enter the address manually.</div>
<div id="address-search" class="govuk-form-group govuk-form-group--error">
<label class="govuk-label" for="address-search-input">Postcode</label>
<span id="address-search-input-error" class="govuk-error-message">Enter their postcode<span class="govuk-visually-hidden">Error:</span></span>
<input class="govuk-input govuk-input--error govuk-input--width-10" id="address-search-input" name="address-search-input" type="search" autocomplete="postal-code" aria-describedby="address-search-input-error">
</div>
<button id="search-button" class="govuk-button govuk-button--secondary ga-event ga-event--click" data-module="govuk-button" type="button" data-tracking-label="Find address" data-tracking-category="button">Find address</button>
<div class="govuk-form-group" id="address-search-results" name="address-search-results" role="region" aria-live="polite" style="display: none;">
<label class="govuk-label" for="address-search-results-dropdown">Select an address</label>
<select class="govuk-select" id="address-search-results-dropdown" name="address-search-results-dropdown"></select>
</div>
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
<label class="govuk-label govuk-visually-hidden" for="q-applicant-building-and-street-3">
Building and street line 3
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
Postcode
</label>
<div id="q-applicant-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-applicant-postcode" name="q-applicant-postcode" type="text" aria-describedby="q-applicant-postcode-hint" autocomplete="postal-code">
</div>
</fieldset>
</form>`;

const noAddressesFoundErrorEnhancedHtml = `<form method="post" autocomplete="off">
<div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
<h2 class="govuk-error-summary__title" id="error-summary-title">
There is a problem</h2>
<div class="govuk-error-summary__body"><ul class="govuk-list govuk-error-summary__list">
<li>We could not find any addresses for that postcode. Check your postcode is correct, or enter your address manually.</li></ul></div></div>
<fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
What is your address?
</h1>
</legend>
<div id="fill-out-the-fields-manually-hint" class="govuk-hint">
Enter a UK postcode to search for and select an address. Or, you can enter the address manually.
</div>
<div id="address-search" class="govuk-form-group">
<label class="govuk-label" for="address-search-input">Postcode</label>
<input class="govuk-input govuk-input--width-10" id="address-search-input" name="address-search-input" type="search" autocomplete="postal-code">
</div>
<button id="search-button" class="govuk-button govuk-button--secondary ga-event ga-event--click" data-module="govuk-button" type="button" data-tracking-label="Find address" data-tracking-category="button">
Find address
</button>
<div class="govuk-form-group" id="address-search-results" name="address-search-results" role="region" aria-live="polite" style="display: none;">
<label class="govuk-label" for="address-search-results-dropdown">Select an address</label>
<select class="govuk-select" id="address-search-results-dropdown" name="address-search-results-dropdown"></select>
</div>
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
<label class="govuk-label govuk-visually-hidden" for="q-applicant-building-and-street-3">
Building and street line 3
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
Postcode
</label>
<div id="q-applicant-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-applicant-postcode" name="q-applicant-postcode" type="text" aria-describedby="q-applicant-postcode-hint" autocomplete="postal-code">
</div>
</fieldset>
</form>`;

const fetchApiReponseNotOkayErrorEnhancedHtml = `<form method="post" autocomplete="off">
<div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
<h2 class="govuk-error-summary__title" id="error-summary-title">
There is a problem
</h2>
<div class="govuk-error-summary__body"><ul class="govuk-list govuk-error-summary__list"><li>The system is experiencing an issue. Enter your address manually.</li></ul></div>
</div>
<fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
What is your address?
</h1>
</legend>
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
<label class="govuk-label govuk-visually-hidden" for="q-applicant-building-and-street-3">
Building and street line 3
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
Postcode
</label>
<div id="q-applicant-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-applicant-postcode" name="q-applicant-postcode" type="text" aria-describedby="q-applicant-postcode-hint" autocomplete="postal-code">
</div>
</fieldset>
</form>`;

const victimAddressSomeoneElseHtml = `<form method="post" autocomplete="off"><fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
What is their address?
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
<label class="govuk-label govuk-visually-hidden" for="q-applicant-building-and-street-3">
Building and street line 3
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
Postcode
</label>
<div id="q-applicant-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-applicant-postcode" name="q-applicant-postcode" type="text" aria-describedby="q-applicant-postcode-hint" autocomplete="postal-code">
</div>
</fieldset></form>`;

const mainApplicantAddressHtml = `<form method="post" autocomplete="off"><fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
What is your address?
</h1>
</legend>

<div class="govuk-form-group">
<label class="govuk-label" for="q-mainapplicant-building-and-street">
Building and street
</label>
<input class="govuk-input" id="q-mainapplicant-building-and-street" name="q-mainapplicant-building-and-street"
type="text" autocomplete="address-line1">
</div>

<div class="govuk-form-group">
<label class="govuk-label govuk-visually-hidden" for="q-mainapplicant-building-and-street-2">
Building and street line 2
</label>
<input class="govuk-input" id="q-mainapplicant-building-and-street-2"
name="q-mainapplicant-building-and-street-2" type="text" autocomplete="address-line2">
</div>

<div class="govuk-form-group">
<label class="govuk-label govuk-visually-hidden" for="q-mainapplicant-building-and-street-3">
Building and street line 3
</label>
<input class="govuk-input" id="q-mainapplicant-building-and-street-3"
name="q-mainapplicant-building-and-street-3" type="text" autocomplete="address-line3">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-mainapplicant-town-or-city">
Town or city
</label>
<input class="govuk-input govuk-input--width-20" id="q-mainapplicant-town-or-city"
name="q-mainapplicant-town-or-city" type="text" autocomplete="address-level2">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-mainapplicant-county">
County (optional)
</label>
<input class="govuk-input govuk-input--width-20" id="q-mainapplicant-county" name="q-mainapplicant-county"
type="text" autocomplete="address-level1">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-mainapplicant-postcode">
Postcode
</label>
<div id="q-mainapplicant-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-mainapplicant-postcode" name="q-mainapplicant-postcode" type="text" aria-describedby="q-mainapplicant-postcode-hint" autocomplete="postal-code">
</div>
</fieldset></form>`;

const mainApplicantPostcodeLookupHtmlEnhanced = `<form method="post" autocomplete="off"><fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
What is your address?
</h1>
</legend>
<div id="fill-out-the-fields-manually-hint" class="govuk-hint">
Enter a UK postcode to search for and select an address. Or, you can enter the address manually.
</div>
<div id="address-search" class="govuk-form-group">
<label class="govuk-label" for="address-search-input">
Postcode
</label>
<input class="govuk-input govuk-input--width-10" id="address-search-input" name="address-search-input" type="search" autocomplete="postal-code"></div><button id="search-button" class="govuk-button govuk-button--secondary ga-event ga-event--click" data-module="govuk-button" type="button" data-tracking-label="Find address" data-tracking-category="button">Find address</button><div class="govuk-form-group" id="address-search-results" name="address-search-results" role="region" aria-live="polite" style="display: none;"><label class="govuk-label" for="address-search-results-dropdown">Select an address</label><select class="govuk-select" id="address-search-results-dropdown" name="address-search-results-dropdown"></select></div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-mainapplicant-building-and-street">
Building and street
</label>
<input class="govuk-input" id="q-mainapplicant-building-and-street" name="q-mainapplicant-building-and-street" type="text" autocomplete="address-line1">
</div>

<div class="govuk-form-group">
<label class="govuk-label govuk-visually-hidden" for="q-mainapplicant-building-and-street-2">
Building and street line 2
</label>
<input class="govuk-input" id="q-mainapplicant-building-and-street-2" name="q-mainapplicant-building-and-street-2" type="text" autocomplete="address-line2">
</div>

<div class="govuk-form-group">
<label class="govuk-label govuk-visually-hidden" for="q-mainapplicant-building-and-street-3">
Building and street line 3
</label>
<input class="govuk-input" id="q-mainapplicant-building-and-street-3" name="q-mainapplicant-building-and-street-3" type="text" autocomplete="address-line3">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-mainapplicant-town-or-city">
Town or city
</label>
<input class="govuk-input govuk-input--width-20" id="q-mainapplicant-town-or-city" name="q-mainapplicant-town-or-city" type="text" autocomplete="address-level2">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-mainapplicant-county">
County (optional)
</label>
<input class="govuk-input govuk-input--width-20" id="q-mainapplicant-county" name="q-mainapplicant-county" type="text" autocomplete="address-level1">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-mainapplicant-postcode">
Postcode
</label>
<div id="q-mainapplicant-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-mainapplicant-postcode" name="q-mainapplicant-postcode" type="text" aria-describedby="q-mainapplicant-postcode-hint" autocomplete="postal-code">
</div>

</fieldset></form>`;

const gpAddressHtml = `<form method="post" autocomplete="off">
<fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
What is the GP's address?
</h1>
</legend>

<div class="govuk-form-group">
<label class="govuk-label" for="q-gp-organisation-name">
Practice name
</label>
<input class="govuk-input govuk-input--width-30" id="q-gp-organisation-name" name="q-gp-organisation-name" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-gp-building-and-street">
Building and street
</label>
<input class="govuk-input" id="q-gp-building-and-street" name="q-gp-building-and-street" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-gp-building-and-street-2">
Building and street line 2
</label>
<input class="govuk-input" id="q-gp-building-and-street-2" name="q-gp-building-and-street-2" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-gp-building-and-street-3">
Building and street line 3
</label>
<input class="govuk-input govuk-input--width-20" id="q-gp-building-and-street-3" name="q-gp-building-and-street-3" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-gp-town-or-city">
Town or city
</label>
<input class="govuk-input govuk-input--width-20" id="q-gp-town-or-city" name="q-gp-town-or-city" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-gp-county">
County (optional)
</label>
<input class="govuk-input govuk-input--width-20" id="q-gp-county" name="q-gp-county" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-gp-postcode">
Postcode
</label>
<div id="q-gp-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-gp-postcode" name="q-gp-postcode" type="text" aria-describedby="q-gp-postcode-hint" autocomplete="postal-code">
</div>

</fieldset></form>`;

const emptyPostcodeInputForGpAddressErrorEnhancedHtml = `<form method="post" autocomplete="off">
<div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>
<div class="govuk-error-summary__body">
<ul class="govuk-list govuk-error-summary__list">
<li><a href="#address-search-input">Enter the postcode</a></li>
</ul>
</div>
</div>
<fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">What is the GP's address?</h1>
</legend>
<div id="fill-out-the-fields-manually-hint" class="govuk-hint">
Enter a UK postcode to search for and select an address. Or, you can enter the address manually.
</div>
<div id="address-search" class="govuk-form-group govuk-form-group--error">
<label class="govuk-label" for="address-search-input">
Postcode
</label>
<span id="address-search-input-error" class="govuk-error-message">
Enter the postcode<span class="govuk-visually-hidden">Error:</span>
</span>
<input class="govuk-input govuk-input--error govuk-input--width-10" id="address-search-input" name="address-search-input" type="search" autocomplete="postal-code" aria-describedby="address-search-input-error">
</div>
<button id="search-button" class="govuk-button govuk-button--secondary ga-event ga-event--click" data-module="govuk-button" type="button" data-tracking-label="Find address" data-tracking-category="button">
Find address
</button>
<div class="govuk-form-group" id="address-search-results" name="address-search-results" role="region" aria-live="polite" style="display: none;">
<label class="govuk-label" for="address-search-results-dropdown">
Select an address
</label>
<select class="govuk-select" id="address-search-results-dropdown" name="address-search-results-dropdown">
</select>
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-gp-organisation-name">
Practice name
</label>
<input class="govuk-input govuk-input--width-30" id="q-gp-organisation-name" name="q-gp-organisation-name" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-gp-building-and-street">
Building and street
</label>
<input class="govuk-input" id="q-gp-building-and-street" name="q-gp-building-and-street" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-gp-building-and-street-2">
Building and street line 2
</label>
<input class="govuk-input" id="q-gp-building-and-street-2" name="q-gp-building-and-street-2" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-gp-building-and-street-3">
Building and street line 3
</label>
<input class="govuk-input govuk-input--width-20" id="q-gp-building-and-street-3" name="q-gp-building-and-street-3" type="text"></div><div class="govuk-form-group">
<label class="govuk-label" for="q-gp-town-or-city">
Town or city
</label>
<input class="govuk-input govuk-input--width-20" id="q-gp-town-or-city" name="q-gp-town-or-city" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-gp-county">
County (optional)
</label>
<input class="govuk-input govuk-input--width-20" id="q-gp-county" name="q-gp-county" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-gp-postcode">
Postcode
</label>
<div id="q-gp-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-gp-postcode" name="q-gp-postcode" type="text" aria-describedby="q-gp-postcode-hint" autocomplete="postal-code">
</div>
</fieldset>
</form>`;

const dentistAddressHtml = `<form method="post" autocomplete="off">
<fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
What is the dentist's address?
</h1>
</legend>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-organisation-name">
Practice name
</label>
<input class="govuk-input govuk-input--width-30" id="q-applicant-dentist-organisation-name" name="q-applicant-dentist-organisation-name" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-building-and-street">
Building and street
</label>
<input class="govuk-input" id="q-applicant-dentist-building-and-street" name="q-applicant-dentist-building-and-street" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-building-and-street-2">
Building and street line 2
</label>
<input class="govuk-input" id="q-applicant-dentist-building-and-street-2" name="q-applicant-dentist-building-and-street-2" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-building-and-street-3">
Building and street line 3
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-dentist-building-and-street-3" name="q-applicant-dentist-building-and-street-3" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-town-or-city">
Town or city
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-dentist-town-or-city" name="q-applicant-dentist-town-or-city" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-county">
County (optional)
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-dentist-county" name="q-applicant-dentist-county" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-postcode">
Postcode
</label>
<div id="q-applicant-dentist-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-applicant-dentist-postcode" name="q-applicant-dentist-postcode" type="text" aria-describedby="q-applicant-dentist-postcode-hint" autocomplete="postal-code">
</div>

</fieldset></form>`;

const emptyPostcodeInputForDentistAddressErrorEnhancedHtml = `<form method="post" autocomplete="off">
<div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>
<div class="govuk-error-summary__body">
<ul class="govuk-list govuk-error-summary__list">
<li><a href="#address-search-input">Enter the postcode</a></li>
</ul>
</div>
</div>
<fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">What is the dentist's address?</h1>
</legend>
<div id="fill-out-the-fields-manually-hint" class="govuk-hint">
Enter a UK postcode to search for and select an address. Or, you can enter the address manually.
</div>
<div id="address-search" class="govuk-form-group govuk-form-group--error">
<label class="govuk-label" for="address-search-input">
Postcode
</label>
<span id="address-search-input-error" class="govuk-error-message">
Enter the postcode<span class="govuk-visually-hidden">Error:</span>
</span>
<input class="govuk-input govuk-input--error govuk-input--width-10" id="address-search-input" name="address-search-input" type="search" autocomplete="postal-code" aria-describedby="address-search-input-error">
</div>
<button id="search-button" class="govuk-button govuk-button--secondary ga-event ga-event--click" data-module="govuk-button" type="button" data-tracking-label="Find address" data-tracking-category="button">
Find address
</button>
<div class="govuk-form-group" id="address-search-results" name="address-search-results" role="region" aria-live="polite" style="display: none;">
<label class="govuk-label" for="address-search-results-dropdown">
Select an address
</label>
<select class="govuk-select" id="address-search-results-dropdown" name="address-search-results-dropdown">
</select>
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-organisation-name">
Practice name
</label>
<input class="govuk-input govuk-input--width-30" id="q-applicant-dentist-organisation-name" name="q-applicant-dentist-organisation-name" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-building-and-street">
Building and street
</label>
<input class="govuk-input" id="q-applicant-dentist-building-and-street" name="q-applicant-dentist-building-and-street" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-building-and-street-2">
Building and street line 2
</label>
<input class="govuk-input" id="q-applicant-dentist-building-and-street-2" name="q-applicant-dentist-building-and-street-2" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-building-and-street-3">
Building and street line 3
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-dentist-building-and-street-3" name="q-applicant-dentist-building-and-street-3" type="text"></div><div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-town-or-city">
Town or city
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-dentist-town-or-city" name="q-applicant-dentist-town-or-city" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-county">
County (optional)
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-dentist-county" name="q-applicant-dentist-county" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-dentist-postcode">
Postcode
</label>
<div id="q-applicant-dentist-postcode-hint" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-applicant-dentist-postcode" name="q-applicant-dentist-postcode" type="text" aria-describedby="q-applicant-dentist-postcode-hint" autocomplete="postal-code">
</div>
</fieldset>
</form>`;

const treatmentAddressHtml = `<form method="post" autocomplete="off">
<fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">
Where did you have treatment?
</h1>
</legend>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-organisation-name">
Practice name
</label>
<input class="govuk-input govuk-input--width-30" id="q-applicant-treatment-organisation-name" name="q-applicant-treatment-organisation-name" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-building-and-street">
Building and street
</label>
<input class="govuk-input" id="q-applicant-treatment-building-and-street" name="q-applicant-treatment-building-and-street" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-building-and-street-2">
Building and street line 2
</label>
<input class="govuk-input" id="q-applicant-treatment-building-and-street-2" name="q-applicant-treatment-building-and-street-2" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-building-and-street-3">
Building and street line 3
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-treatment-building-and-street-3" name="q-applicant-treatment-building-and-street-3" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-town-or-city">
Town or city
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-treatment-town-or-city" name="q-applicant-treatment-town-or-city" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-county">
County (optional)
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-treatment-county" name="q-applicant-treatment-county" type="text">
</div>

<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-postcode">
Postcode
</label>
<div id="q-applicant-treatment-postcode" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-applicant-treatment-postcode" name="q-applicant-treatment-postcode" type="text" aria-describedby="q-applicant-treatment-postcode-hint" autocomplete="postal-code">
</div>

</fieldset></form>`;

const emptyPostcodeInputForTreatmentAddressErrorEnhancedHtml = `<form method="post" autocomplete="off">
<div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>
<div class="govuk-error-summary__body">
<ul class="govuk-list govuk-error-summary__list">
<li><a href="#address-search-input">Enter the postcode</a></li>
</ul>
</div>
</div>
<fieldset class="govuk-fieldset">
<legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
<h1 class="govuk-fieldset__heading">Where did you have treatment?</h1>
</legend>
<div id="fill-out-the-fields-manually-hint" class="govuk-hint">
Enter a UK postcode to search for and select an address. Or, you can enter the address manually.
</div>
<div id="address-search" class="govuk-form-group govuk-form-group--error">
<label class="govuk-label" for="address-search-input">
Postcode
</label>
<span id="address-search-input-error" class="govuk-error-message">
Enter the postcode<span class="govuk-visually-hidden">Error:</span>
</span>
<input class="govuk-input govuk-input--error govuk-input--width-10" id="address-search-input" name="address-search-input" type="search" autocomplete="postal-code" aria-describedby="address-search-input-error">
</div>
<button id="search-button" class="govuk-button govuk-button--secondary ga-event ga-event--click" data-module="govuk-button" type="button" data-tracking-label="Find address" data-tracking-category="button">
Find address
</button>
<div class="govuk-form-group" id="address-search-results" name="address-search-results" role="region" aria-live="polite" style="display: none;">
<label class="govuk-label" for="address-search-results-dropdown">
Select an address
</label>
<select class="govuk-select" id="address-search-results-dropdown" name="address-search-results-dropdown">
</select>
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-organisation-name">
Practice name
</label>
<input class="govuk-input govuk-input--width-30" id="q-applicant-treatment-organisation-name" name="q-applicant-treatment-organisation-name" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-building-and-street">
Building and street
</label>
<input class="govuk-input" id="q-applicant-treatment-building-and-street" name="q-applicant-treatment-building-and-street" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-building-and-street-2">
Building and street line 2
</label>
<input class="govuk-input" id="q-applicant-treatment-building-and-street-2" name="q-applicant-treatment-building-and-street-2" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-building-and-street-3">
Building and street line 3
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-treatment-building-and-street-3" name="q-applicant-treatment-building-and-street-3" type="text"></div><div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-town-or-city">
Town or city
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-treatment-town-or-city" name="q-applicant-treatment-town-or-city" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-county">
County (optional)
</label>
<input class="govuk-input govuk-input--width-20" id="q-applicant-treatment-county" name="q-applicant-treatment-county" type="text">
</div>
<div class="govuk-form-group">
<label class="govuk-label" for="q-applicant-treatment-postcode">
Postcode
</label>
<div id="q-applicant-treatment-postcode" class="govuk-hint">
This can be an international postal or zip code
</div>
<input class="govuk-input govuk-input--width-10" id="q-applicant-treatment-postcode" name="q-applicant-treatment-postcode" type="text" aria-describedby="q-applicant-treatment-postcode-hint" autocomplete="postal-code">
</div>
</fieldset>
</form>`;

module.exports = {
    victimAddressHtml,
    postcodeLookupHtmlEnhanced,
    invalidPostcodeErrorEnhancedHtml,
    noAddressesFoundErrorEnhancedHtml,
    fetchApiReponseNotOkayErrorEnhancedHtml,
    victimAddressSomeoneElseHtml,
    emptyPostcodeInputErrorEnhancedHtml,
    emptyPostcodeInputForSomeoneElseErrorEnhancedHtml,
    mainApplicantAddressHtml,
    mainApplicantPostcodeLookupHtmlEnhanced,
    gpAddressHtml,
    emptyPostcodeInputForGpAddressErrorEnhancedHtml,
    dentistAddressHtml,
    emptyPostcodeInputForDentistAddressErrorEnhancedHtml,
    treatmentAddressHtml,
    emptyPostcodeInputForTreatmentAddressErrorEnhancedHtml
};
