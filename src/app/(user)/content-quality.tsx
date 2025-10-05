import { ScrollView, Text, TouchableOpacity, View, Switch, StatusBar } from 'react-native'
import HeaderComponentText from '@/components/HeaderComponentText'
import React, { useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'

const listOptions = [
  {
    title: 'Tự động',
  },
  {
    title: 'Thấp',
  },
  {
    title: 'Trung bình',
  },
  {
    title: 'Cao',
  },
  {
    title: 'Rất cao',
    icon: <FontAwesome5 name="crown" size={16} color="#A766FF" />,
  },
]

export default function ContentQuality() {
  const [checkedSound, setCheckedSound] = useState<boolean>(false)

  return (
    <View className="flex-1">
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderComponentText title="Chất lượng nội dung" />
      <ScrollView className="px-4 mt-8 flex-1 mb-8" showsVerticalScrollIndicator={false}>
        <Text className="text-[#637381]">CHẤT LƯỢNG ÂM THANH</Text>
        <Text className="text-[#637381] mt-8">Chất lượng phát trực tuyến qua Wi-Fi</Text>
        <Text className="text-[#212B36] my-2">
          Chọn chất lượng phát trực tuyến âm thanh khi bạn kết nối với Wi-Fi.
        </Text>
        <View className="flex-row mt-4 gap-2">
          {listOptions.map((it) => (
            <TouchableOpacity className="bg-[#63738114] py-2 flex-row gap-2 px-3 rounded-xl">
              {it?.icon && it.icon}
              <Text className="text-[#212B36]">{it.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />
        <Text className="text-[#637381]">Chất lượng phát trực tuyến qua dữ liệu di động</Text>
        <Text className="text-[#212B36] my-2">
          Chọn chất lượng phát trực tuyến âm thanh khi bạn sử dụng dữ liệu di động.
        </Text>
        <View className="flex-row mt-4 gap-2">
          {listOptions.map((it) => (
            <TouchableOpacity className="bg-[#63738114] py-2 flex-row gap-2 px-3 rounded-xl">
              {it?.icon && it.icon}
              <Text className="text-[#212B36]">{it.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />
        <View className="flex-row justify-between items-center">
          <View className="w-[80%]">
            <Text className="text-[#212B36] my-2">Tự động điều chỉnh</Text>
            <Text className="text-[#637381]">
              Chất lượng phát trực tuyến qua Wi-Fi và dữ liệu di động tự động điều chỉnh dựa trên
              tốc độ mạng.
            </Text>
          </View>
          <Switch
            value={checkedSound}
            onValueChange={(checked) => {
              setCheckedSound(checked)
            }}
          />
        </View>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />

        <Text className="text-[#637381]">CHẤT LƯỢNG VIDEO</Text>
        <Text className="text-[#637381] mt-8">Chất lượng phát trực tuyến qua Wi-Fi</Text>
        <Text className="text-[#212B36] my-2">
          Chọn chất lượng phát trực tuyến âm thanh khi bạn kết nối với Wi-Fi.
        </Text>
        <View className="flex-row mt-4 gap-2">
          {listOptions.map((it) => (
            <TouchableOpacity className="bg-[#63738114] py-2 flex-row gap-2 px-3 rounded-xl">
              {it?.icon && it.icon}
              <Text className="text-[#212B36]">{it.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />
        <Text className="text-[#637381]">Chất lượng phát trực tuyến qua dữ liệu di động</Text>
        <Text className="text-[#212B36] my-2">
          Chọn chất lượng phát trực tuyến âm thanh khi bạn sử dụng dữ liệu di động.
        </Text>
        <View className="flex-row mt-4 gap-2">
          {listOptions.map((it) => (
            <TouchableOpacity className="bg-[#63738114] py-2 flex-row gap-2 px-3 rounded-xl">
              {it?.icon && it.icon}
              <Text className="text-[#212B36]">{it.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />
        <Text className="text-[#637381]">CHẤT LƯỢNG TẢI XUỐNG</Text>
        <Text className="text-[#637381] mt-8">Chất lượng nội dung âm thanh tải xuống</Text>
        <Text className="text-[#212B36] my-2">Chọn chất lượng âm thanh khi tải xuống</Text>
        <View className="flex-row mt-4 gap-2">
          {listOptions.map((it) => (
            <TouchableOpacity className="bg-[#63738114] py-2 flex-row gap-2 px-3 rounded-xl">
              {it?.icon && it.icon}
              <Text className="text-[#212B36]">{it.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
