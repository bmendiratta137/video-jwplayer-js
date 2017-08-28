# newrelic-video-videojs [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
#### [New Relic](http://newrelic.com) video tracking for Videojs

## Requirements
This video monitor solutions works on top of New Relic's **Browser Agent**.

## Usage
Add **scripts** inside `dist` folder to your page.

> If `dist` folder is not included, run `npm i && npm run build` to build it.

```javascript
// var player = jwplayer('my-player')
nrvideo.Core.addTracker(new nrvideo.JwplayerTracker(player))
```

