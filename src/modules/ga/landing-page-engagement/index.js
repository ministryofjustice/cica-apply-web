const CONTINUE_SELECTOR = '[data-continue]';

const READING_BANDS = [
    {maxSeconds: 15, label: 'skimmed'},
    {maxSeconds: 60, label: 'partial'},
    {maxSeconds: 150, label: 'read'},
    {maxSeconds: Infinity, label: 'thorough'}
];

function bandForSeconds(seconds) {
    return READING_BANDS.find(band => seconds < band.maxSeconds).label;
}

export default function createLandingPageEngagementTracker(window) {
    const doc = window.document;

    let accumulatedMs = 0;
    let segmentStart = null;
    let proceeded = false;
    let initialised = false;
    let sent = false;

    function startSegment() {
        if (segmentStart === null) {
            segmentStart = Date.now();
        }
    }

    function pauseSegment() {
        if (segmentStart !== null) {
            accumulatedMs += Date.now() - segmentStart;
            segmentStart = null;
        }
    }

    function markProceeded() {
        proceeded = true;
    }

    function handleClick(event) {
        if (event.target.closest(CONTINUE_SELECTOR)) {
            markProceeded();
        }
    }

    function handleSubmit(event) {
        // Only count a submit of the form that actually contains Continue, so
        // other forms on the page (e.g. a cookie banner) can't trigger it.
        // Covers keyboard users who submit with Enter without a button click.
        const form = event.target;
        if (
            form &&
            typeof form.querySelector === 'function' &&
            form.querySelector(CONTINUE_SELECTOR)
        ) {
            markProceeded();
        }
    }

    function sendEngagementEvent() {
        if (sent) {
            return;
        }
        sent = true;
        pauseSegment(); // close the final visible segment before reading the total

        // Only record people who actually continued.
        if (!proceeded) {
            return;
        }
        if (typeof window.gtag !== 'function') {
            return;
        }

        const activeSeconds = Math.round(accumulatedMs / 1000);

        window.gtag('event', 'page_engagement', {
            event_category: 'landing_page_engagement',
            active_time_ms: accumulatedMs,
            active_time_seconds: activeSeconds,
            reading_band: bandForSeconds(activeSeconds)
        });
    }

    function handleVisibilityChange() {
        if (doc.visibilityState === 'hidden') {
            pauseSegment();
        } else {
            startSegment();
        }
    }

    function handlePageHide() {
        sendEngagementEvent();
    }

    function init(bypassPathnameCheck = false) {
        if (initialised) {
            return;
        }
        if (bypassPathnameCheck || window.location.pathname.includes('landing-page')) {
            initialised = true;

            // Only start the clock if the page is visible now (guards against
            // pre-render / background tabs banking time nobody saw).
            if (doc.visibilityState === 'visible') {
                startSegment();
            }

            doc.addEventListener('visibilitychange', handleVisibilityChange);
            doc.addEventListener('click', handleClick, true);
            doc.addEventListener('submit', handleSubmit, true);
            window.addEventListener('pagehide', handlePageHide);
        }
    }

    function destroy() {
        if (!initialised) {
            return;
        }
        doc.removeEventListener('visibilitychange', handleVisibilityChange);
        doc.removeEventListener('click', handleClick, true);
        doc.removeEventListener('submit', handleSubmit, true);
        window.removeEventListener('pagehide', handlePageHide);
        initialised = false;
    }

    return Object.freeze({
        init,
        destroy
    });
}
