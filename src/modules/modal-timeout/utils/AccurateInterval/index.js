function AccurateInterval({onTick, onEnd, interval, duration, startTime, err}) {
    const self = this;
    let expected;
    let timeout;
    let stopTimer = false;
    this.startTime = startTime;
    this.interval = parseInt(interval, 10);
    this.duration = parseInt(duration, 10);
    this.endTime = this.startTime + this.duration;
    this.tickCount = 0;

    this.step = () => {
        if (stopTimer === true) {
            return;
        }
        const drift = Date.now() - expected;
        if (drift > self.interval) {
            if (err) {
                err(drift);
            }
        }
        const now = Date.now();
        const timeRemaining = this.endTime - now;
        if (onTick) {
            onTick(Math.max(timeRemaining, 0));
        }
        this.tickCount += 1;
        this.timeRemaining = timeRemaining;
        if (now > this.endTime) {
            this.stop();
            if (onEnd) {
                onEnd();
            }
            return;
        }
        expected += this.interval;
        timeout = window.setTimeout(this.step, Math.max(0, this.interval - drift));
    };

    this.start = () => {
        if (!this.startTime) {
            this.startTime = Date.now();
        }
        this.endTime = this.startTime + this.duration;
        expected = this.startTime + this.interval;
        timeout = window.setTimeout(this.step, this.interval);
    };

    this.stop = () => {
        stopTimer = true;
        window.clearTimeout(timeout);
    };

    this.restart = () => {
        this.startTime = Date.now();
        this.endTime = this.startTime + this.duration;
        expected = this.startTime + this.interval;
    };
}

export default AccurateInterval;
