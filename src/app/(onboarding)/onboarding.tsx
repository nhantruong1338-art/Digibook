import { Text, ImageBackground, TouchableOpacity, View, Image, StatusBar } from 'react-native'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import { router } from 'expo-router'

export default function Onboarding() {
  return (
    <ImageBackground source={images.onboarding2} resizeMode="cover" className="h-full px-8 pt-16">
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <Image source={images.logoOnboarding} className="h-[32px] w-[166px]" />
      <Text className="text-3xl leading-[100%] mt-[54vh] text-[#212B36]">
        <Text className="font-bold">Nâng cao</Text> khả năng đọc {'\n'}của bạn với{' '}
        <Text className="font-bold">DigiBook</Text>
      </Text>
      <Text className="py-6 text-[#637381]">
        Hàng ngàn cuốn sách, từ kinh doanh đến tiểu thuyết, chỉ cách bạn một cú chạm.
      </Text>
      <View className="mt-10">
        <TouchableOpacity
          className="bg-[#212B36] w-max rounded-[16px] px-[70px] h-14 justify-center"
          onPress={() => router.replace(ERouteTable.SIGIN_IN)}
        >
          <Text className="text-center text-white text-lg font-bold ">Bắt đầu</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}
