import {
  Image,
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native'
import HeaderComponentText from '@/components/HeaderComponentText'
import { images } from '@/constants'
import { CloseCircle, Headphone, Magicpen } from 'iconsax-react-native'
import CustomBottomSheet from '@/components/BottomSheetDemo'
import React, { useState } from 'react'
import { useDownloadFile } from '@/utils/useDownloadFile'
import { useToast } from '@/components/ToastNotify/ToastContext'
import HeaderBackComponent from '@/components/HeaderBackComponent'

export default function AiUpdate() {
  const [isVisible, setIsVisible] = useState(false)
  const { downloadFile, isDownloading, progress } = useDownloadFile()
  const { showToast } = useToast()

  const handleDownloadQR = async () => {
    try {
      const qrImageUrl =
        'https://img.vietqr.io/image/ACB-37982017-compact2.png?amount=69000&addInfo=YZ6GJ&accountName=MATH%20TUTOR'
      const currentDate = new Date().toISOString().split('T')[0]
      const filename = `QR_ThanhToan_AI_${currentDate}.png`

      const result = await downloadFile(qrImageUrl, filename)

      if (result) {
        showToast(`Đã lưu mã QR thanh toán vào thư viện ảnh\\nTên file: ${filename}`, 'success')
      }
    } catch (error) {
      console.error('Error downloading QR code:', error)
      showToast('Không thể tải ảnh QR, vui lòng thử lại', 'error')
    }
  }

  return (
    <ImageBackground source={images.bgPremium} resizeMode="cover" className="h-full px-4 pt-20">
      <HeaderBackComponent />
      <View className="mt-20 flex-1 mx-4">
        <Text className="text-[#212B36] text-3xl mb-6">
          Mở Khóa Trải Nghiệm {`\n`}
          Đọc Sách Đỉnh Cao
        </Text>
        <Text className="text-[#637381]">
          Nâng cấp lên gói DigiBook Premium ngay hôm nay để tận hưởng thư viện sách không giới hạn
          và các tính năng độc quyền của chúng tôi.
        </Text>
        <View className="mt-16 flex-row gap-2">
          <Magicpen size="20" color="#212B36" variant="Bold" />
          <Text className="text-[#212B36]">
            Nâng cấp lên gói DigiBook Premium ngay hôm nay để tận hưởng thư viện sách không giới hạn
            và các tính năng độc quyền của chúng tôi.
          </Text>
        </View>
        <View className="mt-2 flex-row gap-2">
          <Headphone size="20" color="#212B36" variant="Bold" />
          <Text className="text-[#212B36]">
            Nâng cấp lên gói DigiBook Premium ngay hôm nay để tận hưởng thư viện sách không giới hạn
            và các tính năng độc quyền của chúng tôi.
          </Text>
        </View>
      </View>
      <View className="mx-4 mb-10">
        <TouchableOpacity
          onPress={() => setIsVisible(true)}
          className="bg-[#212B36] flex-row justify-center items-center rounded-xl h-12"
        >
          <Text className="text-white font-semibold">Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
      <CustomBottomSheet isVisible={isVisible} onClose={() => setIsVisible(false)} maxHeight="60%">
        <View className="px-4 pt-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg text-[#212B36]">Quét QR để thanh toán</Text>
            <CloseCircle size="32" color="white" variant="Bold" />
          </View>
          <View className="flex-row justify-center mt-4">
            <Image
              className="w-80 h-96"
              source={{
                uri: 'https://img.vietqr.io/image/ACB-37982017-compact2.png?amount=69000&addInfo=YZ6GJ&accountName=Digi%20Book',
              }}
            />
          </View>
          <Text className="text-center text-[#212B36] mt-4">
            Sau khi thanh toán xong. Bạn vui lòng liên hệ Zalo số 0123456789
          </Text>
          <TouchableOpacity
            onPress={handleDownloadQR}
            disabled={isDownloading}
            className={`flex-row justify-center items-center mt-2 rounded-xl h-12 ${
              isDownloading ? 'bg-[#212B3680]' : 'bg-[#212B36]'
            }`}
          >
            {isDownloading ? (
              <>
                <ActivityIndicator size="small" color="white" />
                <Text className="text-lg text-[#212B36] ml-2">
                  Đang tải... {Math.round(progress * 100)}%
                </Text>
              </>
            ) : (
              <Text className="text-lg text-white">Lưu hình ảnh</Text>
            )}
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>
    </ImageBackground>
  )
}
