import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { images } from '@/constants'
import HeaderBackComponent from '@/components/HeaderBackComponent'
import React, { useState } from 'react'
import IconSong from '~/assets/icon-svg/IconSong'
import ItemLibrary from '@/components/ItemLibrary'
import IconDownLOAD from '~/assets/icon-svg/IconDownLOAD'
import IconPlayMusic from '~/assets/icon-svg/IconPlayMusic'
import { useLocalSearchParams, useRouter } from 'expo-router'
import IconShareSong from '~/assets/icon-svg/bottom-sheet/IconShareSong'
import { AntDesign } from '@expo/vector-icons'
import ModalRequestRemove from '@/modal/ModalRequestRemove'
import { useLibrary } from '@/hooks/useLibrary'
import { useToast } from '@/components/ToastNotify/ToastContext'
import { formatIsoToViDate } from '@/utils/datetime'
import { ERouteTable } from '@/constants/route-table'

function toMinutesSeconds(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}` // 90 -> "1:30"
}

export default function AlbumDetail() {
  const [modalRemove, setModalRemove] = useState(false)
  const { albumId } = useLocalSearchParams<{ albumId: string }>()
  const { getAlbumDetail } = useLibrary()
  const albumDetailQuery = getAlbumDetail(albumId)
  const { showToast } = useToast()
  const router = useRouter()

  return (
    <ImageBackground source={images.bgLibrary} resizeMode="cover" className="h-full px-4 pt-16">
      <HeaderBackComponent />
      <View className="items-center mt-4">
        <Image
          source={
            albumDetailQuery?.data?.data?.coverUrl
              ? { uri: albumDetailQuery?.data?.data?.coverUrl }
              : images.defaultSong
          }
          className="w-48 h-48 rounded-2xl mb-8"
          resizeMode="cover"
        />
        <Text className="font-semibold text-xl text-white text-center">
          {albumDetailQuery?.data?.data?.title}
        </Text>
        <View>
          <Text className="text-[#919EAB]">
            Album • {formatIsoToViDate(albumDetailQuery?.data?.data?.createdAt)}
          </Text>
          <View className="flex-row gap-2 mt-2 items-center justify-center">
            <Image
              source={
                albumDetailQuery?.data?.data?.artist?.avatarUrl
                  ? { uri: albumDetailQuery?.data?.data?.artist?.avatarUrl }
                  : images.defaultSong
              }
              className="w-5 h-5 rounded-full"
              resizeMode="cover"
            />
            <Text className="text-white font-semibold">
              {albumDetailQuery?.data?.data?.artist?.name}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-4 mt-2">
          <View className="flex-row gap-1 items-center">
            <IconSong />
            <Text className="text-[#919EAB] text-sm">
              {albumDetailQuery?.data?.data?.tracks?.length} bài hát
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <AntDesign name="hearto" size={14} color="#919EAB" />
            <Text className="text-[#919EAB]">{albumDetailQuery?.data?.data?.likeCount}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <AntDesign name="clockcircleo" size={14} color="#919EAB" />
            <Text className="text-[#919EAB]">
              {toMinutesSeconds(albumDetailQuery?.data?.data?.totalDuration)} phút
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={() => {
              showToast('Tính năng đang phát triển', 'error')
            }}
          >
            <IconDownLOAD />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              showToast('Tính năng đang phát triển', 'error')
            }}
          >
            <IconShareSong />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (albumDetailQuery?.data?.data?.tracks?.[0]?.id) {
              router.push({
                pathname: ERouteTable.PLAY_MUSIC,
                params: {
                  trackId: albumDetailQuery?.data?.data?.tracks?.[0]?.id,
                  albumId: albumId,
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-3 mt-3 mb-8">
          {albumDetailQuery?.data?.data?.tracks?.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                router.push({
                  pathname: ERouteTable.PLAY_MUSIC,
                  params: { trackId: item.id, albumId: albumId },
                })
              }}
            >
              <ItemLibrary
                title={item.title}
                imageUrl={item?.coverUrl}
                artist={albumDetailQuery?.data?.data?.artist?.name || 'Chưa có nghệ sĩ'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <ModalRequestRemove onClose={() => setModalRemove(false)} visible={modalRemove} />
    </ImageBackground>
  )
}
