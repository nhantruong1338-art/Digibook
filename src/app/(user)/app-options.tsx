import { Text, View, Switch, StatusBar } from 'react-native'
import HeaderComponentText from '@/components/HeaderComponentText'
import React, { useState } from 'react'

export default function AppOptions() {
  const [checked, setChecked] = useState<boolean>(false)
  const [checkedLocation, setCheckedLocation] = useState<boolean>(false)

  return (
    <View>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderComponentText title="Tùy chọn ứng dụng" />
      <View className="px-4 mt-8">
        <Text className="text-[#637381]">TỔNG QUAN</Text>
        <View className="flex-row justify-between">
          <View className="w-[80%]">
            <Text className="text-[#212B36] my-2">Bật lịch sử tìm kiếm</Text>
            <Text className="text-[#637381]">
              Cho phép lưu các tìm kiếm gần đây của bạn. Dữ liệu được lưu trữ cục bộ trên thiết bị
              này và không được tải lên máy chủ của chúng tôi.
            </Text>
          </View>
          <Switch
            value={checked}
            onValueChange={(checked) => {
              setChecked(checked)
            }}
          />
        </View>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />
        <View className="flex-row justify-between">
          <View className="w-[80%]">
            <Text className="text-[#212B36] my-2">Xác nhận vị trí</Text>
            <Text className="text-[#637381]">
              Khi bạn không hoạt động trong một thời gian, hãy xác nhận xem bạn muốn phát nhạc ở
              đâu.
            </Text>
          </View>
          <Switch
            value={checkedLocation}
            onValueChange={(checked) => {
              setCheckedLocation(checked)
            }}
          />
        </View>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />
        <Text className="text-[#637381] mt-8">TỔNG QUAN</Text>
        <Text className="text-[#212B36] my-2">Phiên bản</Text>
        <Text className="text-[#637381]">1.0.1</Text>
      </View>
    </View>
  )
}
