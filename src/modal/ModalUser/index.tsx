import { Text, TouchableOpacity, View, Switch } from 'react-native'
import React, { useState } from 'react'
import ModalComponentUser from '@/components/ModalComponentUser'
import { AntDesign, Entypo, Ionicons, SimpleLineIcons } from '@expo/vector-icons'
import IconClose from '~/assets/icon-svg/IconClose'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { useToast } from '@/components/ToastNotify/ToastContext'
import { useAuthStore } from '@/store/useAuthStore'

interface IModalSelectModeProps {
  onClose: () => void
  visible: boolean
}

export default function ModalUser({ onClose, visible }: IModalSelectModeProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const { signOut, user } = useAuthStore()

  const [checked, setChecked] = useState<boolean>(false)

  return (
    <ModalComponentUser onClose={onClose} visible={visible} height="43%">
      <TouchableOpacity className="flex-row justify-between w-full mb-4" onPress={onClose}>
        <Text></Text>
        <IconClose />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onClose()
          router.push(ERouteTable.ACCOUNT_INFORMATION)
        }}
        className="flex-row justify-between w-full p-2 rounded-2xl items-center bg-[#919EAB14]"
      >
        <View className="flex-row gap-4 items-center justify-between">
          <AntDesign name="user" size={24} color="#637381" />
          <View>
            <Text className="text-[#212B36] font-semibold">{user?.data?.fullName || 'Chris Hemsworth'}</Text>
            <Text className="text-[#637381]">{user?.data?.email || 'test@gmail.com'}</Text>
          </View>
        </View>
        <SimpleLineIcons name="arrow-right" size={16} color="#637381" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onClose()
          router.push(ERouteTable.SETTING_SCREEN)
        }}
        className="flex-row justify-between w-full p-2 rounded-2xl items-center my-6"
      >
        <View className="flex-row gap-4 items-center justify-between">
          <AntDesign name="setting" size={24} color="#637381" />
          <Text className="text-[#637381]">Cài đặt</Text>
        </View>
        <SimpleLineIcons name="arrow-right" size={16} color="#637381" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onClose()
          router.push(ERouteTable.ABOUT_SCREEN)
        }}
        className="flex-row justify-between w-full p-2 rounded-2xl items-center"
      >
        <View className="flex-row gap-4 items-center justify-between">
          <Entypo name="light-bulb" size={24} color="#637381" />
          <Text className="text-[#637381]">Giới thiệu</Text>
        </View>
        <SimpleLineIcons name="arrow-right" size={16} color="#637381" />
      </TouchableOpacity>
      <View className="w-full border border-dashed my-6" style={{ borderColor: '#637381' }} />
      <View className="flex-row justify-between w-full p-2 rounded-2xl items-center mb-6">
        <View className="flex-row gap-4 items-center justify-between">
          <Ionicons name="notifications-outline" size={24} color="#637381" />
          <Text className="text-[#637381]">Thông báo</Text>
        </View>
        <Switch
          value={checked}
          onValueChange={(checked) => {
            setChecked(checked)
          }}
          trackColor={{ false: '#767577', true: '#B1FF4D' }}
          thumbColor={checked ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
      <TouchableOpacity
        className="flex-row justify-between w-full p-2 rounded-2xl items-center"
        onPress={() => {
          signOut()
          onClose()
          showToast('Đăng xuất thành công!', 'success')
          router.push(ERouteTable.SIGIN_IN)
        }}
      >
        <View className="flex-row gap-4 items-center justify-between">
          <AntDesign name="logout" size={24} color="#637381" />
          <Text className="text-[#637381]">Đăng xuất</Text>
        </View>
      </TouchableOpacity>
    </ModalComponentUser>
  )
}
