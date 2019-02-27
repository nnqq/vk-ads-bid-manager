const fetch = require('node-fetch');
const { stringify } = require('querystring');

let requestsSec = 0;

setInterval(() => {
  if (requestsSec > 0) requestsSec -= 1;
}, 1000);

class VkApi {
  constructor(settings) {
    if (!settings.token) throw new Error('No VK access_token specified!');

    this.token = settings.token;
    this.v = settings.v || 5.92;
    this.lang = settings.lang || 'ru';
    this.reqSecLimit = settings.reqSecLimit || 3;
  }

  vkApi(method, options = {}) {
    return new Promise((resolve, reject) => {
      const request = async () => {
        requestsSec += 1;

        const response = await fetch(`https://api.vk.com/method/${method}?${stringify({
          access_token: this.token,
          v: this.v,
          lang: this.lang,
          ...options,
        })}`);

        const data = await response.json();

        if (data.error) {
          reject(JSON.stringify(data));
        }

        resolve(data.response);
      };

      if (requestsSec < this.reqSecLimit) request();

      const timerId = setInterval(() => {
        if (requestsSec >= this.reqSecLimit) return;

        clearInterval(timerId);
        request();
      }, 1000);
    });
  }
}

module.exports = VkApi;
