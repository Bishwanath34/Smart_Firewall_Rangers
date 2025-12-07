const { AGGREGATION_INTERVAL, DATA_RETENTION_MS } = require('../config');

class RequestTracker {
  constructor() {
    this.totalRequests = 0;
    this.requestTimeSeries = [];
  }

  increment() {
    this.totalRequests++;
    this.updateTimeSeries();
  }

  updateTimeSeries() {
    const now = Math.floor(Date.now() / AGGREGATION_INTERVAL) * AGGREGATION_INTERVAL;
    const lastEntry = this.requestTimeSeries.length > 0 
      ? this.requestTimeSeries[this.requestTimeSeries.length - 1] 
      : null;

    if (lastEntry && lastEntry.time === now) {
      lastEntry.count++;
    } else {
      this.requestTimeSeries.push({ time: now, count: 1 });
    }
  }

  getTrafficData() {
    this.cleanupOldData();
    return {
      totalRequests: this.totalRequests,
      timeSeries: this.requestTimeSeries
    };
  }

  cleanupOldData() {
    const cutoff = Date.now() - DATA_RETENTION_MS;
    while (this.requestTimeSeries.length > 0 && this.requestTimeSeries[0].time < cutoff) {
      this.requestTimeSeries.shift();
    }
  }

  // Start automatic cleanup
  startCleanupInterval(intervalMs = 60000) {
    setInterval(() => this.cleanupOldData(), intervalMs);
  }
}

// Create singleton instance
const requestTracker = new RequestTracker();
requestTracker.startCleanupInterval();

module.exports = { requestTracker };