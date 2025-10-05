import { images } from '@/constants'
import BlurHeaderBackground from '@/components/BackGroundBlur'
import HeaderBackComponent from '@/components/HeaderBackComponent'
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { FlatList, Image, StatusBar, Text, TouchableOpacity, View, AppState, Animated } from 'react-native'
import IconThreePoint from '~/assets/icon-svg/home/IconThreePoint'
import { AntDesign, Foundation, Ionicons } from '@expo/vector-icons'
import IconAddToPlayList from '~/assets/icon-svg/song/IconAddToPlayList'
import IconShare from '~/assets/icon-svg/IconShare'
import MusicProgressBar from '@/components/MusicPlayer/MusicProgressBar'
import IconRepeat from '~/assets/icon-svg/song/IconRepeat'
import IconStepBack from '~/assets/icon-svg/song/IconStepBack'
import IconStepNext from '~/assets/icon-svg/song/IconStepNext'
import IconDisturbance from '~/assets/icon-svg/song/IconDisturbance'
import IconPause from '~/assets/icon-svg/song/IconPause'
import IconPlayMusic2 from '~/assets/icon-svg/song/IconPlayMusic2'
import TitleHome from '@/components/home/TitleHome'
import ItemLarge from '@/components/home/ItemLarge'
import { Audio } from 'expo-av'
import { Song } from '@/data/DataMusic'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useLibrary } from '@/hooks/useLibrary'
import { useToast } from '@/components/ToastNotify/ToastContext'
import { ERouteTable } from '@/constants/route-table'
import { useAuth } from '@/hooks/useAuth'
import { useArtist } from '@/hooks/useArtist'

// BE API Track interface
interface BETrack {
  id: number
  title: string
  audioUrl: string
  coverUrl: string | null
  duration: number
  likeCount: number
  playCount: number
  albumId: number | null
  explicit: boolean
  trackNumber: number | null
  createdAt: string
  updatedAt: string
  createdById: number | null
  updatedById: number | null
  deletedAt: string | null
  deletedById: number | null
  isFavorite: boolean
}

// Convert BE track to local Song format with proper fallbacks
const convertBETrackToSong = (beTrack: BETrack): Song => {
  return {
    id: beTrack.id.toString(),
    title: beTrack.title || 'Unknown Title',
    artist: 'Unknown Artist', // BE doesn't provide artist info yet
    album: 'Unknown Album', // BE doesn't provide album info yet
    duration: beTrack.duration || 0,
    uri: beTrack.audioUrl || '',
    artwork: beTrack.coverUrl || undefined,
    isFavorite: beTrack.isFavorite, // Will be determined by user's like status
  }
}

// Format numbers for display (e.g., 1234 -> 1.2K)
const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

// Global queue management functions for cross-screen usage
export const addToQueue = (trackIds: string | string[]) => {
  const ids = Array.isArray(trackIds) ? trackIds : [trackIds]
  const uniqueIds = ids.filter((id) => !global.globalTrackQueue.includes(id))

  if (uniqueIds.length > 0) {
    global.globalTrackQueue.push(...uniqueIds)
  }
}

export const replaceQueue = (trackIds: string[], startIndex = 0) => {
  global.globalTrackQueue = [...trackIds]
  global.globalCurrentIndex = startIndex
  global.globalOriginalQueue = [] // Reset original queue
}

export const getQueueInfo = () => ({
  queue: global.globalTrackQueue,
  currentIndex: global.globalCurrentIndex,
  playMode: global.globalPlayMode,
  currentTrackId: global.globalTrackQueue[global.globalCurrentIndex],
})

// Enhanced global audio state for cross-screen playback
declare global {
  var globalSound: Audio.Sound | null
  var globalCurrentSongId: string | null
  var globalCurrentSong: Song | null
  var globalIsPlaying: boolean
  var globalBETrack: BETrack | null
  // New: Track queue management
  var globalTrackQueue: string[] // Array of trackIds
  var globalCurrentIndex: number
  var globalPlayMode: 'normal' | 'repeat' | 'shuffle'
  var globalOriginalQueue: string[] // For shuffle mode restoration
}

// Initialize enhanced global state
if (typeof global !== 'undefined') {
  global.globalSound = global.globalSound || null
  global.globalCurrentSongId = global.globalCurrentSongId || null
  global.globalCurrentSong = global.globalCurrentSong || null
  global.globalIsPlaying = global.globalIsPlaying || false
  global.globalBETrack = global.globalBETrack || null
  // Initialize queue management
  global.globalTrackQueue = global.globalTrackQueue || []
  global.globalCurrentIndex = global.globalCurrentIndex || 0
  global.globalPlayMode = global.globalPlayMode || 'normal'
  global.globalOriginalQueue = global.globalOriginalQueue || []
}

