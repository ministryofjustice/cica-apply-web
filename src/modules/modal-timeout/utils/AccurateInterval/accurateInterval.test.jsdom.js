import AccurateInterval from '.';

let timer;

describe('Accurate Interval', () => {
    it('Should execute a callback on each tick', async () => {
        let acc = '';
        timer = new AccurateInterval({
            onTick: () => {
                acc += 'foo';
            },
            interval: 1000,
            duration: 3000
        });

        timer.start();

        // emulate a delay.
        await new Promise(resolve => {
            setTimeout(resolve, 3500);
        });

        expect(acc).toBe('foofoofoo');
    });

    it('Should stop the timer', async () => {
        let acc = '';
        timer = new AccurateInterval({
            onTick: () => {
                acc += 'foo';
            },
            interval: 200,
            duration: 2000
        });

        timer.start();

        // emulate a delay.
        await new Promise(resolve => {
            setTimeout(resolve, 1300);
        });

        timer.stop();

        expect(acc).toBe('foofoofoofoofoofoo');
    });

    it('Should stop the timer after the specified time', async () => {
        let acc = '';
        timer = new AccurateInterval({
            onTick: () => {
                acc += 'foo';
            },
            interval: 200,
            duration: 1900
        });

        timer.start();

        // emulate a delay.
        await new Promise(resolve => {
            setTimeout(resolve, 3000);
        });

        expect(acc).toBe('foofoofoofoofoofoofoofoofoofoo');
    });

    it('Should have the correct tickCount', async () => {
        timer = new AccurateInterval({
            interval: 800,
            duration: 2000
        });

        timer.start();

        // emulate a delay.
        await new Promise(resolve => {
            setTimeout(resolve, 4000);
        });
        const expectedTickCount = Math.floor(timer.duration / timer.interval) + 1;

        expect(timer.tickCount).toBe(expectedTickCount);
        expect(timer.tickCount).toBe(3);
    });

    it('Should restart the timer', async () => {
        let acc = '';
        timer = new AccurateInterval({
            onTick: () => {
                acc += 'foo';
            },
            interval: 300,
            duration: 1200
        });

        timer.start();

        // emulate a delay.
        await new Promise(resolve => {
            setTimeout(resolve, 750);
        });

        // 2 ticks total.
        timer.restart();

        // emulate a delay.
        await new Promise(resolve => {
            setTimeout(resolve, 800);
        });

        // 4 ticks total.
        timer.restart();

        // emulate a delay.
        await new Promise(resolve => {
            setTimeout(resolve, 800);
        });

        expect(timer.tickCount).toBe(6);
        expect(acc).toBe('foofoofoofoofoofoo');
    });

    it('Should execute a callback after the timer has ended', async () => {
        let changeMe = '123';
        timer = new AccurateInterval({
            interval: 200,
            duration: 500,
            onEnd: () => {
                changeMe = 'abc';
            }
        });

        timer.start();

        expect(changeMe).toBe('123');

        // emulate a delay.
        await new Promise(resolve => {
            setTimeout(resolve, 800);
        });

        expect(changeMe).toBe('abc');
    });
});
