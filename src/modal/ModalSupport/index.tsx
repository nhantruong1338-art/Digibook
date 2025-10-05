import ModalComponent from '@/components/ModalComponent'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { UserRanking } from '@/hooks/useHome'
import ImageWithFallback from '@/components/OptimizedImage/ImageWithFallback'

interface IModalSelectModeProps {
  onClose: () => void
  visible: boolean
}

export default function ModalSupport({ onClose, visible }: IModalSelectModeProps) {
  return (
    <ModalComponent onClose={onClose} visible={visible} height="22%">
      <View className="items-center">
        <Text className="mt-6 font-semibold text-xl text-white">Yêu cầu hỗ trợ</Text>
        <Text className="text-center mt-2 text-[#919EAB]">
          Bạn đã gửi yêu cầu hỗ trợ. Chúng tôi sẽ {'\n'} phản hồi tất cả các yêu cầu hỗ trợ trong{' '}
          {'\n'} vòng 24 - 48 giờ làm việc
        </Text>
        <View className="flex-row gap-4 mt-10">
          <TouchableOpacity className="px-8 py-3 bg-[#A766FF] rounded-xl" onPress={onClose}>
            <Text className="text-white font-semibold">Xóa bỏ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalComponent>
  )
}
