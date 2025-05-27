'use strict';

const moment = require('moment-timezone');
const createLiveChatHelper = require('../index/liveChatHelper');

describe('Live Chat Helper', () => {
    describe('isLiveChatActive', () => {
        it('should return true', () => {
            jest.useFakeTimers('modern');
            jest.setSystemTime(new Date(2021, 8, 13, 15, 5, 56)); // Mon Sep 13 2021 15:05:56 GMT+0100 (British Summer Time)
            const liveChatHelper = createLiveChatHelper();
            const result = liveChatHelper.isLiveChatActive(
                process.env.CW_LIVECHAT_START_TIMES,
                process.env.CW_LIVECHAT_END_TIMES
            );
            jest.useRealTimers();
            expect(result).toBe(true);
        });
        it('should return false for being the wrong day', () => {
            process.env.CW_LIVECHAT_START_TIMES =
                '00:00:01.000,00:00:01.000,00:00:01.000,00:00:01.000,00:00:01.000,00:00:01.000,false';
            jest.useFakeTimers('modern');
            jest.setSystemTime(new Date(2021, 8, 11, 4, 0, 48)); // Sat Sep 11 2021 04:00:48 GMT+0100 (British Summer Time)
            const liveChatHelper = createLiveChatHelper();
            const result = liveChatHelper.isLiveChatActive(
                process.env.CW_LIVECHAT_START_TIMES,
                process.env.CW_LIVECHAT_END_TIMES
            );
            jest.useRealTimers();
            expect(result).toBe(false);
        });
        it('should return false for being the wrong time on a correct day', () => {
            process.env.CW_LIVECHAT_START_TIMES =
                '00:00:01.000,08:30:00.000,00:00:01.000,00:00:01.000,00:00:01.000,00:00:01.000,false';
            process.env.CW_LIVECHAT_END_TIMES =
                '23:59:59.000,23:59:59.000,23:59:59.000,23:59:59.000,23:59:59.000,23:59:59.000,23:59:59.000';
            jest.useFakeTimers('modern');
            jest.setSystemTime(new Date(2021, 8, 13, 4, 0, 48)); // Mon Sep 13 2021 04:00:48 GMT+0100 (British Summer Time)
            const liveChatHelper = createLiveChatHelper();
            const result = liveChatHelper.isLiveChatActive(
                process.env.CW_LIVECHAT_START_TIMES,
                process.env.CW_LIVECHAT_END_TIMES
            );
            jest.useRealTimers();
            expect(result).toBe(false);
        });
        describe('bank holidays', () => {
            it('should return false for being a bank holiday', () => {
                jest.useFakeTimers('modern');
                jest.setSystemTime(new Date(2024, 11, 25, 4, 0, 48)); // Tue Dec 25 2027 04:00:48 GMT+0000 (Greenwich Mean Time)
                const liveChatHelper = createLiveChatHelper();
                const result = liveChatHelper.isLiveChatActive(
                    process.env.CW_LIVECHAT_START_TIMES,
                    process.env.CW_LIVECHAT_END_TIMES
                );
                jest.useRealTimers();
                expect(result).toBe(false);
            });

            it('should have a list of future bank holidays', () => {
                // eslint-disable-next-line global-require
                const bankHolidays = require('../index/bank-holidays.json');
                // when this test fails update the bank-holidays list for Scotland
                // and rerun the test
                // https://www.gov.uk/bank-holidays.json
                // this test ensures that upcoming bank holidays are present in the bank-holidays.json
                // and if the live chat functionality is active it will be deactivated for
                // those Scottish bank holidays present within the bank-holidays.json
                // this test acts as a reminder to update the bank-holidays.json
                const today = new Date();
                const futureBankHolidays = bankHolidays.events.filter(x =>
                    moment(x.date).isAfter(today, 'day')
                );
                expect(futureBankHolidays.length).toBeGreaterThan(4);
            });
        });
    });
});
