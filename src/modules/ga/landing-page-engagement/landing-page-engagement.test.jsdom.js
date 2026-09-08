/* globals document, MouseEvent */
import createLandingPageEngagementTracker from './index';

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

function firePageHide() {
    window.dispatchEvent(new Event('pagehide'));
}

function clickEl(el) {
    el.dispatchEvent(new MouseEvent('click', {bubbles: true}));
}

function submitForm(form) {
    form.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
}

// The single page_engagement event, or undefined if none was sent.
function engagementCall() {
    return window.gtag.mock.calls.find(
        call => call[0] === 'event' && call[1] === 'page_engagement'
    );
}

function engagementParams() {
    const call = engagementCall();
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
    jest.restoreAllMocks();
    delete window.gtag;
    document.body.innerHTML = '';
});

describe('sending is gated on Continue', () => {
    test('sends one event when Continue is clicked then the page unloads', () => {
        const tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(30000);
        clickEl(document.querySelector('[data-continue]'));
        advance(5000);
        firePageHide();

        const params = engagementParams();
        expect(params).toBeDefined();
        expect(params.active_time_seconds).toBe(35);
        expect(params.reading_band).toBe('partial');
    });

    test('sends nothing when the user leaves without continuing', () => {
        const tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(40000);
        firePageHide();

        expect(engagementCall()).toBeUndefined();
    });

    test('clicking a non-Continue .govuk-button does not count as proceeding', () => {
        const tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(20000);
        clickEl(document.querySelector('#accept')); // cookie-banner style button
        firePageHide();

        expect(engagementCall()).toBeUndefined();
    });

    test('submitting the Continue form counts (keyboard-submit path)', () => {
        const tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(90000);
        submitForm(document.querySelector('#main'));
        firePageHide();

        const params = engagementParams();
        expect(params).toBeDefined();
        expect(params.active_time_seconds).toBe(90);
        expect(params.reading_band).toBe('read');
    });

    test('submitting a different form does not count', () => {
        const tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(20000);
        submitForm(document.querySelector('#cookie'));
        firePageHide();

        expect(engagementCall()).toBeUndefined();
    });
});

describe('active-time accounting', () => {
    test('pauses while the tab is hidden and resumes when visible', () => {
        const tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(10000);
        setVisibility('hidden');
        fireVisibilityChange();
        advance(60000);
        setVisibility('visible');
        fireVisibilityChange();
        advance(20000);

        clickEl(document.querySelector('[data-continue]'));
        firePageHide();

        expect(engagementParams().active_time_seconds).toBe(30);
    });

    test('does not bank time if the page starts hidden (prerender/background)', () => {
        setVisibility('hidden');
        const tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(30000);
        setVisibility('visible');
        fireVisibilityChange();
        advance(10000);

        clickEl(document.querySelector('[data-continue]'));
        firePageHide();

        expect(engagementParams().active_time_seconds).toBe(10);
    });

    test('fires at most once even if pagehide fires repeatedly', () => {
        const tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(30000);
        clickEl(document.querySelector('[data-continue]'));
        firePageHide();
        firePageHide();
        firePageHide();

        const sends = window.gtag.mock.calls.filter(call => call[1] === 'page_engagement');
        expect(sends).toHaveLength(1);
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
        const tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);

        advance(seconds * 1000);
        clickEl(document.querySelector('[data-continue]'));
        firePageHide();

        expect(engagementParams().reading_band).toBe(expected);
    });
});

describe('init / destroy / pathname gating', () => {
    test('does not attach on a non-matching pathname', () => {
        window.history.replaceState({}, '', '/apply/some-other-page');
        const tracker = createLandingPageEngagementTracker(window);
        tracker.init(); // no bypass

        advance(30000);
        clickEl(document.querySelector('[data-continue]'));
        firePageHide();

        expect(engagementCall()).toBeUndefined();
    });

    test('attaches on a matching pathname without bypass', () => {
        window.history.replaceState({}, '', '/apply/landing-page');
        const tracker = createLandingPageEngagementTracker(window);
        tracker.init(); // no bypass

        advance(30000);
        clickEl(document.querySelector('[data-continue]'));
        firePageHide();

        expect(engagementCall()).toBeDefined();
    });

    test('destroy() stops any further sending', () => {
        const tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);
        advance(10000);
        tracker.destroy();

        clickEl(document.querySelector('[data-continue]'));
        firePageHide();

        expect(engagementCall()).toBeUndefined();
    });

    test('does not throw if gtag is unavailable', () => {
        delete window.gtag;
        const tracker = createLandingPageEngagementTracker(window);
        tracker.init(true);
        advance(30000);
        clickEl(document.querySelector('[data-continue]'));

        expect(() => firePageHide()).not.toThrow();
    });
});
