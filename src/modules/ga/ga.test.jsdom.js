/* globals document */
import createCicaGa from './index';

window.CICA = {
    SERVICE_URL: 'http://www.b44e2eaa-baf5-47aa-8ac9-5d23ee2a7297.gov.uk'
};
jest.mock('js-cookie');
const jsCookie = require('js-cookie');

jsCookie.getJSON.mockImplementation(() => {
    return {
        journeyStartTime: new Date().getTime() - 10000
    };
});
describe('GA', () => {
    describe('Details element', () => {
        it('should send a tracking request', () => {
            document.body.innerHTML = `
                <details id="details-test-1" class="govuk-details" data-module="govuk-details">
                    <summary class="govuk-details__summary">
                        <span class="govuk-details__summary-text">
                            Help with nationality
                        </span>
                    </summary>
                    <div class="govuk-details__text">
                        We need to know your nationality so we can work out which elections you’re entitled to vote in. If you cannot provide your nationality, you’ll have to send copies of identity documents through the post.
                    </div>
                </details>
            `;
            const cicaGa = createCicaGa(window);
            cicaGa.init();
            window.gtag = jest.fn();
            document.querySelector('#details-test-1').click();
            expect(window.gtag).toHaveBeenCalledWith('event', 'open', {
                event_category: 'details-tag',
                event_label: 'Help with nationality',
                value: undefined,
                event_callback: undefined
            });
        });
    });

    describe('Click event', () => {
        it('should not send an event to GA', () => {
            document.body.innerHTML = `<span id="click-test-1">Click me</span>`;
            const cicaGa = createCicaGa(window);
            cicaGa.init();
            window.gtag = jest.fn();
            document.querySelector('#click-test-1').click();
            expect(window.gtag).not.toHaveBeenCalled();
        });
        it('should send an event to GA', () => {
            document.body.innerHTML = `<span id="click-test-2" class="ga-event ga-event--click">Click me</span>`;
            const cicaGa = createCicaGa(window);
            cicaGa.init();
            window.gtag = jest.fn();
            document.querySelector('#click-test-2').click();
            expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
                event_category: 'SPAN',
                event_label: 'Click me',
                value: undefined,
                event_callback: undefined
            });
        });
        it('should send an event with custom data to GA', () => {
            document.body.innerHTML = `<span id="click-test-3" class="ga-event ga-event--click" data-tracking-category="custom-tracking-category" data-tracking-label="custom-tracking-label">Click me</span>`;
            const cicaGa = createCicaGa(window);
            cicaGa.init();
            window.gtag = jest.fn();
            document.querySelector('#click-test-3').click();
            expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
                event_category: 'custom-tracking-category',
                event_label: 'custom-tracking-label',
                value: undefined,
                event_callback: undefined
            });
        });
    });

    describe('Error event', () => {
        it('should send an event to GA', () => {
            document.title =
                'Error: Are you 18 or over? - Claim criminal injuries compensation - GOV.UK';
            document.body.innerHTML = `
                <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
                    <h2 class="govuk-error-summary__title" id="error-summary-title">
                        There is a problem
                    </h2>
                    <div class="govuk-error-summary__body">
                        <ul class="govuk-list govuk-error-summary__list">
                            <li>
                                <a href="#q-applicant-are-you-18-or-over">Select yes if you are 18 or over</a>
                            </li>
                        </ul>
                    </div>
                </div>
            `;
            const cicaGa = createCicaGa(window);
            cicaGa.init();
            expect(window.gtag).toHaveBeenCalledWith('event', 'validationError', {
                event_category: 'q-applicant-are-you-18-or-over',
                event_label: 'Select yes if you are 18 or over',
                value: undefined,
                event_callback: undefined,
                non_interaction: true
            });
        });
    });

    describe('External link', () => {
        it('should send an event to GA', () => {
            document.body.innerHTML = `
                <a href="http://www.google.com" id="external-test-1">Click to go to Google</a>
            `;
            const cicaGa = createCicaGa(window);
            cicaGa.init();
            window.gtag = jest.fn();
            document.querySelector('#external-test-1').click();
            expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
                event_category: 'external-link',
                event_label: 'http://www.google.com/',
                event_callback: expect.any(Function)
            });
        });
    });

    describe('Internal link', () => {
        it('should not send an event to GA', () => {
            document.body.innerHTML = `
                <a href="http://www.b44e2eaa-baf5-47aa-8ac9-5d23ee2a7297.gov.uk/some-page-url" id="internal-test-1">Click here</a>
            `;
            const cicaGa = createCicaGa(window);
            cicaGa.init();
            window.gtag = jest.fn();
            document.querySelector('#internal-test-1').click();
            expect(window.gtag).not.toHaveBeenCalled();
        });
    });

    describe('Download link', () => {
        it('should send an event to GA', () => {
            document.body.innerHTML = `
                <a href="http://www.b44e2eaa-baf5-47aa-8ac9-5d23ee2a7297.gov.uk/stuff/stuff.zip" id="download-test-1">Click here</a>
            `;
            const cicaGa = createCicaGa(window);
            cicaGa.init();
            window.gtag = jest.fn();
            document.querySelector('#download-test-1').click();
            expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
                event_category: 'download-link',
                event_label:
                    'http://www.b44e2eaa-baf5-47aa-8ac9-5d23ee2a7297.gov.uk/stuff/stuff.zip',
                event_callback: expect.any(Function)
            });
        });
    });

    describe('charCount', () => {
        it('should send an event to GA', () => {
            document.body.innerHTML = `<input class="govuk-input" id="charcount-test-1" name="charcount-test-1" value="myvalue" type="text">`;
            const cicaGa = createCicaGa(window);
            cicaGa.init();
            window.gtag = jest.fn();
            // eslint-disable-next-line no-undef
            window.dispatchEvent(new Event('beforeunload'));
            expect(window.gtag).toHaveBeenCalledWith('event', 'charCount', {
                event_category: 'charcount-test-1',
                event_label: 7,
                non_interaction: true
            });
        });
    });

    describe('Journey duration', () => {
        it('should store a cookie', () => {
            global.window = Object.create(window);
            Object.defineProperty(window, 'location', {
                value: {
                    pathname: '/apply/confirmation'
                }
            });
            const cicaGa = createCicaGa(window);
            cicaGa.init();
            window.gtag = jest.fn();
            // simulate a subsequent page load.
            cicaGa.init();
            expect(window.gtag).toHaveBeenCalledWith('event', 'duration', {
                event_category: 'application',
                event_label: 10,
                non_interaction: true
            });
        });
    });

    describe('paste', () => {
        it('should send an event to GA', () => {
            document.body.innerHTML = `<input class="govuk-input" id="paste-test-1" name="paste-test-1" value="" type="text">`;
            const cicaGa = createCicaGa(window);
            cicaGa.init();
            window.gtag = jest.fn();
            // eslint-disable-next-line no-undef
            window.document.querySelector('#paste-test-1').dispatchEvent(new Event('paste'));
            expect(window.gtag).toHaveBeenCalledWith('event', 'paste', {
                event_category: 'paste-test-1',
                event_label: 0,
                non_interaction: true
            });
        });
    });
});
