import { Text, TouchableOpacity, View, Switch, StatusBar } from 'react-native'
import HeaderComponentText from '@/components/HeaderComponentText'
import React, { useState } from 'react'

export default function DataScreen() {
  const [checked, setChecked] = useState<boolean>(false)
  const [checked2, setChecked2] = useState<boolean>(false)
  const [checkedLocation, setCheckedLocation] = useState<boolean>(false)

  return (
    <View>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderComponentText title="Dữ liệu" />
      <View className="px-4 mt-8">
        <Text className="text-[#637381]">TIẾT KIỆM DỮ LIỆU</Text>
        <View className="flex-row justify-between">
          <View className="w-[80%]">
            <Text className="text-[#212B36] my-2">Trình tiết kiệm dữ liệu</Text>
            <Text className="text-[#637381]">
              Giảm chất lượng phát trực tuyến và tắt các tính năng khác tốn nhiều dung dữ liệu.
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
            <Text className="text-[#212B36] my-2">Tải xuống qua dữ liệu di động</Text>
            <Text className="text-[#637381]">
              Quá trình tải xuống bắt đầu hoặc tiếp tục khi bạn không kết nối với Wi-Fi.
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
        <View className="flex-row justify-between">
          <View className="w-[80%]">
            <Text className="text-[#212B36] my-2">Chỉ tải âm thanh của podcast dạng video</Text>
            <Text className="text-[#637381]">Chỉ lưu âm thanh khi bạn tải podcast dạng video</Text>
          </View>
          <Switch
            value={checked2}
            onValueChange={(checked) => {
              setChecked2(checked)
            }}
          />
        </View>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />
        <View className="flex-row justify-between">
          <View className="w-[80%]">
            <Text className="text-[#212B36] my-2">
              Chỉ phát trực tuyến âm thanh của podcast dạng video
            </Text>
            <Text className="text-[#637381]">
              Podcast dạng video chỉ phát âm thanh khi bạn không kết nối với Wi-Fi.
            </Text>
          </View>
          <Switch
            value={checked2}
            onValueChange={(checked) => {
              setChecked2(checked)
            }}
          />
        </View>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />
        <View className="flex-row justify-between items-center">
          <View className="w-[80%]">
            <Text className="text-[#212B36] my-2">Xóa tất cả nội dung tải xuống</Text>
            <Text className="text-[#637381]">
              Xóa nội dung bạn đã tải xuống để giải phóng dung lượng
            </Text>
          </View>
          <TouchableOpacity className="rounded-xl border border-[#637381] items-center justify-center px-6 h-max max-h-8">
            <Text className="text-[#212B36]">Xoá</Text>
          </TouchableOpacity>
        </View>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />
        <View className="flex-row justify-between items-center">
          <View className="w-[80%]">
            <Text className="text-[#212B36] my-2">Xóa bộ nhớ đệm</Text>
            <Text className="text-[#637381]">
              Giải phóng dung lượng bằng các xóa dữ liệu. (Nội dung bạn tải xuống sẽ không bị xóa).
            </Text>
          </View>
          <TouchableOpacity className="rounded-xl border border-[#637381] items-center justify-center px-6 h-max max-h-8">
            <Text className="text-[#212B36]">Xoá</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
