// types.d.ts
import 'nativewind/types'
import { LinearGradient } from 'expo-linear-gradient'

declare module 'expo-linear-gradient' {
  interface LinearGradientProps {
    className?: string
  }
}
