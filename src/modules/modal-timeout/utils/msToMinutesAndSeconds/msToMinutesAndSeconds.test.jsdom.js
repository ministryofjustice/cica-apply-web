import msToMinutesAndSeconds from '.';

describe('msToMinutesAndSeconds', () => {
    it('Should convert a huge integer to minutes and seconds', () => {
        const ms = 98138394;
        const result = msToMinutesAndSeconds(ms);
        expect(result).toBe('1635 minutes and 38 seconds');
    });

    it('Should convert 0 millisecond to 0 seconds', () => {
        const ms = 0;
        const result = msToMinutesAndSeconds(ms);
        expect(result).toBe('0 seconds');
    });

    it('Should convert a negative integer to 0 seconds', () => {
        const ms = -982364;
        const result = msToMinutesAndSeconds(ms);
        expect(result).toBe('0 seconds');
    });

    describe('1 unit of time', () => {
        it('Should convert to singular second only', () => {
            const ms = 1200;
            const result = msToMinutesAndSeconds(ms);
            expect(result).toBe('1 second');
        });
        it('Should convert to plural seconds only', () => {
            const ms = 43210;
            const result = msToMinutesAndSeconds(ms);
            expect(result).toBe('43 seconds');
        });
        it('Should convert to singular minute only', () => {
            const ms = 60500;
            const result = msToMinutesAndSeconds(ms);
            expect(result).toBe('1 minute');
        });
        it('Should convert to plural minutes only', () => {
            const ms = 2460500;
            const result = msToMinutesAndSeconds(ms);
            expect(result).toBe('41 minutes');
        });
    });
    describe('2 units of time', () => {
        it('Should convert to singular minute and singular second only', () => {
            const ms = 61500;
            const result = msToMinutesAndSeconds(ms);
            expect(result).toBe('1 minute and 1 second');
        });
        it('Should convert to singular minute and plural seconds only', () => {
            const ms = 94500;
            const result = msToMinutesAndSeconds(ms);
            expect(result).toBe('1 minute and 34 seconds');
        });
        it('Should convert to plural minute and singlular second only', () => {
            const ms = 181500;
            const result = msToMinutesAndSeconds(ms);
            expect(result).toBe('3 minutes and 1 second');
        });
        it('Should convert to plural minute and plural seconds only', () => {
            const ms = 950500;
            const result = msToMinutesAndSeconds(ms);
            expect(result).toBe('15 minutes and 50 seconds');
        });
    });
});
