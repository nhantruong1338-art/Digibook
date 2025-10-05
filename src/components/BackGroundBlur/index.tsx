import React from 'react'
import { View, StyleSheet, Image, Dimensions, ImageSourcePropType } from 'react-native'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'

const { height } = Dimensions.get('window')
const HEADER_HEIGHT = height * 0.35

type Props = {
  backgroundImage: ImageSourcePropType
  children: React.ReactNode
  isBlur?: boolean
}

export default function BlurHeaderBackground({ backgroundImage, children, isBlur }: Props) {
  return (
    <View style={styles.container}>
      {/* Background image with blur */}
      <View style={styles.header}>
        <Image source={backgroundImage} style={styles.image} resizeMode="cover" />
        {isBlur && <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />}
        <LinearGradient
          colors={['transparent', 'white']}
          style={StyleSheet.absoluteFill}
          locations={[0.4, 1]}
        />
      </View>

      {/* Content chồng lên background */}
      <View style={styles.content}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    position: 'absolute',
    top: 0,
    height: HEADER_HEIGHT,
    width: '100%',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: 20,
    zIndex: 2,
    marginTop: 60,
    backgroundColor: 'transparent',
  },
})
