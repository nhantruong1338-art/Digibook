/**
 * Audio Queue Manager - Centralized queue management for cross-screen usage
 * Usage: Import these functions in any screen to manage the global audio queue
 */

import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'

// Add tracks to the current queue
export const addToQueue = (trackIds: string | string[]) => {
  const ids = Array.isArray(trackIds) ? trackIds : [trackIds]
  const uniqueIds = ids.filter((id) => !global.globalTrackQueue?.includes(id))

  if (uniqueIds.length > 0) {
    global.globalTrackQueue = global.globalTrackQueue || []
    global.globalTrackQueue.push(...uniqueIds)
    console.log('🎵 Added to queue:', uniqueIds)
  }
}

// Replace the entire queue with new tracks
export const replaceQueue = (trackIds: string[], startIndex = 0) => {
  global.globalTrackQueue = [...trackIds]
  global.globalCurrentIndex = startIndex
  global.globalOriginalQueue = [] // Reset original queue
  console.log('🎵 Replaced queue with:', trackIds.length, 'tracks, starting at index:', startIndex)
}

// Play a single track (replaces queue with single track)
export const playSingleTrack = (trackId: string) => {
  replaceQueue([trackId], 0)
  router.push({
    pathname: ERouteTable.PLAY_MUSIC,
    params: { trackId },
  })
}

// Play from a list of tracks starting at specific track
export const playFromList = (trackIds: string[], startTrackId: string) => {
  const startIndex = trackIds.indexOf(startTrackId)
  replaceQueue(trackIds, startIndex >= 0 ? startIndex : 0)
  router.push({
    pathname: ERouteTable.PLAY_MUSIC,
    params: { trackId: startTrackId },
  })
}

// Add track to queue and play it next
export const playNext = (trackId: string) => {
  global.globalTrackQueue = global.globalTrackQueue || []
  const currentIndex = global.globalCurrentIndex || 0

  // Remove if already exists
  const existingIndex = global.globalTrackQueue.indexOf(trackId)
  if (existingIndex >= 0) {
    global.globalTrackQueue.splice(existingIndex, 1)
    // Adjust current index if needed
    if (existingIndex <= currentIndex) {
      global.globalCurrentIndex = Math.max(0, currentIndex - 1)
    }
  }

  // Insert after current track
  global.globalTrackQueue.splice(currentIndex + 1, 0, trackId)
  console.log('🎵 Added to play next:', trackId)
}

// Get current queue information
export const getQueueInfo = () => ({
  queue: global.globalTrackQueue || [],
  currentIndex: global.globalCurrentIndex || 0,
  playMode: global.globalPlayMode || 'normal',
  currentTrackId: global.globalTrackQueue?.[global.globalCurrentIndex || 0],
  hasNext: (global.globalTrackQueue?.length || 0) > (global.globalCurrentIndex || 0) + 1,
  hasPrevious: (global.globalCurrentIndex || 0) > 0,
})

// Clear the queue
export const clearQueue = () => {
  global.globalTrackQueue = []
  global.globalCurrentIndex = 0
  global.globalOriginalQueue = []
  console.log('🎵 Queue cleared')
}

// Remove track from queue
export const removeFromQueue = (trackId: string) => {
  if (!global.globalTrackQueue) return

  const index = global.globalTrackQueue.indexOf(trackId)
  if (index >= 0) {
    global.globalTrackQueue.splice(index, 1)

    // Adjust current index if needed
    if (index < global.globalCurrentIndex) {
      global.globalCurrentIndex = Math.max(0, global.globalCurrentIndex - 1)
    } else if (
      index === global.globalCurrentIndex &&
      global.globalCurrentIndex >= global.globalTrackQueue.length
    ) {
      global.globalCurrentIndex = Math.max(0, global.globalTrackQueue.length - 1)
    }

    console.log('🎵 Removed from queue:', trackId)
  }
}

// Shuffle the current queue
export const shuffleQueue = () => {
  if (!global.globalTrackQueue || global.globalTrackQueue.length <= 1) return

  // Save original queue if not already saved
  if (!global.globalOriginalQueue || global.globalOriginalQueue.length === 0) {
    global.globalOriginalQueue = [...global.globalTrackQueue]
  }

  const currentTrackId = global.globalTrackQueue[global.globalCurrentIndex || 0]
  const otherTracks = global.globalTrackQueue.filter(
    (_, index) => index !== (global.globalCurrentIndex || 0),
  )

  // Shuffle other tracks
  for (let i = otherTracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[otherTracks[i], otherTracks[j]] = [otherTracks[j], otherTracks[i]]
  }

  // Put current track at beginning, then shuffled tracks
  global.globalTrackQueue = [currentTrackId, ...otherTracks]
  global.globalCurrentIndex = 0
  global.globalPlayMode = 'shuffle'
  console.log('🔀 Queue shuffled')
}

// Restore original queue order
export const restoreOriginalQueue = () => {
  if (global.globalOriginalQueue && global.globalOriginalQueue.length > 0) {
    const currentTrackId = global.globalTrackQueue?.[global.globalCurrentIndex || 0]
    const originalIndex = global.globalOriginalQueue.indexOf(currentTrackId || '')

    global.globalTrackQueue = [...global.globalOriginalQueue]
    global.globalCurrentIndex = originalIndex >= 0 ? originalIndex : 0
    global.globalOriginalQueue = []
    global.globalPlayMode = 'normal'
    console.log('🔄 Restored original queue')
  }
}
