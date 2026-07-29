// Scroll tracker to watch landing-page
export default function createGAScrollTracker(window) {
    const pageLoadTime = Date.now();
    const milestones = [25, 50, 75, 100];
    const reachedMilestones = new Set();

    let firstMilestoneTime = null;
    let initialised = false;
    let ticking = false;

    function getScrollPercentage() {
        const windowHeight = window.innerHeight;
        const documentHeight = window.document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || window.pageYOffset;
        const scrollableHeight = documentHeight - windowHeight;

        if (scrollableHeight === 0) {
            return 0;
        }
        return Math.min(100, Math.round((scrollTop / scrollableHeight) * 100));
    }

    function getReadingPattern(timeSinceFirstMilestoneMs) {
        if (timeSinceFirstMilestoneMs < 3000) {
            return 'instant';
        }
        if (timeSinceFirstMilestoneMs < 15000) {
            return 'quick';
        }
        if (timeSinceFirstMilestoneMs < 45000) {
            return 'moderate';
        }
        return 'engaged';
    }

    function sendMilestoneEvent(milestone) {
        const now = Date.now();
        const timeOnPageMs = now - pageLoadTime;

        // Straight-to-bottom users reach 100 shortly after their first
        // milestone and skip the intermediate ones. Readers spread these out.
        const timeSinceFirstMilestoneMs =
            firstMilestoneTime === null ? 0 : now - firstMilestoneTime;

        window.gtag('event', 'scroll_milestone', {
            event_category: 'landing_page_engagement',
            event_label: `milestone_${milestone}`,
            value: milestone,
            scroll_milestone: milestone,
            time_on_page_ms: timeOnPageMs,
            time_since_first_milestone_ms: timeSinceFirstMilestoneMs,
            reading_pattern: getReadingPattern(timeSinceFirstMilestoneMs),
            milestones_reached_count: reachedMilestones.size,
            non_interaction: true
        });
    }

    function processScroll() {
        if (!initialised) {
            return;
        }
        const scrollPercentage = getScrollPercentage();

        milestones.forEach(milestone => {
            if (scrollPercentage >= milestone && !reachedMilestones.has(milestone)) {
                reachedMilestones.add(milestone);
                if (firstMilestoneTime === null) {
                    firstMilestoneTime = Date.now();
                }
                sendMilestoneEvent(milestone);
            }
        });
    }

    function handleScroll() {
        // Coalesce the burst of scroll events into one read per frame so we
        // aren't forcing layout reflow dozens of times a second.
        if (ticking) {
            return;
        }
        ticking = true;
        window.requestAnimationFrame(() => {
            processScroll();
            ticking = false;
        });
    }

    function init(bypassPathnameCheck = false) {
        if (initialised) {
            return;
        }
        if (bypassPathnameCheck || window.location.pathname.includes('landing-page')) {
            initialised = true;
            window.addEventListener('scroll', handleScroll, {passive: true});
        }
    }

    function destroy() {
        if (!initialised) {
            return;
        }
        window.removeEventListener('scroll', handleScroll);
        initialised = false;
    }

    return Object.freeze({
        init,
        destroy
    });
}
