import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { Audio } from 'expo-av'
import { sampleSongs, Song } from '@/data/DataMusic'
import { images } from '@/constants'
import IconPlayMusic2 from '~/assets/icon-svg/song/IconPlayMusic2'
import IconPause from '~/assets/icon-svg/song/IconPause'
import IconClose from '~/assets/icon-svg/IconClose'
import IconPlayMusicMini from '~/assets/icon-svg/song/IconPlayMusicMini'
import IconPauseMini from '~/assets/icon-svg/song/IconPauseMini'

// Import global state (we'll share this with play-music.tsx)
declare global {
  var globalSound: Audio.Sound | null
  var globalCurrentSongId: string | null
  var globalCurrentSong: Song | null
  var globalIsPlaying: boolean
}

// Initialize global state if not exists
if (typeof global !== 'undefined') {
  global.globalSound = global.globalSound || null
  global.globalCurrentSongId = global.globalCurrentSongId || null
  global.globalCurrentSong = global.globalCurrentSong || null
  global.globalIsPlaying = global.globalIsPlaying || false
}

export default function MiniPlayer() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(() => {
    // Initialize based on global state without causing updates
    return !!(global.globalSound && global.globalCurrentSongId)
  })
  const [isPlaying, setIsPlaying] = useState(() => global.globalIsPlaying || false)
  const [currentSong, setCurrentSong] = useState<Song>(
    () => global.globalCurrentSong || sampleSongs[0],
  )
  const [slideAnim] = useState(
    new Animated.Value(!!(global.globalSound && global.globalCurrentSongId) ? 0 : -100),
  )
  const [isLoading, setIsLoading] = useState(false)

  // Check for active music and update state
  useEffect(() => {
    let isMounted = true

    const checkMusicState = async () => {
      if (!isMounted) return

      const hasGlobalMusic = global.globalSound && global.globalCurrentSongId

      if (hasGlobalMusic && global.globalCurrentSong) {
        // Only update if different to avoid unnecessary renders
        if (global.globalCurrentSong.id !== currentSong.id) {
          setCurrentSong(global.globalCurrentSong)
        }

        // Get real-time playing state from sound object
        try {
          if (global.globalSound) {
            const status = await global.globalSound.getStatusAsync()
            if (status.isLoaded && isMounted) {
              const actualIsPlaying = status.isPlaying || false
              if (actualIsPlaying !== isPlaying) {
                setIsPlaying(actualIsPlaying)
                global.globalIsPlaying = actualIsPlaying
              }
            }
          }
        } catch (error) {
          const fallbackPlaying = global.globalIsPlaying || false
          if (fallbackPlaying !== isPlaying) {
            setIsPlaying(fallbackPlaying)
          }
        }

        if (!isVisible && isMounted) {
          setIsVisible(true)
          // Slide up animation
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start()
        }
      } else {
        if (isVisible && isMounted) {
          // Slide down animation
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            if (isMounted) {
              setIsVisible(false)
            }
          })
        }
      }
    }

    // Delay initial check to avoid useInsertionEffect warning
    const timeoutId = setTimeout(checkMusicState, 150)

    // Set up interval to sync state
    const interval = setInterval(checkMusicState, 1000)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      clearInterval(interval)
    }
  }, [isVisible, isPlaying, currentSong.id, slideAnim])

  // Sync with global state changes from play-music
  useEffect(() => {
    const handleGlobalStateChange = () => {
      // Check if global state has changed
      if (global.globalCurrentSong && global.globalCurrentSong.id !== currentSong.id) {
        setCurrentSong(global.globalCurrentSong)
      }
      
      if (global.globalIsPlaying !== isPlaying) {
        setIsPlaying(global.globalIsPlaying)
      }
    }

    // Check every 500ms for global state changes
    const interval = setInterval(handleGlobalStateChange, 500)

    return () => clearInterval(interval)
  }, [currentSong.id, isPlaying])

  // Toggle play/pause
  const togglePlayback = async () => {
    if (!global.globalSound || isLoading) return

    try {
      setIsLoading(true)
      if (isPlaying) {
        await global.globalSound.pauseAsync()
        global.globalIsPlaying = false
        setIsPlaying(false)
      } else {
        await global.globalSound.playAsync()
        global.globalIsPlaying = true
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Error toggling playback from mini player:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Navigate to full player
  const openFullPlayer = () => {
    if (global.globalCurrentSongId) {
      router.push({
        pathname: '/(children)/play-music',
        params: { trackId: global.globalCurrentSongId }
      })
    } else {
      // Fallback if no track ID
      router.push('/(children)/play-music')
    }
  }

  // Close mini player
  const closeMiniPlayer = async () => {
    if (global.globalSound) {
      try {
        await global.globalSound.stopAsync()
        await global.globalSound.unloadAsync()
        global.globalSound = null
        global.globalCurrentSongId = null
        global.globalIsPlaying = false
      } catch (error) {
        console.error('Error stopping music:', error)
      }
    }

    // Slide down animation
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false)
    })
  }

  if (!isVisible) return null

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
      }}
      className="absolute bottom-28 left-0 right-0 bg-[#212B36D9] mx-6 rounded-full p-3 flex-row items-center justify-between shadow-lg z-50"
    >
      {/* Song Info */}
      <TouchableOpacity
        onPress={openFullPlayer}
        className="flex-row items-center flex-1"
        activeOpacity={0.8}
      >
        <Image
          source={currentSong.artwork ? { uri: currentSong.artwork } : images.artist}
          className="w-[36px] h-[36px] rounded-lg border border-[#FFFFFF29] mr-3 ml-4"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="text-white font-medium text-sm" numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text className="text-gray-400 text-xs mt-1" numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Controls */}
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={togglePlayback}
          className={`mr-3`}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isPlaying ? <IconPauseMini /> : <IconPlayMusicMini />}
        </TouchableOpacity>

        <TouchableOpacity onPress={closeMiniPlayer} className="items-center justify-center mr-2">
          <IconClose />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}
