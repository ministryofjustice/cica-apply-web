/* globals document, MouseEvent */
import createLandingPageEngagementTracker from './index';

let tracker;

function clickEl(el) {
    el.dispatchEvent(new MouseEvent('click', {bubbles: true}));
}

function submitForm(form) {
    form.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
}

// The single continue_clicked event, or undefined if none was sent.
function continueCall() {
    return window.gtag.mock.calls.find(
        call => call[0] === 'event' && call[1] === 'continue_clicked'
    );
}

beforeEach(() => {
    window.gtag = jest.fn();

    document.body.innerHTML = `
        <form id="main">
            <button data-continue="true" class="govuk-button" type="submit">Continue</button>
        </form>
        <form id="cookie">
            <button id="accept" class="govuk-button" type="submit">Accept cookies</button>
        </form>
        <a id="external" class="govuk-link" href="#">Guide</a>
    `;
    // Stop jsdom attempting real navigation on submit.
    document
        .querySelectorAll('form')
        .forEach(f => f.addEventListener('submit', e => e.preventDefault()));

    // Start every test on a path the tracker accepts.
    window.history.replaceState({}, '', '/apply/landing-page');
});

afterEach(() => {
    tracker.destroy();
    delete window.gtag;
    document.body.innerHTML = '';
});

describe('sending is gated on Continue', () => {
    test('sends one event when Continue is clicked', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        clickEl(document.querySelector('[data-continue]'));

        const call = continueCall();
        expect(call).toBeDefined();
        expect(call[2]).toEqual({event_category: 'landing_page_engagement'});
    });

    test('clicking a non-Continue .govuk-button does not send', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        clickEl(document.querySelector('#accept')); // cookie-banner style button

        expect(continueCall()).toBeUndefined();
    });

    test('submitting the Continue form sends (keyboard-submit path)', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        submitForm(document.querySelector('#main'));

        expect(continueCall()).toBeDefined();
    });

    test('submitting a different form does not send', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        submitForm(document.querySelector('#cookie'));

        expect(continueCall()).toBeUndefined();
    });

    test('fires at most once even if Continue is triggered repeatedly', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        clickEl(document.querySelector('[data-continue]'));
        clickEl(document.querySelector('[data-continue]'));
        submitForm(document.querySelector('#main'));

        const sends = window.gtag.mock.calls.filter(call => call[1] === 'continue_clicked');
        expect(sends).toHaveLength(1);
    });
});

describe('init / destroy / pathname gating', () => {
    test('does not attach on a non-matching pathname', () => {
        window.history.replaceState({}, '', '/apply/some-other-page');
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(); // no bypass

        clickEl(document.querySelector('[data-continue]'));

        expect(continueCall()).toBeUndefined();
    });

    test('attaches on a matching pathname without bypass', () => {
        window.history.replaceState({}, '', '/apply/landing-page');
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(); // no bypass

        clickEl(document.querySelector('[data-continue]'));

        expect(continueCall()).toBeDefined();
    });

    test('destroy() stops any further sending', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);
        tracker.destroy();

        clickEl(document.querySelector('[data-continue]'));

        expect(continueCall()).toBeUndefined();
    });

    test('does not throw if gtag is unavailable', () => {
        delete window.gtag;
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        expect(() => clickEl(document.querySelector('[data-continue]'))).not.toThrow();
    });
});
