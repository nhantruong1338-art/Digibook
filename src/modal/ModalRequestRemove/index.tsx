import ModalComponent from '@/components/ModalComponent'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { UserRanking } from '@/hooks/useHome'

interface IModalSelectModeProps {
  onClose: () => void
  visible: boolean
  data?: UserRanking[] // Optional data prop, can be used for future enhancements
}

export default function ModalRequestRemove({ onClose, visible, data }: IModalSelectModeProps) {
  return (
    <ModalComponent onClose={onClose} visible={visible} height="22%">
      <View className="items-center">
        <Text className="mt-6 font-semibold text-xl text-white">Xóa danh sách phát?</Text>
        <Text className="text-center mt-2 text-[#919EAB]">
          Bạn có chắc chắn muốn xóa danh sách {'\n'} phát này không?
        </Text>
        <View className="flex-row gap-4 mt-10">
          <TouchableOpacity
            className="px-8 py-3 border border-[#919EAB52] rounded-xl"
            onPress={onClose}
          >
            <Text className="text-white font-semibold">Hủy bỏ</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-8 py-3 bg-[#A766FF] rounded-xl">
            <Text className="text-white font-semibold">Xóa bỏ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalComponent>
  )
}
