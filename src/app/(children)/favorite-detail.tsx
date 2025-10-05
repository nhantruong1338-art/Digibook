import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { images } from '@/constants'
import HeaderBackComponent from '@/components/HeaderBackComponent'
import IconAdd from '~/assets/icon-svg/IconAdd'
import React from 'react'
import IconSong from '~/assets/icon-svg/IconSong'
import ItemLibrary from '@/components/ItemLibrary'
import IconDownLOAD from '~/assets/icon-svg/IconDownLOAD'
import IconPlayMusic from '~/assets/icon-svg/IconPlayMusic'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { useLibrary } from '@/hooks/useLibrary'
import { useToast } from '@/components/ToastNotify/ToastContext'

export default function FavoriteDetail() {
  const router = useRouter()
  const { getUserPlaylistsFavorite } = useLibrary()
  const { showToast } = useToast()

  const favoriteDetail = getUserPlaylistsFavorite()

  const renderLeftHeader = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: ERouteTable.ADD_SONG,
            params: { playlistId: favoriteDetail?.data?.data?.id },
          })
        }}
      >
        <IconAdd />
      </TouchableOpacity>
    )
  }

  return (
    <ImageBackground source={images.bgFavorite} resizeMode="cover" className="h-full px-4 pt-16">
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderBackComponent leftChildren={renderLeftHeader()} />
      <View className="items-center mt-4">
        <Image
          source={images.favoriteAlbumBig}
          className="w-48 h-48 rounded-2xl mb-8 border border-[#FFFFFF29]"
          resizeMode="cover"
        />
        <Text className="font-semibold text-xl text-white">Bài hát yêu thích</Text>
        <View className="flex-row gap-1 items-center mt-2">
          <IconSong />
          <Text className="text-[#919EAB] text-sm">3 bài hát</Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => {
            showToast('Tính năng đang phát triển', 'error')
          }}
        >
          <IconDownLOAD />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (favoriteDetail?.data?.data?.tracks?.[0]?.id) {
              router.push({
                pathname: ERouteTable.PLAY_MUSIC,
                params: {
                  trackId: favoriteDetail?.data?.data?.tracks?.[0]?.id,
                  playlistId: favoriteDetail?.data?.data?.id,
                },
              })
            } else {
              showToast('Hiện chưa có bài hát để phát!', 'error')
            }
          }}
        >
          <IconPlayMusic />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View className="gap-3 mt-3 mb-8">
          {favoriteDetail?.data?.data?.tracks.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                router.push({
                  pathname: ERouteTable.PLAY_MUSIC,
                  params: { trackId: item.id, playlistId: favoriteDetail?.data?.data?.id },
                })
              }}
            >
              <ItemLibrary isEdit={true} imageUrl={item.coverUrl} title={item.title} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  )
}
