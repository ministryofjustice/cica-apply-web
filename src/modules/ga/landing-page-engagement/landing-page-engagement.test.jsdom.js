/* globals document, MouseEvent */
import createLandingPageEngagementTracker from './index';

let tracker;
let mockNow;

function advance(ms) {
    mockNow += ms;
}

function setVisibility(state) {
    Object.defineProperty(document, 'visibilityState', {
        value: state,
        configurable: true
    });
}

function fireVisibilityChange() {
    document.dispatchEvent(new Event('visibilitychange'));
}

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

function continueParams() {
    const call = continueCall();
    return call ? call[2] : undefined;
}

beforeEach(() => {
    mockNow = 1000000;
    jest.spyOn(Date, 'now').mockImplementation(() => mockNow);

    setVisibility('visible');
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
    // Every test attaches document-level listeners via tracker.init(); since
    // document persists across tests in this file, a tracker left without
    // destroy() stays armed and can fire on a later test's click/submit.
    tracker.destroy();
    jest.restoreAllMocks();
    delete window.gtag;
    document.body.innerHTML = '';
});

describe('sending is gated on Continue', () => {
    test('sends one event when Continue is clicked, with raw time and the reading band', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(30000);
        clickEl(document.querySelector('[data-continue]'));

        const params = continueParams();
        expect(params).toEqual({
            event_category: 'landing_page_engagement',
            active_time_seconds: 30,
            reading_band: 'partial'
        });
    });

    test('clicking a non-Continue .govuk-button does not send', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(20000);
        clickEl(document.querySelector('#accept')); // cookie-banner style button

        expect(continueCall()).toBeUndefined();
    });

    test('submitting the Continue form sends (keyboard-submit path)', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(90000);
        submitForm(document.querySelector('#main'));

        expect(continueParams().reading_band).toBe('read');
    });

    test('submitting a different form does not send', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(20000);
        submitForm(document.querySelector('#cookie'));

        expect(continueCall()).toBeUndefined();
    });

    test('fires at most once even if Continue is triggered repeatedly', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(30000);
        clickEl(document.querySelector('[data-continue]'));
        clickEl(document.querySelector('[data-continue]'));
        submitForm(document.querySelector('#main'));

        const sends = window.gtag.mock.calls.filter(call => call[1] === 'continue_clicked');
        expect(sends).toHaveLength(1);
    });
});

describe('active-time accounting', () => {
    test('pauses while the tab is hidden and resumes when visible', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(10000); // 10s visible
        setVisibility('hidden');
        fireVisibilityChange();
        advance(60000); // 60s hidden — must NOT count
        setVisibility('visible');
        fireVisibilityChange();
        advance(20000); // 20s visible — total 30s active

        clickEl(document.querySelector('[data-continue]'));

        expect(continueParams().reading_band).toBe('partial');
    });

    test('does not bank time if the page starts hidden (prerender/background)', () => {
        setVisibility('hidden');
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(30000); // hidden the whole time — not counted
        setVisibility('visible');
        fireVisibilityChange(); // now visible, clock starts
        advance(10000); // 10s visible — total 10s active

        clickEl(document.querySelector('[data-continue]'));

        expect(continueParams().reading_band).toBe('skimmed');
    });
});

describe('reading_band boundaries', () => {
    const cases = [
        [10, 'skimmed'],
        [14, 'skimmed'],
        [15, 'partial'], // boundary: 15 is NOT < 15
        [59, 'partial'],
        [60, 'read'], // boundary
        [149, 'read'],
        [150, 'thorough'], // boundary
        [300, 'thorough']
    ];

    test.each(cases)('%is on page -> %s', (seconds, expected) => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(seconds * 1000);
        clickEl(document.querySelector('[data-continue]'));

        expect(continueParams().reading_band).toBe(expected);
    });

    test('floors partial seconds rather than rounding up', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(59999); // just under 60s — rounding would bump this to 60
        clickEl(document.querySelector('[data-continue]'));

        expect(continueParams().reading_band).toBe('partial'); // would be 'read' if rounded
    });
});

describe('init / destroy / pathname gating', () => {
    test('does not attach on a non-matching pathname', () => {
        window.history.replaceState({}, '', '/apply/some-other-page');
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(); // no bypass

        advance(30000);
        clickEl(document.querySelector('[data-continue]'));

        expect(continueCall()).toBeUndefined();
    });

    test('attaches on a matching pathname without bypass', () => {
        window.history.replaceState({}, '', '/apply/landing-page');
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(); // no bypass

        advance(30000);
        clickEl(document.querySelector('[data-continue]'));

        expect(continueCall()).toBeDefined();
    });

    test('destroy() stops any further sending', () => {
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);
        advance(10000);
        tracker.destroy();

        clickEl(document.querySelector('[data-continue]'));

        expect(continueCall()).toBeUndefined();
    });

    test('does not throw if gtag is unavailable', () => {
        delete window.gtag;
        tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);
        advance(30000);

        expect(() => clickEl(document.querySelector('[data-continue]'))).not.toThrow();
    });
});
