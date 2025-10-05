import { StatusBar, Text, TouchableOpacity, View } from 'react-native'
import HeaderComponentText from '@/components/HeaderComponentText'
import React from 'react'
import { ERouteTable } from '@/constants/route-table'
import { AntDesign, Entypo, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function SettingScreen() {
  const router = useRouter()

  return (
    <View>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderComponentText title="Cài đặt" />
      <View className="px-4 mt-8">
        <TouchableOpacity
          className="flex-row justify-between w-full p-2 items-center"
          onPress={() => router.push(ERouteTable.APP_OPTIONS)}
        >
          <View className="flex-row gap-4 items-center justify-between">
            <Entypo name="light-down" size={24} color="#637381" />
            <Text className="text-[#212B36]">Tùy chọn ứng dụng</Text>
          </View>
          <SimpleLineIcons name="arrow-right" size={16} color="#637381" />
        </TouchableOpacity>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />
        <TouchableOpacity
          className="flex-row justify-between w-full p-2 items-center"
          onPress={() => router.push(ERouteTable.CONTENT_QUALITY)}
        >
          <View className="flex-row gap-4 items-center justify-between">
            <MaterialIcons name="display-settings" size={24} color="#637381" />
            <View>
              <Text className="text-[#212B36]">Chất lượng nội dung</Text>
              <Text className="text-[#637381]">Âm nhạc và video</Text>
            </View>
          </View>
          <SimpleLineIcons name="arrow-right" size={16} color="#637381" />
        </TouchableOpacity>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />
        <TouchableOpacity
          className="flex-row justify-between w-full p-2 items-center"
          onPress={() => router.push(ERouteTable.DATA_SCREEN)}
        >
          <View className="flex-row gap-4 items-center justify-between">
            <AntDesign name="cloudo" size={24} color="#637381" />
            <Text className="text-[#212B36]">Dữ liệu</Text>
          </View>
          <SimpleLineIcons name="arrow-right" size={16} color="#637381" />
        </TouchableOpacity>
      </View>
    </View>
  )
}
