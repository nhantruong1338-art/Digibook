import { Image, Text, TouchableOpacity, View } from 'react-native'
import { router, useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import React from 'react'
import { images } from '@/constants'
import IconSearchHome from '~/assets/icon-svg/home/IconSearchHome'

interface IHeaderComponentProps {
  title: string
}

export default function HeaderComponent({ title }: IHeaderComponentProps) {
  const router = useRouter()

  return (
    <View className="flex-row justify-between w-full items-center pt-20 pb-4 px-4">
      <Image
        source={images.logoApp}
        className="w-[48px] h-[48px] rounded-full"
        resizeMode="cover"
      />
      <Text className="font-semibold text-lg">{title}</Text>
      <TouchableOpacity
        onPress={() => router.push(ERouteTable.SEARCH_SCREEN)}
        className="w-[48px] h-[48px] bg-[#64748B14] items-center justify-center rounded-full"
      >
        <IconSearchHome />
      </TouchableOpacity>
    </View>
  )
}
