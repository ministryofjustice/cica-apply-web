const CONTINUE_SELECTOR = '[data-continue]';

export default function createLandingPageEngagementTracker(window) {
    const doc = window.document;

    let initialised = false;
    let sent = false;

    function sendContinueEvent() {
        if (sent) {
            return;
        }
        sent = true;
        if (typeof window.gtag !== 'function') {
            return;
        }

        // Duration/engagement metrics are covered by GA4's own
        // engagement_time_msec — this just marks the conversion moment.
        window.gtag('event', 'continue_clicked', {
            event_category: 'landing_page_engagement'
        });
    }

    function handleClick(event) {
        const {target} = event;
        if (target && typeof target.closest === 'function' && target.closest(CONTINUE_SELECTOR)) {
            sendContinueEvent();
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
            sendContinueEvent();
        }
    }

    function init(bypassPathnameCheck = false) {
        if (initialised) {
            return;
        }
        if (bypassPathnameCheck || window.location.pathname.includes('landing-page')) {
            initialised = true;
            doc.addEventListener('click', handleClick, true);
            doc.addEventListener('submit', handleSubmit, true);
        }
    }

    function destroy() {
        if (!initialised) {
            return;
        }
        doc.removeEventListener('click', handleClick, true);
        doc.removeEventListener('submit', handleSubmit, true);
        initialised = false;
    }

    return Object.freeze({
        init,
        destroy
    });
}
