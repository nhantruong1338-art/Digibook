import ModalComponent from '@/components/ModalComponent'
import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

interface IModalSelectModeProps {
  onClose: () => void
  visible: boolean
}

export default function ModalRemoveAccount({ onClose, visible }: IModalSelectModeProps) {
  return (
    <ModalComponent onClose={onClose} visible={visible} height="24%">
      <View className="items-center">
        <Text className="mt-6 font-semibold text-xl text-[#212B36]">Xóa tài khoản?</Text>
        <Text className="text-center mt-2 text-[#637381]">
          Xóa tài khoản sẽ xóa vĩnh viễn dữ liệu. {'\n'} Bạn có chắc chắn muốn xóa tài khoản này{' '}
          {'\n'} khỏi hệ thống không?
        </Text>
        <View className="flex-row gap-4 mt-10">
          <TouchableOpacity
            className="px-8 py-3 border border-[#919EAB52] rounded-xl"
            onPress={onClose}
          >
            <Text className="text-[#212B36] font-semibold">Hủy bỏ</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-8 py-3 bg-[#FF9315] rounded-xl">
            <Text className="text-white font-semibold">Xóa bỏ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalComponent>
  )
}
