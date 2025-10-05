import { StatusBar, Text, TouchableOpacity, View } from 'react-native'
import HeaderComponentText from '@/components/HeaderComponentText'
import { ERouteTable } from '@/constants/route-table'
import { AntDesign, Entypo, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons'
import React from 'react'
import { useRouter } from 'expo-router'

export default function AboutScreen() {
  const router = useRouter()

  return (
    <View>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderComponentText title="Giới thiệu" />
      <View className="px-4 mt-8">
        <TouchableOpacity
          className="flex-row justify-between w-full p-2 items-center"
          onPress={() => router.push(ERouteTable.PRIVACY_POLICY)}
        >
          <View className="flex-row gap-4 items-center justify-between">
            <Text className="text-[#212B36]">Chính sách bảo mật</Text>
          </View>
          <SimpleLineIcons name="arrow-right" size={16} color="#919EAB" />
        </TouchableOpacity>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#919EAB' }} />
        <TouchableOpacity
          className="flex-row justify-between w-full p-2 items-center"
          onPress={() => router.push(ERouteTable.TERM_CONDITION)}
        >
          <View className="flex-row gap-4 items-center justify-between">
            <Text className="text-[#212B36]">Điều khoản & Điều kiện</Text>
          </View>
          <SimpleLineIcons name="arrow-right" size={16} color="#919EAB" />
        </TouchableOpacity>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#919EAB' }} />
        <TouchableOpacity
          className="flex-row justify-between w-full p-2 items-center"
          onPress={() => router.push(ERouteTable.SUPPORT)}
        >
          <View className="flex-row gap-4 items-center justify-between">
            <Text className="text-[#212B36]">Hỗ trợ</Text>
          </View>
          <SimpleLineIcons name="arrow-right" size={16} color="#919EAB" />
        </TouchableOpacity>
      </View>
    </View>
  )
}
