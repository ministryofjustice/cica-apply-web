import createGAScrollTracker from './index';

describe('gaScrollTracker', () => {
    let trackers = [];

    // Every tracker binds a listener to the shared jsdom window. Register each
    // one so afterEach can tear it down, otherwise listeners leak across tests.
    function makeTracker() {
        const tracker = createGAScrollTracker(window);
        trackers.push(tracker);
        return tracker;
    }

    beforeEach(() => {
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            configurable: true,
            value: 0
        });
        Object.defineProperty(window.document.documentElement, 'scrollHeight', {
            writable: true,
            configurable: true,
            value: 2000
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 800
        });
        window.gtag = jest.fn();

        // The handler coalesces work into a requestAnimationFrame callback,
        // so run that callback synchronously to keep the assertions inline.
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
            cb();
            return 0;
        });
    });

    afterEach(() => {
        trackers.forEach(tracker => tracker.destroy());
        trackers = [];
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Scroll Milestone Tracking', () => {
        beforeEach(() => {
            makeTracker().init(true);
        });

        it('should send event when reaching 25% scroll', () => {
            window.scrollY = 350;
            window.dispatchEvent(new Event('scroll'));
            expect(window.gtag).toHaveBeenCalledWith(
                'event',
                'scroll_milestone',
                expect.objectContaining({
                    event_category: 'landing_page_engagement',
                    event_label: 'milestone_25',
                    value: 25,
                    scroll_milestone: 25
                })
            );
        });

        it('should send event when reaching 50% scroll', () => {
            window.scrollY = 600;
            window.dispatchEvent(new Event('scroll'));
            expect(window.gtag).toHaveBeenCalledWith(
                'event',
                'scroll_milestone',
                expect.objectContaining({
                    event_label: 'milestone_50',
                    value: 50,
                    scroll_milestone: 50
                })
            );
        });

        it('should send event when reaching 75% scroll', () => {
            window.scrollY = 900;
            window.dispatchEvent(new Event('scroll'));
            expect(window.gtag).toHaveBeenCalledWith(
                'event',
                'scroll_milestone',
                expect.objectContaining({
                    event_label: 'milestone_75',
                    value: 75,
                    scroll_milestone: 75
                })
            );
        });

        it('should send event when reaching 100% scroll', () => {
            window.scrollY = 1200;
            window.dispatchEvent(new Event('scroll'));
            expect(window.gtag).toHaveBeenCalledWith(
                'event',
                'scroll_milestone',
                expect.objectContaining({
                    event_label: 'milestone_100',
                    value: 100,
                    scroll_milestone: 100
                })
            );
        });

        it('should only fire each milestone once', () => {
            window.scrollY = 600;
            window.dispatchEvent(new Event('scroll'));
            window.gtag.mockClear();
            window.scrollY = 650;
            window.dispatchEvent(new Event('scroll'));
            const callsFor50 = window.gtag.mock.calls.filter(
                call => call[1] === 'scroll_milestone' && call[2].scroll_milestone === 50
            );
            expect(callsFor50).toHaveLength(0);
        });
    });

    describe('Event Properties', () => {
        beforeEach(() => {
            makeTracker().init(true);
        });

        it('should include time on page in event', () => {
            window.scrollY = 350;
            window.dispatchEvent(new Event('scroll'));
            const eventCall = window.gtag.mock.calls.find(call => call[1] === 'scroll_milestone');
            expect(eventCall[2]).toHaveProperty('time_on_page_ms');
            expect(typeof eventCall[2].time_on_page_ms).toBe('number');
            expect(eventCall[2].time_on_page_ms).toBeGreaterThanOrEqual(0);
        });

        it('should include time since first milestone in event', () => {
            window.scrollY = 350;
            window.dispatchEvent(new Event('scroll'));
            const eventCall = window.gtag.mock.calls.find(call => call[1] === 'scroll_milestone');
            expect(eventCall[2]).toHaveProperty('time_since_first_milestone_ms');
            expect(typeof eventCall[2].time_since_first_milestone_ms).toBe('number');
            expect(eventCall[2].time_since_first_milestone_ms).toBeGreaterThanOrEqual(0);
        });

        it('should include the count of milestones reached in event', () => {
            window.scrollY = 350;
            window.dispatchEvent(new Event('scroll'));
            const eventCall = window.gtag.mock.calls.find(call => call[1] === 'scroll_milestone');
            expect(eventCall[2]).toHaveProperty('milestones_reached_count');
            expect(eventCall[2].milestones_reached_count).toBe(1);
        });

        it('should mark events as non_interaction', () => {
            window.scrollY = 350;
            window.dispatchEvent(new Event('scroll'));
            const eventCall = window.gtag.mock.calls.find(call => call[1] === 'scroll_milestone');
            expect(eventCall[2].non_interaction).toBe(true);
        });
    });

    describe('Reading Pattern Categorisation', () => {
        beforeEach(() => {
            makeTracker().init(true);
        });

        function triggerMilestoneAtTime(scrollY, timestamp) {
            jest.spyOn(Date, 'now').mockReturnValue(timestamp);
            window.scrollY = scrollY;
            window.dispatchEvent(new Event('scroll'));
        }

        function readingPatternFor(scrollMilestone) {
            const call = window.gtag.mock.calls.find(
                c => c[1] === 'scroll_milestone' && c[2].scroll_milestone === scrollMilestone
            );
            return call[2].reading_pattern;
        }

        it('should categorise the first milestone reached as instant', () => {
            triggerMilestoneAtTime(350, 1000);
            expect(readingPatternFor(25)).toBe('instant');
        });

        it('should categorise a milestone reached under 3s after the first as instant', () => {
            triggerMilestoneAtTime(350, 1000);
            triggerMilestoneAtTime(600, 1000 + 1500);
            expect(readingPatternFor(50)).toBe('instant');
        });

        it('should categorise a milestone reached between 3s and 15s after the first as quick', () => {
            triggerMilestoneAtTime(350, 1000);
            triggerMilestoneAtTime(600, 1000 + 5000);
            expect(readingPatternFor(50)).toBe('quick');
        });

        it('should categorise a milestone reached between 15s and 45s after the first as moderate', () => {
            triggerMilestoneAtTime(350, 1000);
            triggerMilestoneAtTime(600, 1000 + 20000);
            expect(readingPatternFor(50)).toBe('moderate');
        });

        it('should categorise a milestone reached 45s or more after the first as engaged', () => {
            triggerMilestoneAtTime(350, 1000);
            triggerMilestoneAtTime(600, 1000 + 50000);
            expect(readingPatternFor(50)).toBe('engaged');
        });
    });

    describe('Read vs skip signal', () => {
        beforeEach(() => {
            makeTracker().init(true);
        });

        it('should report all four milestones reached when jumping to the bottom', () => {
            window.scrollY = 1200;
            window.dispatchEvent(new Event('scroll'));
            const call100 = window.gtag.mock.calls.find(
                call => call[1] === 'scroll_milestone' && call[2].scroll_milestone === 100
            );
            expect(call100[2].milestones_reached_count).toBe(4);
        });

        it('should increment the reached count as milestones are hit over time', () => {
            window.scrollY = 350;
            window.dispatchEvent(new Event('scroll'));
            window.scrollY = 600;
            window.dispatchEvent(new Event('scroll'));

            const call25 = window.gtag.mock.calls.find(
                call => call[1] === 'scroll_milestone' && call[2].scroll_milestone === 25
            );
            const call50 = window.gtag.mock.calls.find(
                call => call[1] === 'scroll_milestone' && call[2].scroll_milestone === 50
            );
            expect(call25[2].milestones_reached_count).toBe(1);
            expect(call50[2].milestones_reached_count).toBe(2);
        });
    });

    describe('Lifecycle', () => {
        it('should not bind a second scroll listener when init is called twice', () => {
            const tracker = makeTracker();
            const addSpy = jest.spyOn(window, 'addEventListener');
            tracker.init(true);
            tracker.init(true);
            const scrollBindings = addSpy.mock.calls.filter(call => call[0] === 'scroll');
            expect(scrollBindings).toHaveLength(1);
        });

        it('should stop tracking after destroy', () => {
            const tracker = makeTracker();
            tracker.init(true);
            tracker.destroy();
            window.scrollY = 350;
            window.dispatchEvent(new Event('scroll'));
            expect(window.gtag).not.toHaveBeenCalled();
        });

        it('should not track when the pathname check fails', () => {
            // jsdom's default pathname is '/', which excludes 'landing-page'.
            const tracker = makeTracker();
            tracker.init();
            window.scrollY = 350;
            window.dispatchEvent(new Event('scroll'));
            expect(window.gtag).not.toHaveBeenCalled();
        });
    });
});
