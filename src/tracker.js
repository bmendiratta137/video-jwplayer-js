import * as nrvideo from 'newrelic-video-core'
import {version} from '../package.json'
import JwplayerAdsTracker from './ads'

export default class JwplayerTracker extends nrvideo.Tracker {
  getTrackerName () {
    return 'jwplayer'
  }

  getTrackerVersion () {
    return version
  }

  getPlayhead () {
    return this.player.getPosition()
  }

  getDuration () {
    return this.player.getDuration()
  }

  getRenditionBitrate () {
    let quality = this.player.getVisualQuality()
    if (quality && quality.level) {
      return quality.level.bitrate
    }
  }

  getRenditionName () {
    let quality = this.player.getVisualQuality()
    if (quality && quality.level) {
      return quality.level.label
    }
  }

  getRenditionWidth () {
    let quality = this.player.getVisualQuality()
    if (quality && quality.level) {
      return quality.level.width
    }
  }

  getRenditionHeight () {
    let quality = this.player.getVisualQuality()
    if (quality && quality.level) {
      return quality.level.height
    }
  }

  getTitle () {
    return this.title
  }

  getIsLive () {
    return this.isLive
  }

  getSrc () {
    let item = this.player.getPlaylistItem()
    if (item) return item.file
  }

  getPlayerVersion () {
    return this.player.version
  }

  isMuted () {
    this.player.getMute()
  }

  getPlayrate () {
    if (this.player.getPlaybackRate) {
      return this.player.getPlaybackRate()
    }
  }

  isAutoplayed () {
    return this.player.getConfig().autostart
  }

  getPreload () {
    return this.player.getConfig().preload
  }

  getLanguage () {
    let tracks = this.player.getAudioTracks()
    let index = this.player.getCurrentAudioTrack()
    if (index >= 0) {
      return tracks[index].language
    }
  }

  registerListeners () {
    nrvideo.Log.debugCommonVideoEvents(this.player, [
      'playlist', 'playlistComplete', 'playlistItem', 'beforePlay', 'meta', 'setupError', 'idle',
      'complete', 'bufferChange', 'buffer', 'firstFrame', 'playbackRateChanged', 'mute', 'levels',
      'levelsChanged', 'visualQuality', 'beforeComplete', 'ready'
    ])

    this.player.on('ready', this.onReady.bind(this))
    this.player.on('beforePlay', this.onBeforePlay.bind(this))
    this.player.on('firstFrame', this.onFirstFrame.bind(this))
    this.player.on('play', this.onPlay.bind(this))
    this.player.on('pause', this.onPause.bind(this))
    this.player.on('buffer', this.onBuffer.bind(this))
    this.player.on('seek', this.onSeek.bind(this))
    this.player.on('seeked', this.onSeeked.bind(this))
    this.player.on('complete', this.onEnded.bind(this))
    this.player.on('visualQuality', this.onVisualQuality.bind(this))
    this.player.on('idle', this.onIdle.bind(this))
    this.player.on('error', this.onError.bind(this))
    this.player.on('setupError', this.onSetupError.bind(this))
  }

  unregisterListeners () {
    this.player.off('ready', this.onReady)
    this.player.off('beforePlay', this.onBeforePlay)
    this.player.off('firstFrame', this.onFirstFrame)
    this.player.off('play', this.onPlay)
    this.player.off('pause', this.onPause)
    this.player.off('buffer', this.onBuffer)
    this.player.off('seek', this.onSeek)
    this.player.off('seeked', this.onSeeked)
    this.player.off('complete', this.onEnded)
    this.player.off('idle', this.onIdle)
    this.player.off('visualQuality', this.onVisualQuality)
    this.player.off('error', this.onError)
    this.player.off('setupError', this.onSetupError)
  }

  onReady () {
    this.sendPlayerReady()
  }

  onBeforePlay () {
    this.sendRequest()

    if (!this.adsTracker) {
      this.setAdsTracker(new JwplayerAdsTracker(this.player))
    }
  }

  onFirstFrame () {
    this.sendStart()
  }

  onPause () {
    this.sendPause()
  }

  onPlay () {
    this.sendBufferEnd()
    this.sendResume()
  }

  onBuffer (e) {
    if (e.reason === 'stalled' || e.reason === 'loading') {
      this.sendBufferStart()
    }
  }

  onSeek () {
    this.sendSeekStart()
  }

  onSeeked () {
    this.sendSeekEnd()
  }

  onVisualQuality () {
    this.sendRenditionChanged()
  }

  onEnded () {
    this.sendEnd()
  }

  onIdle () {
    this.sendEnd()
  }

  onError (e) {
    this.sendError({ errorMessage: e.message })
  }
  onSetupError (e) {
    this.sendError({ errorMessage: e.message })
  }
}

// Static members
export {
  JwplayerAdsTracker
}
