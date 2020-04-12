# VK ads bid-manager (Node.js)

This module controls VK ad rates for optimal use within the daily budget.

## Install

```
npm i vk-ads-bid-manager
```

## Usage

Fast start below, continue reading for advanced usage.

```javascript
const BidManager = require('vk-ads-bid-manager');

const bidManager = new BidManager({
  token: process.env.TOKEN, // VK user access_token with Ads permission
});

bidManager.start();
```

### Methods

* [constructor(settings)](#constructorsettings)
* [.start()](#start)
* [.stop()](#stop)

#### constructor(settings)

##### Default config

```javascript
new BidManager({
  token: undefined,
  v: 5.92,
  lang: 'ru',
  reqSecLimit: 3,
  accountId: null,
  bidStep: 100,
  dailyBudget: 1000,
  updateInterval: 300000,
});
```

##### Properties description

Property | Type | Default | Description
--- | --- | --- | --- |
token | `string` | undefined | [VK User access_token](https://vk.com/dev/access_token) with Ads permission |
v | `number` | 5.92 | VK api version
lang | `string` | ru | VK api data language
reqSecLimit | `number` | 3 | Requests limiter to VK api
accountId | `number` | First Ads account_id | Ads account_id. If not set, takes first account_id with your token
bidStep | `number` | 100 (russian penny) | Ad rates will increase/decrease on this value at one time
dailyBudget | `number` | 1000 (rub) | Daily ad budget
updateInterval | `number` | 300000 (ms) | Ad rates check interval

#### .start()
Starts bid-manager watcher

#### .stop()
Stops bid-manager watcher

## Contact author

[Telegram](https://t.me/aveDenis)
