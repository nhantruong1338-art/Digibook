import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import HeaderComponentText from '@/components/HeaderComponentText'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { useState } from 'react'
import ModalRemoveAccount from '@/modal/ModalRemoveAccount'
import { useToast } from '@/components/ToastNotify/ToastContext'
import { useAuthStore } from '@/store/useAuthStore'
import { images } from '@/constants'

export default function AccountInformation() {
  const router = useRouter()
  const [modalDelete, setModalDelete] = useState(false)
  const { showToast } = useToast()
  const { user } = useAuthStore()

  return (
    <View>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderComponentText title="Tài khoản" />
      <View className="mt-8 mx-4">
        <View className="flex-row gap-4">
          <Image
            source={user?.data?.avatarUrl ? {
              uri:
                user?.data?.avatarUrl ||
                'https://yt3.googleusercontent.com/enG03m1WKMfZL8ym-8fbtPPDA2uGOX3t1NIWVxltWdJHTmYKsT7LeWYbtrNI7c-PZlB2IqyaqA=s900-c-k-c0x00ffffff-no-rj',
            } : images.avatar}
            className="w-[96px] h-[96px] rounded-full"
            resizeMode="cover"
          />
          <View className="flex-col flex-shrink-0">
            <Text className="text-xl text-[#212B36]">{user?.data?.fullName || 'Chris Hemsworth'}</Text>
            <Text className="text-sm text-[#637381]">{user?.data?.email || 'test@gmail.com'}</Text>
            <TouchableOpacity
              onPress={() => router.push(ERouteTable.EDIT_ACCOUNT)}
              className="mt-4 border border-[#637381] rounded-xl p-2 w-[76px] items-center"
            >
              <Text className="text-xs font-semibold text-[#212B36]">Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          className="mt-10"
          onPress={() => {
            showToast('Tính năng đang phát triển', 'error')
          }}
        >
          <Text className="text-[#212B36]">Gói đăng ký</Text>
          <Text className="text-[#637381] mt-2">MIỄN PHÍ</Text>
        </TouchableOpacity>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />
        <TouchableOpacity
          onPress={() => router.push(ERouteTable.AI_UPDATE)}

        >
          <Text className="text-[#212B36]">Nhận gói cao cấp</Text>
          <Text className="text-[#637381] mt-2">
            Đọc không giới hạn, nâng tầm trải nghiệm.
          </Text>
        </TouchableOpacity>
        <View className="border border-dashed mt-4 mb-8" style={{ borderColor: '#637381' }} />
        <TouchableOpacity onPress={() => setModalDelete(true)}>
          <Text className="text-[#212B36]">Xóa tài khoản</Text>
          <Text className="text-[#637381] mt-2">Xóa vĩnh viễn dữ liệu khỏi hệ thống</Text>
        </TouchableOpacity>
      </View>
      <ModalRemoveAccount onClose={() => setModalDelete(false)} visible={modalDelete} />
    </View>
  )
}
