// MusicProgressBar.tsx
import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Audio } from 'expo-av'

const { width } = Dimensions.get('window')
const BAR_WIDTH = width - 64

interface MusicProgressBarProps {
  sound: Audio.Sound | null
  playbackStatus?: any
  duration?: number
  currentPosition?: number
  onSeek?: (position: number) => Promise<void>
}

export default function MusicProgressBar({
  sound,
  playbackStatus,
  duration = 0,
  currentPosition = 0,
  onSeek,
}: MusicProgressBarProps) {
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (playbackStatus && playbackStatus.durationMillis) {
      const progress = playbackStatus.positionMillis / playbackStatus.durationMillis

      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start()
    }
  }, [playbackStatus])

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleSeek = async (event: any) => {
    if (!sound || !playbackStatus || !playbackStatus.durationMillis) return

    const { locationX } = event.nativeEvent
    const progress = Math.max(0, Math.min(1, locationX / BAR_WIDTH))
    const seekPosition = progress * playbackStatus.durationMillis

    if (onSeek) {
      try {
        await onSeek(seekPosition)
      } catch (error) {
        console.error('Error seeking:', error)
      }
    }
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_WIDTH],
  })

  const currentTimeMillis = playbackStatus?.positionMillis || 0
  const durationMillis = playbackStatus?.durationMillis || 0

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.progressBarContainer}
        activeOpacity={0.8}
        onPress={handleSeek}
      >
        <View style={styles.barBackground} />
        <Animated.View style={[styles.progressBar, { width: progressWidth }]}>
          <LinearGradient
            colors={['#B1FF4D', '#8FE63F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View style={[styles.thumb, { left: progressWidth }]} />
      </TouchableOpacity>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(currentTimeMillis)}</Text>
        <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30,
    paddingHorizontal: 32,
    width: width,
  },
  progressBarContainer: {
    height: 20,
    justifyContent: 'center',
    paddingVertical: 7,
  },
  barBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3e3e3e',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    top: 7,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#B1FF4D',
    position: 'absolute',
    top: 2,
    marginLeft: -8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
})
