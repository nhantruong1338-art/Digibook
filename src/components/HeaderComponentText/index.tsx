import { Image, Text, TouchableOpacity, View } from 'react-native'
import { router, useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import React from 'react'
import { images } from '@/constants'
import IconSearchHome from '~/assets/icon-svg/home/IconSearchHome'
import IconBack from '~/assets/icon-svg/IconBack'

interface IHeaderComponentProps {
  title: string
}

export default function HeaderComponentText({ title }: IHeaderComponentProps) {
  const router = useRouter()

  return (
    <View className="flex-row justify-between w-full items-center pt-16 pb-4 px-4">
      <TouchableOpacity onPress={() => router.back()}>
        <IconBack />
      </TouchableOpacity>
      <Text className="font-semibold text-lg text-[#212B36]">{title}</Text>
      <Text className="text-white">ddd</Text>
    </View>
  )
}
