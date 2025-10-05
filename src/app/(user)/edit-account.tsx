import { Image, StatusBar, Text, TextInput, View } from 'react-native'
import HeaderComponentText from '@/components/HeaderComponentText'
import React from 'react'

export default function EditAccount() {
  return (
    <View>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderComponentText title="Chỉnh sửa thông tin" />
      <View className="px-4">
        <View className="flex-row gap-4 items-center">
          <Image
            source={{
              uri: 'https://yt3.googleusercontent.com/enG03m1WKMfZL8ym-8fbtPPDA2uGOX3t1NIWVxltWdJHTmYKsT7LeWYbtrNI7c-PZlB2IqyaqA=s900-c-k-c0x00ffffff-no-rj',
            }}
            className="w-[96px] h-[96px] rounded-full"
            resizeMode="cover"
          />
          <View className="flex-col flex-shrink-0">
            <Text className="text-xl text-[#212B36]">Chris Hemsworth</Text>
            <Text className="text-sm text-[#637381]">user@example.com</Text>
          </View>
        </View>
        <Text className="text-[#637381] mt-4 mb-2">Tên</Text>
        <TextInput
          placeholderTextColor="#637381"
          placeholder="Tên"
          autoCapitalize="none"
          keyboardType="email-address"
          className="border border-[#63738152] text-[#212B36] h-12 rounded-2xl px-4 py-3 mb-2 text-base"
        />
        <Text className="text-[#637381] mt-4 mb-2">Email</Text>
        <TextInput
          placeholderTextColor="#637381"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          className="border border-[#63738152] h-12 text-[#212B36] rounded-2xl px-4 py-3 mb-2 text-base"
        />
        <Text className="text-[#637381] mt-4 mb-2">Giới tính</Text>
        <TextInput
          placeholderTextColor="#637381"
          placeholder="Giới tính"
          autoCapitalize="none"
          keyboardType="email-address"
          className="border border-[#63738152] h-12 text-[#212B36] rounded-2xl px-4 py-3 mb-2 text-base"
        />
        <Text className="text-[#637381] mt-4 mb-2">Ngày sinh</Text>
        <TextInput
          placeholderTextColor="#637381"
          placeholder="Ngày sinh"
          autoCapitalize="none"
          keyboardType="email-address"
          className="border border-[#63738152] h-12 text-[#212B36] rounded-2xl px-4 py-3 mb-2 text-base"
        />
      </View>
    </View>
  )
}
