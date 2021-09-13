'use strict';

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
    });
});
