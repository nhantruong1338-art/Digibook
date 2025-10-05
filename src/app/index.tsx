import { Image, StatusBar, View } from 'react-native'
import { useEffect } from 'react'
import { router } from 'expo-router'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import { useAuthStore } from '@/store/useAuthStore'

export default function Root() {
  const { user } = useAuthStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        router.replace(ERouteTable.HOME)
      } else {
        router.replace(ERouteTable.ONBOARDING)
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [user])

  return (
    <View className="flex-1 justify-center items-center bg-[#FFFFFFD9]">
      <StatusBar translucent barStyle="light-content" backgroundColor="#FFFFFFD9" />
      <Image source={images.splash} className="w-full h-full" />
    </View>
  )
}