const PlayMusic = React.memo(() => {
  const [activeFavorite, setActiveFovorite] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeRepeat, setActiveRepeat] = useState(global.globalPlayMode === 'repeat')
  const [activeDisturbance, setActiveDisturbance] = useState(global.globalPlayMode === 'shuffle')
  const { trackId, artistId, albumId, playlistId } = useLocalSearchParams<{
    trackId: string
    artistId: string
    albumId: string
    playlistId: string
  }>()
  const { showToast } = useToast()
  const router = useRouter()
  const { userQuery } = useAuth()
  const { getListTrackArtist } = useArtist()

  const {
    addTrackToPlaylistMutation,
    bulkDeleteTracksMutation,
    getTrackDetail,
    getAlbumDetail,
    getPlaylistDetail,
    getRandomTrack,
    getTracks,
  } = useLibrary()
  const trackDetailQuery = getTrackDetail(trackId)

  const listTrackQuery = getListTrackArtist(artistId)
  const albumDetailQuery = getAlbumDetail(albumId)
  const playlistDetailQuery = getPlaylistDetail(playlistId)
  
  // Get suggested tracks when no context
  const suggestedTracksQuery = getTracks({
    pageSize: 10,
    pageNumber: 1,
    sort: 'playCount,-createdAt' // Sort by play count desc, then by creation date desc
  })

  // Track queue management
  const [trackQueue, setTrackQueue] = useState<string[]>(global.globalTrackQueue)
  const [currentIndex, setCurrentIndex] = useState(global.globalCurrentIndex)

  // const queryClient = use
  const beTrack: BETrack | undefined = trackDetailQuery?.data?.data

  // Audio states - Initialize with global state if available
  const [sound, setSound] = useState<Audio.Sound | null>(global.globalSound)
  const [currentSong, setCurrentSong] = useState<Song | null>(global.globalCurrentSong)
  const [currentBETrack, setCurrentBETrack] = useState<BETrack | null>(global.globalBETrack)
  const [isLoading, setIsLoading] = useState(false) // Always start with false
  const [playbackStatus, setPlaybackStatus] = useState<any>(null)

  // Random track query - must be at component level, not inside useCallback
  const randomTrackQuery = getRandomTrack(currentSong?.id)

  // Stable refs to prevent dependency changes
  const currentSongRef = useRef<Song | null>(currentSong)
  const currentBETrackRef = useRef<BETrack | null>(currentBETrack)
  const isLoadingRef = useRef(isLoading)
  const activeRepeatRef = useRef(activeRepeat)
  const soundRef = useRef<Audio.Sound | null>(sound)
  const isPlayingRef = useRef(isPlaying)
  
  // Animation refs for smooth transitions
  const fadeAnim = useRef(new Animated.Value(1)).current
  const scaleAnim = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(0)).current
  const imageOpacityAnim = useRef(new Animated.Value(1)).current
  
  // Memoized image sources to prevent unnecessary re-renders
  const backgroundImageSource = useMemo(() => {
    if (currentBETrack?.coverUrl) {
      return { uri: currentBETrack.coverUrl }
    } else if (currentSong?.artwork) {
      return { uri: currentSong.artwork }
    }
    return images.artist
  }, [currentBETrack?.coverUrl, currentSong?.artwork])
  
  const coverImageSource = useMemo(() => {
    if (currentBETrack?.coverUrl) {
      return { uri: currentBETrack.coverUrl }
    } else if (currentSong?.artwork) {
      return { uri: currentSong.artwork }
    }
    return images.artist
  }, [currentBETrack?.coverUrl, currentSong?.artwork])
  
    // Update refs when state changes
  currentSongRef.current = currentSong
  currentBETrackRef.current = currentBETrack
  isLoadingRef.current = isLoading
  activeRepeatRef.current = activeRepeat
  soundRef.current = sound
  isPlayingRef.current = isPlaying

  // Animation functions for smooth transitions
  const animateTrackChange = useCallback(() => {
    // Fade out current content with slide effect
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(imageOpacityAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnim, scaleAnim, imageOpacityAnim, slideAnim])

  const animateTrackLoaded = useCallback(() => {
    // Fade in new content with bounce effect and slide reset
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(imageOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnim, scaleAnim, imageOpacityAnim, slideAnim])

  const animateImageChange = useCallback(() => {
    // Quick fade transition for images
    Animated.sequence([
      Animated.timing(imageOpacityAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(imageOpacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [imageOpacityAnim])

  // Load new track without navigation
  const loadNewTrack = useCallback(async (newTrackId: string) => {
    if (!newTrackId) return
    
    console.log('🎵 Loading new track:', newTrackId)
    
    // Start fade out animation
    animateTrackChange()
    
    // Stop current sound
    if (sound) {
      sound.stopAsync().catch(console.error)
      sound.unloadAsync().catch(console.error)
      setSound(null)
    }
    
    // Reset global sound if it's the same as current
    if (global.globalSound && global.globalCurrentSongId === currentSong?.id) {
      global.globalSound.stopAsync().catch(console.error)
      global.globalSound.unloadAsync().catch(console.error)
      global.globalSound = null
      global.globalCurrentSongId = null
      global.globalIsPlaying = false
    }
    
    // Update global state
    global.globalCurrentSongId = newTrackId
    
    // Reset local state
    setCurrentSong(null)
    setCurrentBETrack(null)
    setPlaybackStatus(null)
    setIsPlaying(false)
    setIsLoading(false)
    
    // Update URL params silently (no navigation)
    router.setParams({ trackId: newTrackId })
    
    // Initialize queue for new track
    initializeQueue(newTrackId)
  }, [sound, currentSong?.id, router, animateTrackChange])

  // Queue Management Functions
  const initializeQueue = useCallback(async (newTrackId: string) => {
    // If queue is empty or doesn't contain current track, initialize with single track
    if (!global.globalTrackQueue.includes(newTrackId)) {
      const newQueue = [newTrackId]
      global.globalTrackQueue = newQueue
      global.globalCurrentIndex = 0
      setTrackQueue(newQueue)
      setCurrentIndex(0)
    } else {
      // Track exists in queue, update current index
      const index = global.globalTrackQueue.indexOf(newTrackId)
      global.globalCurrentIndex = index
      setCurrentIndex(index)
    }
  }, [])

  // Initialize queue based on context (artist, album, playlist)
  const initializeContextQueue = useCallback(async () => {
    if (!trackId) return

    try {
      let trackIds: string[] = []

      if (artistId) {
        // Get tracks from artist
        const artistTracks = listTrackQuery?.data?.data || []
        trackIds = artistTracks.map((track: any) => track.id.toString())
      } else if (albumId) {
        // Get tracks from album
        const albumTracks = albumDetailQuery?.data?.data?.tracks || []
        trackIds = albumTracks.map((track: any) => track.id.toString())
      } else if (playlistId) {
        // Get tracks from playlist
        const playlistTracks = playlistDetailQuery?.data?.data?.tracks || []
        trackIds = playlistTracks.map((track: any) => track.id.toString())
      }

      if (trackIds.length > 0) {
        // Set queue with context tracks
        global.globalTrackQueue = trackIds
        const currentIndex = trackIds.indexOf(trackId)
        global.globalCurrentIndex = currentIndex >= 0 ? currentIndex : 0
        setTrackQueue(trackIds)
        setCurrentIndex(global.globalCurrentIndex)

        // Reset shuffle state since we have a proper queue
        if (global.globalPlayMode === 'shuffle') {
          global.globalPlayMode = 'normal'
          setActiveDisturbance(false)
        }
      } else {
        // No context, clear queue for random mode
        global.globalTrackQueue = []
        global.globalCurrentIndex = 0
        setTrackQueue([])
        setCurrentIndex(0)
      }
    } catch (error) {
      console.error('Error initializing context queue:', error)
      // Fallback to single track
      global.globalTrackQueue = [trackId]
      global.globalCurrentIndex = 0
      setTrackQueue([trackId])
      setCurrentIndex(0)
    }
  }, [
    trackId,
    artistId,
    albumId,
    playlistId,
    listTrackQuery?.data?.data,
    albumDetailQuery?.data?.data?.tracks,
    playlistDetailQuery?.data?.data?.tracks,
  ])

  const shuffleQueue = useCallback(() => {
    if (global.globalTrackQueue.length <= 1) return

    // Save original queue if not already saved
    if (global.globalOriginalQueue.length === 0) {
      global.globalOriginalQueue = [...global.globalTrackQueue]
    }

    const currentTrackId = global.globalTrackQueue[global.globalCurrentIndex]
    const otherTracks = global.globalTrackQueue.filter(
      (_, index) => index !== global.globalCurrentIndex,
    )

    // Shuffle other tracks
    for (let i = otherTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[otherTracks[i], otherTracks[j]] = [otherTracks[j], otherTracks[i]]
    }

    // Put current track at beginning, then shuffled tracks
    const shuffledQueue = [currentTrackId, ...otherTracks]
    global.globalTrackQueue = shuffledQueue
    global.globalCurrentIndex = 0
    setTrackQueue(shuffledQueue)
    setCurrentIndex(0)
  }, [])

  const restoreOriginalQueue = useCallback(() => {
    if (global.globalOriginalQueue.length > 0) {
      const currentTrackId = global.globalTrackQueue[global.globalCurrentIndex]
      const originalIndex = global.globalOriginalQueue.indexOf(currentTrackId)

      global.globalTrackQueue = [...global.globalOriginalQueue]
      global.globalCurrentIndex = originalIndex >= 0 ? originalIndex : 0
      setTrackQueue([...global.globalOriginalQueue])
      setCurrentIndex(originalIndex >= 0 ? originalIndex : 0)
      global.globalOriginalQueue = []
    }
  }, [])

  // Handle trackId changes from navigation (only for external navigation)
  useEffect(() => {
    if (!trackId) return

    // Only handle external navigation, not internal track changes
    if (trackId !== global.globalCurrentSongId && !isLoading) {
      console.log('🎵 External navigation detected:', { from: global.globalCurrentSongId, to: trackId })
      
      // Stop and unload current sound
      if (sound) {
        sound.stopAsync().catch(console.error)
        sound.unloadAsync().catch(console.error)
        setSound(null)
      }

      // Reset global sound if it's the same as current
      if (global.globalSound && global.globalCurrentSongId === currentSong?.id) {
        global.globalSound.stopAsync().catch(console.error)
        global.globalSound.unloadAsync().catch(console.error)
        global.globalSound = null
        global.globalCurrentSongId = null
        global.globalIsPlaying = false
      }

      // Reset local state
      setCurrentSong(null)
      setCurrentBETrack(null)
      setPlaybackStatus(null)
      setIsPlaying(false)
      setIsLoading(false)

      // Update global state to match new trackId
      global.globalCurrentSongId = trackId

      initializeQueue(trackId)
    }
  }, [trackId, sound, currentSong?.id, isLoading]) // Add isLoading to prevent conflicts

  // Handle context changes (artistId, albumId, playlistId)
  useEffect(() => {
    if (trackId) {
      initializeContextQueue()
    }
  }, [trackId, artistId, albumId, playlistId, initializeContextQueue])

  // Update current song when BE track data is loaded
  useEffect(() => {
    if (!beTrack) return

    const convertedSong = convertBETrackToSong(beTrack)

    // Only update if track ID changed
    if (currentSong?.id !== convertedSong.id) {
      setCurrentSong(convertedSong)
      setCurrentBETrack(beTrack)

      // Sync favorite state with BE data
      setActiveFovorite(beTrack.isFavorite || false)

      // Update global state
      global.globalCurrentSong = convertedSong
      global.globalBETrack = beTrack
      global.globalCurrentSongId = convertedSong.id
      
      // Trigger animation for new track
      animateTrackLoaded()
    }
  }, [beTrack?.id, animateTrackLoaded]) // Only depend on track ID, not entire object

  // Handle error state separately to avoid dependency loop
  useEffect(() => {
    if (!trackDetailQuery.isError || trackDetailQuery.isLoading) return

    showToast('Không thể tải thông tin bài hát từ server', 'error')
  }, [trackDetailQuery.isError, trackDetailQuery.isLoading])

  // Handle loading and error states - Memoize to prevent recalculation
  const isTrackLoading = useMemo(() => trackDetailQuery.isLoading, [trackDetailQuery.isLoading])
  const hasTrackError = useMemo(() => trackDetailQuery.isError, [trackDetailQuery.isError])
  const hasValidTrack = useMemo(() => beTrack && beTrack.audioUrl, [beTrack?.audioUrl])

  // Load sound for current song - Using refs to avoid dependencies
  const loadSound = useCallback(
    async (retryCount = 0) => {
      if (isLoadingRef.current) {
        return // Prevent multiple simultaneous loads
      }

      try {
        setIsLoading(true)

        // Check if globalSound is already playing the same song
        if (global.globalSound && global.globalCurrentSongId === currentSongRef.current?.id) {
          // Reuse existing sound
          setSound(global.globalSound)

          // Ensure local state matches global state
          if (currentSongRef.current?.id !== global.globalCurrentSong?.id) {
            setCurrentSong(global.globalCurrentSong)
          }

          // Get current status and sync state
          const status = await global.globalSound.getStatusAsync()
          if (status.isLoaded) {
            setPlaybackStatus(status)
            setIsPlaying(status.isPlaying || false)

            // Sync favorite state
            setActiveFovorite(currentSongRef.current?.isFavorite || false)
          }

          // Set up listener for existing sound
          global.globalSound!.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded) {
              setPlaybackStatus(status)
              setIsPlaying(status.isPlaying || false)
              global.globalIsPlaying = status.isPlaying || false

              if (status.didJustFinish && !activeRepeatRef.current) {
                console.log('🎵 Song finished, but auto-next is disabled for BE tracks')
                // Auto-next will be implemented when playlist API is ready
              }
            }
          })

          // Sync repeat state with existing sound
          try {
            await global.globalSound!.setIsLoopingAsync(activeRepeatRef.current)
          } catch (error) {
            console.error('Error syncing repeat state:', error)
          }

          setIsLoading(false)
          return
        }

        // Different song - stop existing sound
        if (global.globalSound) {
          try {
            await global.globalSound.stopAsync()
            await global.globalSound.unloadAsync()
          } catch (error) {
            console.log('Error stopping global sound:', error)
          }
          global.globalSound = null
          global.globalCurrentSongId = null
          global.globalIsPlaying = false
        }

        // Also unload local sound reference
        if (soundRef.current && soundRef.current !== global.globalSound) {
          try {
            await soundRef.current.stopAsync()
            await soundRef.current.unloadAsync()
          } catch (error) {
            console.log('Error stopping local sound:', error)
          }
        }

        // Validate audio URL before loading
        if (!currentSongRef.current?.uri) {
          showToast('Không có link nhạc để phát', 'error')
          throw new Error('No audio URL available for this track')
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: currentSongRef.current.uri },
          {
            shouldPlay: true, // Auto play when loading
            isLooping: activeRepeatRef.current,
            volume: 1.0,
            rate: 1.0,
            shouldCorrectPitch: true,
            progressUpdateIntervalMillis: 1000,
          },
          null, // no initial status
          false, // don't download first
        )

        // Set both local and global references
        setSound(newSound)
        global.globalSound = newSound
        global.globalCurrentSongId = currentSongRef.current.id
        global.globalCurrentSong = currentSongRef.current

        // Set up playback status update - single listener for all functionality
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setPlaybackStatus(status) // Update status for MusicProgressBar
            setIsPlaying(status.isPlaying || false)
            global.globalIsPlaying = status.isPlaying || false // Sync with mini player

            // Auto play next song when current song ends (if not repeating)
            if (status.didJustFinish && !activeRepeatRef.current) {
              // Auto-next will be implemented when playlist API is ready
            }
          } else if (status.error) {
            console.error('Playback error:', status.error)
          }
        })

        setIsLoading(false)
      } catch (error) {
        console.error('Error loading sound:', error)
        setIsLoading(false)

        // Retry logic for thread-related errors
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (errorMessage && errorMessage.includes('wrong thread') && retryCount < 3) {
          setTimeout(
            () => {
              loadSound(retryCount + 1)
            },
            500 * (retryCount + 1),
          ) // Exponential backoff
          return
        }
      }
    },
    [showToast],
  ) // Only showToast as dependency, others use refs

  // Initialize audio mode and handle existing sounds
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Enhanced audio mode for background playback
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        })
      } catch (error) {
        console.error('Error initializing audio mode:', error)
      }
    }

    initAudio()
  }, []) // Only run once on mount

  // Single effect for sound loading - optimized to prevent rerenders
  useEffect(() => {
    // Only run when we have valid track data and no sound is currently loading
    if (!beTrack?.audioUrl || !currentSong?.uri || isLoading) {
      return
    }

    // Use a single timeout to prevent multiple calls
    const timeoutId = setTimeout(() => {
      loadSound()
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [beTrack?.id, currentSong?.id]) // Only depend on IDs, not entire objects

  // Cleanup effect - only run on unmount
  useEffect(() => {
    return () => {
      // Only unload if this is not the same as globalSound
      if (sound && sound !== global.globalSound) {
        sound.unloadAsync()
      }
      // Note: Don't clean globalSound here because we want it to persist
      // It will be cleaned when component mounts again or new song loads
      setPlaybackStatus(null) // Reset status when unmounting
    }
  }, []) // No dependencies - only run on unmount

  // Handle app state changes to maintain background playback
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' && sound && isPlaying) {
        // Audio should continue playing automatically with proper audio mode
      } else if (nextAppState === 'active' && sound) {
        // Sync state when returning to foreground
        sound.getStatusAsync().then((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying || false)
            global.globalIsPlaying = status.isPlaying || false
          }
        })
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription?.remove()
    }
  }, []) // No dependencies - only run once
  
  // Trigger image animation when sources change
  useEffect(() => {
    if (currentBETrack?.coverUrl || currentSong?.artwork) {
      animateImageChange()
    }
  }, [currentBETrack?.coverUrl, currentSong?.artwork, animateImageChange])

  // This useEffect is removed to prevent circular dependency
  // Sound loading is now handled in the main initialization useEffect

  // Toggle play/pause - Memoized
  const togglePlayback = useCallback(async () => {
    if (!sound) return

    try {
      if (isPlaying) {
        await sound.pauseAsync()
        global.globalIsPlaying = false
      } else {
        await sound.playAsync()
        global.globalIsPlaying = true
      }
    } catch (error) {
      console.error('Error toggling playback:', error)
    }
  }, [sound, isPlaying])

  // Play next song with queue management
  const playNextSong = useCallback(async () => {
    if (isLoadingRef.current) return // Prevent action if loading

    const queue = global.globalTrackQueue
    const currentIdx = global.globalCurrentIndex

    if (queue.length <= 1) {
      // Random mode - fetch random track from API
      if (!currentSong?.id) {
        showToast('Không thể phát bài tiếp theo', 'error')
        return
      }

      try {
        // Use randomTrackQuery that's already declared at component level
        const randomTrack = await randomTrackQuery.refetch()

        console.log('🎵 Random track response:', randomTrack.data)

        if (randomTrack.data?.success && randomTrack.data?.data?.id) {
          const nextTrackId = randomTrack.data.data.id.toString()
          const trackTitle = randomTrack.data.data.title

          console.log(`🎵 Playing next random track: ${trackTitle} (ID: ${nextTrackId})`)

          // Directly load and play new track without navigation
          await loadNewTrack(nextTrackId)
          
          return
        }

        // Handle API response errors
        if (randomTrack.data?.errorCode && randomTrack.data?.errorCode !== '000000') {
          console.error('🎵 API Error:', randomTrack.data.errorCode, randomTrack.data.message)
          showToast(
            `Lỗi API: ${randomTrack.data.message || 'Không thể lấy bài hát ngẫu nhiên'}`,
            'error',
          )
        } else {
          showToast('Không thể lấy bài hát ngẫu nhiên', 'error')
        }
      } catch (error) {
        console.error('Error fetching random track:', error)
        showToast('Có lỗi xảy ra khi lấy bài hát ngẫu nhiên', 'error')
      }
      return
    }

    let nextIndex: number
    if (global.globalPlayMode === 'repeat') {
      // Repeat current song
      nextIndex = currentIdx
    } else {
      // Normal or shuffle mode: go to next song
      nextIndex = (currentIdx + 1) % queue.length
    }

    const nextTrackId = queue[nextIndex]

    // Update global state
    global.globalCurrentIndex = nextIndex
    setCurrentIndex(nextIndex)

    // Directly load and play new track without navigation
    await loadNewTrack(nextTrackId)
  }, [showToast, currentSong?.id])

  // Play previous song with queue management
  const playPreviousSong = useCallback(async () => {
    if (isLoadingRef.current) return // Prevent action if loading

    const queue = global.globalTrackQueue
    const currentIdx = global.globalCurrentIndex

    if (queue.length <= 1) {
      // Random mode - fetch random track from API
      if (!currentSong?.id) {
        showToast('Không thể phát bài trước đó', 'error')
        return
      }

      try {
        // Use randomTrackQuery that's already declared at component level
        const randomTrack = await randomTrackQuery.refetch()

        console.log('🎵 Random track response (previous):', randomTrack.data)

        if (randomTrack.data?.success && randomTrack.data?.data?.id) {
          const prevTrackId = randomTrack.data.data.id.toString()
          const trackTitle = randomTrack.data.data.title

          console.log(`🎵 Playing previous random track: ${trackTitle} (ID: ${prevTrackId})`)

          // Directly load and play new track without navigation
          await loadNewTrack(prevTrackId)
          
          return
        }

        // Handle API response errors
        if (randomTrack.data?.errorCode && randomTrack.data?.errorCode !== '000000') {
          console.error(
            '🎵 API Error (previous):',
            randomTrack.data.errorCode,
            randomTrack.data.message,
          )
          showToast(
            `Lỗi API: ${randomTrack.data.message || 'Không thể lấy bài hát ngẫu nhiên'}`,
            'error',
          )
        } else {
          showToast('Không thể lấy bài hát ngẫu nhiên', 'error')
        }
      } catch (error) {
        console.error('Error fetching random track:', error)
        showToast('Có lỗi xảy ra khi lấy bài hát ngẫu nhiên', 'error')
      }
      return
    }

    let prevIndex: number
    if (global.globalPlayMode === 'repeat') {
      // Repeat current song
      prevIndex = currentIdx
    } else {
      // Normal or shuffle mode: go to previous song
      prevIndex = currentIdx === 0 ? queue.length - 1 : currentIdx - 1
    }

    const prevTrackId = queue[prevIndex]

    // Update global state
    global.globalCurrentIndex = prevIndex
    setCurrentIndex(prevIndex)

    // Directly load and play new track without navigation
    await loadNewTrack(prevTrackId)
  }, [showToast, currentSong?.id])

  // Handle repeat toggle - Memoized
  const handleRepeatToggle = useCallback(async () => {
    const newRepeatState = !activeRepeat
    setActiveRepeat(newRepeatState)

    // Update global play mode
    if (newRepeatState) {
      global.globalPlayMode = 'repeat'
      // Turn off shuffle if repeat is on
      if (activeDisturbance) {
        setActiveDisturbance(false)
        restoreOriginalQueue()
      }
    } else {
      global.globalPlayMode = 'normal'
    }

    // Update sound looping if sound is loaded
    if (soundRef.current) {
      try {
        await soundRef.current.setIsLoopingAsync(newRepeatState)
      } catch (error) {
        console.error('Error setting loop:', error)
      }
    }
  }, [activeRepeat, activeDisturbance, restoreOriginalQueue])

  // Handle shuffle toggle
  const handleShuffleToggle = useCallback(() => {
    // Disable shuffle if no queue (random mode)
    if (global.globalTrackQueue.length <= 1) {
      showToast('Không thể xáo trộn khi chỉ có một bài hát', 'error')
      return
    }

    const newShuffleState = !activeDisturbance
    setActiveDisturbance(newShuffleState)

    // Update global play mode
    if (newShuffleState) {
      global.globalPlayMode = 'shuffle'
      // Turn off repeat if shuffle is on
      if (activeRepeat) {
        setActiveRepeat(false)
        if (soundRef.current) {
          soundRef.current.setIsLoopingAsync(false)
        }
      }
      shuffleQueue()
    } else {
      global.globalPlayMode = 'normal'
      restoreOriginalQueue()
    }
  }, [activeDisturbance, activeRepeat, shuffleQueue, restoreOriginalQueue, showToast])

  // Sync global state when component mounts
  useEffect(() => {
    // If there's a global state different from local state, sync it
    if (global.globalCurrentSong && global.globalCurrentSong !== currentSong) {
      setCurrentSong(global.globalCurrentSong)
      setCurrentBETrack(global.globalBETrack)
    }
  }, []) // Run only on mount

  const renderLeftHeader = useCallback(() => {
    return (
      <TouchableOpacity className="bg-[#919EAB3D] rounded-full h-12 w-12 items-center justify-center">
        <IconThreePoint />
      </TouchableOpacity>
    )
  }, [])
  
  // Memoized render functions to prevent unnecessary re-renders
  const renderRelatedTracksSection = useCallback(() => {
    let relatedTracks: any[] = []
    let sectionTitle = ''

    if (artistId && listTrackQuery?.data?.data) {
      // Get tracks from same artist
      relatedTracks = listTrackQuery.data.data.filter((track: any) => track.id.toString() !== trackId)
      sectionTitle = `Thêm từ ${listTrackQuery.data.data[0]?.artistName || 'Nghệ sĩ'}`
    } else if (albumId && albumDetailQuery?.data?.data?.tracks) {
      // Get tracks from same album
      relatedTracks = albumDetailQuery.data.data.tracks.filter((track: any) => track.id.toString() !== trackId)
      sectionTitle = `Thêm từ album ${albumDetailQuery.data.data.title || 'Album'}`
    } else if (playlistId && playlistDetailQuery?.data?.data?.tracks) {
      // Get tracks from same playlist
      relatedTracks = playlistDetailQuery.data.data.tracks.filter((track: any) => track.id.toString() !== trackId)
      sectionTitle = `Thêm từ playlist ${playlistDetailQuery.data.data.title || 'Playlist'}`
    } else if (suggestedTracksQuery?.data?.data) {
      // Get suggested tracks when no context
      relatedTracks = suggestedTracksQuery.data.data.filter((track: any) => track.id.toString() !== trackId)
      sectionTitle = 'Đề xuất'
    }

    // Only show if we have related tracks
    if (relatedTracks.length === 0) return null

    return (
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim
        }}
      >
        <TitleHome text={sectionTitle} />
        <FlatList
          className="mt-4 mb-8"
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ gap: 20, paddingHorizontal: 20 }}
          data={relatedTracks.slice(0, 10)} // Limit to 10 tracks
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={async () => {
                // Add to queue and play
                if (global.globalTrackQueue.length === 0) {
                  // If no queue, replace current queue
                  replaceQueue([trackId, item.id.toString()], 0)
                } else {
                  // Add to existing queue
                  addToQueue(item.id.toString())
                }
                
                // Use loadNewTrack to properly handle track change
                await loadNewTrack(item.id.toString())
              }}
              activeOpacity={0.8}
            >
              <ItemLarge 
                data={{
                  title: item.title,
                  artist: { name: item.artistName || item.artist?.name || 'Unknown Artist' },
                  coverUrl: item.coverUrl || item.artwork,
                  duration: item.duration
                }}
              />
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    )
  }, [
    artistId,
    albumId,
    playlistId,
    trackId,
    listTrackQuery?.data?.data,
    albumDetailQuery?.data?.data?.tracks,
    playlistDetailQuery?.data?.data?.tracks,
    suggestedTracksQuery?.data?.data,
    replaceQueue,
    addToQueue,
    loadNewTrack,
    slideAnim,
    fadeAnim
  ])

  const handleFavoriteSong = useCallback(
    async (id: number) => {
      if (!id || !userQuery?.data?.data?.favoriteId) {
        showToast('Không thể thực hiện thao tác yêu thích', 'error')
        return
      }

      try {
        if (currentBETrack?.isFavorite) {
          // Remove from favorites
          await bulkDeleteTracksMutation.mutateAsync({
            ids: [id],
          })

          // Update local state immediately for better UX
          setActiveFovorite(false)
          if (currentBETrack) {
            setCurrentBETrack({
              ...currentBETrack,
              isFavorite: false,
            })
          }

          showToast('Đã xóa khỏi danh sách yêu thích', 'success')
        } else {
          // Add to favorites
          await addTrackToPlaylistMutation.mutateAsync({
            trackId: Number(id),
            playlistId: Number(userQuery.data.data.favoriteId),
          })

          // Update local state immediately for better UX
          setActiveFovorite(true)
          if (currentBETrack) {
            setCurrentBETrack({
              ...currentBETrack,
              isFavorite: true,
            })
          }

          showToast('Đã thêm vào danh sách yêu thích', 'success')
        }
      } catch (error) {
        console.error('Error handling favorite song:', error)
        showToast('Có lỗi xảy ra, vui lòng thử lại', 'error')

        // Revert state on error
        setActiveFovorite(currentBETrack?.isFavorite || false)
      }
    },
    [
      currentBETrack?.isFavorite,
      bulkDeleteTracksMutation,
      addTrackToPlaylistMutation,
      userQuery?.data?.data?.favoriteId,
      showToast,
    ],
  )

  // Show loading state while fetching track data
  if (isTrackLoading) {
    return (
      <BlurHeaderBackground backgroundImage={images.artist} isBlur>
        <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
        <HeaderBackComponent leftChildren={renderLeftHeader()} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">Đang tải bài hát...</Text>
        </View>
      </BlurHeaderBackground>
    )
  }

  // Show error state if track loading failed
  if (hasTrackError || !hasValidTrack) {
    return (
      <BlurHeaderBackground backgroundImage={images.artist} isBlur>
        <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
        <HeaderBackComponent leftChildren={renderLeftHeader()} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-white text-lg mb-4">Không thể tải bài hát</Text>
          <Text className="text-[#919EAB] text-center mb-6">
            {hasTrackError ? 'Đã xảy ra lỗi khi tải dữ liệu' : 'Bài hát không có file âm thanh'}
          </Text>
          <TouchableOpacity
            className="bg-[#B1FF4D] px-6 py-3 rounded-full"
            onPress={() => trackDetailQuery.refetch()}
          >
            <Text className="text-black font-medium">Thử lại</Text>
          </TouchableOpacity>
        </View>
      </BlurHeaderBackground>
    )
  }

  return (
    <BlurHeaderBackground
      backgroundImage={backgroundImageSource}
      isBlur
    >
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderBackComponent leftChildren={renderLeftHeader()} />
      <Animated.View 
        className="items-center mt-4 mb-6"
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}
      >
                <Animated.Image
          source={coverImageSource}
          className="w-48 h-48 rounded-2xl mb-8 border border-[#FFFFFF29]"
          resizeMode="cover"
          style={{
            opacity: imageOpacityAnim,
            transform: [{ scale: scaleAnim }]
          }}
        />
        <View className="items-center">
          <Text className="text-white text-xl">{currentSong?.title || 'Không có tiêu đề'}</Text>
          <Text className="text-xs my-2 text-[#919EAB]">
            {currentSong?.artist || 'Không rõ nghệ sĩ'}
          </Text>
          <View className="flex-row gap-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="play-outline" size={14} color="#919EAB" />
              <Text className="text-[#919EAB]">
                {currentBETrack?.playCount ? formatCount(currentBETrack.playCount) : '0'}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <AntDesign name="hearto" size={14} color="#919EAB" />
              <Text className="text-[#919EAB]">
                {currentBETrack?.likeCount ? formatCount(currentBETrack.likeCount) : '0'}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-10 items-center mt-6">
            <TouchableOpacity>
              <IconAddToPlayList />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (currentBETrack?.id) {
                  handleFavoriteSong(currentBETrack.id)
                }
              }}
              disabled={addTrackToPlaylistMutation.isPending || bulkDeleteTracksMutation.isPending}
            >
              <Foundation
                name="heart"
                size={26}
                color={
                  addTrackToPlaylistMutation.isPending || bulkDeleteTracksMutation.isPending
                    ? '#919EAB'
                    : activeFavorite
                      ? '#B1FF4D'
                      : 'white'
                }
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <IconShare />
            </TouchableOpacity>
          </View>
          {currentSong && (
            <MusicProgressBar
              sound={sound}
              playbackStatus={playbackStatus}
              onSeek={async (position) => {
                if (sound) {
                  try {
                    await sound.setPositionAsync(position)
                  } catch (error) {
                    console.error('Error seeking from play-music:', error)
                  }
                }
              }}
            />
          )}
          <View className="flex-row gap-8 items-center mt-6">
            <TouchableOpacity onPress={handleRepeatToggle} disabled={isLoading}>
              <IconRepeat color={activeRepeat ? '#B1FF4D' : '#fff'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={playPreviousSong} disabled={isLoading}>
              <IconStepBack color={isLoading ? '#919EAB' : '#fff'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlayback} disabled={isLoading}>
              {isPlaying ? <IconPause /> : <IconPlayMusic2 />}
            </TouchableOpacity>
            <TouchableOpacity onPress={playNextSong} disabled={isLoading}>
              <IconStepNext color={isLoading ? '#919EAB' : '#fff'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShuffleToggle}
              disabled={isLoading || global.globalTrackQueue.length <= 1}
            >
              <IconDisturbance
                color={
                  isLoading || global.globalTrackQueue.length <= 1
                    ? '#919EAB'
                    : activeDisturbance
                      ? '#B1FF4D'
                      : '#fff'
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      {/* Related Tracks Section */}
      {renderRelatedTracksSection()}
    </BlurHeaderBackground>
  )
})

export default PlayMusic
