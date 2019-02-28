const VkApi = require('./lib/VkApi');

class VkAdsBidManager extends VkApi {
  constructor(settings) {
    super(settings);

    this.accountId = settings.accountId || null;
    this.bidStep = settings.bidStep || 100;
    this.dailyBudget = settings.dailyBudget || 1000;
    this.updateInterval = settings.updateInterval || 3e5;

    this._timerId = null;
  }

  async start() {
    const intervalsInDay = 864e5 / this.updateInterval;
    const intervalMaxBudget = this.dailyBudget / intervalsInDay;

    const watcher = async () => {
      if (!this.accountId) {
        const accountsIds = await super.vkApi('ads.getAccounts');
        this.accountId = accountsIds[0].account_id;
      }

      const today = new Date().toISOString().slice(0, 10);

      const [dailyStats, ads] = await Promise.all([
        super.vkApi('ads.getStatistics', {
          account_id: this.accountId,
          ids_type: 'office',
          ids: this.accountId,
          period: 'day',
          date_from: today,
          date_to: today,
        }),
        super.vkApi('ads.getAds', {
          account_id: this.accountId,
        })]);

      const intervalSpent = dailyStats[0].stats[0].spent / intervalsInDay;

      const activeAds = ads.filter(ad => ad.status === 1);

      if (intervalSpent < intervalMaxBudget) {
        const requests = activeAds.map((ad) => {
          const type = ad.cpm ? 'cpm' : 'cpc';
          return super.vkApi('ads.updateAds', {
            account_id: this.accountId,
            data: JSON.stringify([{
              ad_id: +ad.id,
              [type]: (ad[type] + this.bidStep) / 100,
            }]),
          });
        });

        await Promise.all(requests);
      } else {
        const requests = activeAds.map((ad) => {
          const type = ad.cpm ? 'cpm' : 'cpc';
          return super.vkApi('ads.updateAds', {
            account_id: this.accountId,
            data: JSON.stringify([{
              ad_id: +ad.id,
              [type]: (ad[type] - this.bidStep) / 100,
            }]),
          });
        });

        await Promise.all(requests);
      }
    };

    await watcher();
    this._timerId = setInterval(async () => {
      await watcher();
    }, this.updateInterval);
  }

  stop() {
    clearInterval(this._timerId);
  }
}

module.exports = VkAdsBidManager;
