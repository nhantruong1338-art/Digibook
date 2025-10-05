import { Image, Text, TouchableOpacity, View } from 'react-native'
import { images } from '@/constants'
import IconSetting from '~/assets/icon-svg/IconSetting'
import { ERouteTable } from '@/constants/route-table'
import { router, useRouter } from 'expo-router'
import IconSearchHome from '~/assets/icon-svg/home/IconSearchHome'
import ModalUser from '@/modal/ModalUser'
import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

export default function HeaderHome() {
  const router = useRouter()
  const [modalUser, setModalUser] = useState(false)
  const { user } = useAuthStore()

  return (
    <View className="">
      <View className="mt-20 mx-4">
        <View className="flex-row justify-between w-full">
          <Image
            source={images.logoApp}
            className="w-[37px] h-[40px]"
            resizeMode="cover"
          />
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={() => router.push(ERouteTable.SEARCH_SCREEN)}>
              <IconSearchHome />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalUser(true)}>
              <Image
                source={
                  user?.data?.avatarUrl
                    ? {
                        uri: user?.data?.avatarUrl,
                      }
                    : images.avatar
                }
                className="w-[46px] h-[46px] rounded-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ModalUser visible={modalUser} onClose={() => setModalUser(false)} />
    </View>
  )
}
