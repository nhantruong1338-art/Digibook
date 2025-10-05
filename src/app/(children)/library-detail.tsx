import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from 'react-native'
import { images } from '@/constants'
import HeaderBackComponent from '@/components/HeaderBackComponent'
import IconAdd from '~/assets/icon-svg/IconAdd'
import React, { useState, useCallback } from 'react'
import IconSong from '~/assets/icon-svg/IconSong'
import ItemLibrary from '@/components/ItemLibrary'
import IconDownLOAD from '~/assets/icon-svg/IconDownLOAD'
import IconPlayMusic from '~/assets/icon-svg/IconPlayMusic'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import IconThreePoint from '~/assets/icon-svg/home/IconThreePoint'
import CustomBottomSheet from '@/components/BottomSheetDemo'
import IconShareSong from '~/assets/icon-svg/bottom-sheet/IconShareSong'
import IconEditSong from '~/assets/icon-svg/bottom-sheet/IconEditSong'
import IconDelete from '~/assets/icon-svg/bottom-sheet/IconDelete'
import IconAddSong2 from '~/assets/icon-svg/bottom-sheet/IconAddSong2'
import ModalRequestRemove from '@/modal/ModalRequestRemove'
import { useLibrary } from '@/hooks/useLibrary'
import { useToast } from '@/components/ToastNotify/ToastContext'
import EditablePlaylistItem from '@/components/DraggablePlaylistItem'
import * as ImagePicker from 'expo-image-picker'
import { MaterialIcons } from '@expo/vector-icons'

export default function LibraryDetail() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [modalRemove, setModalRemove] = useState(false)
  const [editedTracks, setEditedTracks] = useState<any[]>([])
  const [playlistTitle, setPlaylistTitle] = useState('')
  const [playlistCover, setPlaylistCover] = useState<string | null>(null)
  const { playlistId } = useLocalSearchParams<{ playlistId: string }>()
  const { getPlaylistDetail, updatePlaylistMutation, bulkDeleteTracksMutation } = useLibrary()
  const playlistDetailQuery = getPlaylistDetail(playlistId)
  const { showToast } = useToast()

  // Initialize edit data when opening edit modal
  const handleOpenEdit = () => {
    setIsVisible(false)
    setEditedTracks(playlistDetailQuery?.data?.data?.tracks || [])
    setPlaylistTitle(playlistDetailQuery?.data?.data?.title || '')
    setPlaylistCover(playlistDetailQuery?.data?.data?.coverUrl || null)
    setIsVisibleEdit(true)
  }

  // Handle track removal
  const handleRemoveTrack = useCallback(
    async (index: number) => {
      const trackToRemove = editedTracks[index]
      if (!trackToRemove) return

      try {
        // Call bulk delete API with the track ID
        await bulkDeleteTracksMutation.mutateAsync({
          ids: [trackToRemove.id],
        })

        // Remove from local state after successful API call
        setEditedTracks((prev) => prev.filter((_, i) => i !== index))
      } catch (error) {
        console.error('Error removing track:', error)
      }
    },
    [editedTracks, bulkDeleteTracksMutation],
  )

  // Handle image picker
  const handlePickImage = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (permissionResult.granted === false) {
        showToast('Cần quyền truy cập thư viện ảnh!', 'error')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        setPlaylistCover(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      showToast('Có lỗi xảy ra khi chọn ảnh!', 'error')
    }
  }, [showToast])

  const handleSaveChanges = useCallback(async () => {
    if (!playlistId) return

    try {
      // Update playlist title and cover if changed
      const originalTitle = playlistDetailQuery?.data?.data?.title
      const originalCover = playlistDetailQuery?.data?.data?.coverUrl

      if (playlistTitle !== originalTitle || playlistCover !== originalCover) {
        const updateParams: any = {}

        if (playlistTitle !== originalTitle) {
          updateParams.title = playlistTitle
        }

        if (playlistCover !== originalCover) {
          updateParams.coverUrl = playlistCover
        }

        await updatePlaylistMutation.mutateAsync({
          playlistId: Number(playlistId),
          params: updateParams,
        })
      }

      setIsVisibleEdit(false)
    } catch (error) {
      console.error('Error saving playlist changes:', error)
    }
  }, [
    playlistTitle,
    playlistCover,
    playlistId,
    updatePlaylistMutation,
    playlistDetailQuery?.data?.data,
  ])

  const renderLeftHeader = () => {
    return (
      <View className="flex-row gap-2 items-center">
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: ERouteTable.ADD_SONG,
              params: { playlistId: playlistId },
            })
          }}
        >
          <IconAdd />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#919EAB3D] h-[48px] w-[48px] rounded-full items-center justify-center"
          onPress={() => setIsVisible(true)}
        >
          <IconThreePoint color="white" />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ImageBackground source={images.bgLibrary} resizeMode="cover" className="h-full px-4 pt-16">
      <HeaderBackComponent leftChildren={renderLeftHeader()} />
      <View className="items-center mt-4">
        <Image
          source={
            playlistDetailQuery?.data?.data?.coverUrl
              ? { uri: playlistDetailQuery?.data?.data?.coverUrl }
              : images.defaultSong
          }
          className="w-48 h-48 rounded-2xl mb-8"
          resizeMode="cover"
        />
        <Text className="font-semibold text-xl text-white">
          {playlistDetailQuery?.data?.data?.title}
        </Text>
        <View className="flex-row gap-4 mt-2">
          <View className="flex-row gap-1 items-center">
            <IconSong />
            <Text className="text-[#919EAB] text-sm">
              {playlistDetailQuery?.data?.data?.tracks?.length} bài hát
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
        <TouchableOpacity onPress={() => {
          if (playlistDetailQuery?.data?.data?.tracks?.[0]?.id) {
            router.push({
              pathname: ERouteTable.PLAY_MUSIC,
              params: { trackId: playlistDetailQuery?.data?.data?.tracks?.[0]?.id, playlistId: playlistId },
            })
          } else {
            showToast("Hiện chưa có bài hát để phát!", "error")
          }
        }}>
          <IconPlayMusic />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-3 mt-3 mb-8">
          {playlistDetailQuery?.data?.data?.tracks.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                router.push({
                  pathname: ERouteTable.PLAY_MUSIC,
                  params: { trackId: item.id, playlistId: playlistId },
                })
              }}
            >
              <ItemLibrary isArrow={true} title={item?.title} imageUrl={item?.coverUrl} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <CustomBottomSheet isVisible={isVisible} onClose={() => setIsVisible(false)} maxHeight="60%">
        <View className="border-b border-b-[#919EAB3D]">
          <View className="flex-row gap-4 items-center mx-6 mt-8 mb-4">
            <Image
              source={images.defaultSong}
              className="w-14 h-14 rounded-2xl"
              resizeMode="cover"
            />
            <View>
              <Text className="text-white">{playlistDetailQuery?.data?.data?.title}</Text>
              <Text className="text-[#919EAB]">
                {playlistDetailQuery?.data?.data?.tracks?.length} bài hát
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-10 px-6 mt-6">
          <TouchableOpacity className="flex-row gap-4 mb-6">
            <IconShareSong />
            <Text className="text-white text-lg">Chia sẻ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row gap-4 mb-6"
            onPress={() => {
              setIsVisible(false)
              router.push({
                pathname: ERouteTable.ADD_SONG,
                params: { playlistId: playlistId },
              })
            }}
          >
            <IconAddSong2 />
            <Text className="text-white text-lg">Thêm nhạc vào danh sách phát này</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row gap-4 mb-6" onPress={handleOpenEdit}>
            <IconEditSong />
            <Text className="text-white text-lg">Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row gap-4 mb-6"
            onPress={() => {
              setIsVisible(false)
              setModalRemove(true)
            }}
          >
            <IconDelete />
            <Text className="text-white text-lg">Xóa danh sách phát</Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>

      {/*// Bottom sheet edit playlist*/}
      <CustomBottomSheet
        isVisible={isVisibleEdit}
        onClose={() => setIsVisibleEdit(false)}
        maxHeight="90%"
      >
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row justify-between items-center mx-6 mt-8 mb-6">
            <Text className="text-white text-xl font-semibold">Chỉnh sửa</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity onPress={() => setIsVisibleEdit(false)}>
                <Text className="text-[#919EAB] text-lg">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveChanges}>
                <Text className="text-[#B1FF4D] text-lg font-semibold">Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Playlist Cover */}
          <View className="mx-6 mb-6">
            <Text className="text-white text-lg mb-3">Ảnh bìa</Text>
            <TouchableOpacity onPress={handlePickImage} className="self-center">
              <Image
                source={playlistCover ? { uri: playlistCover } : images.defaultSong}
                className="w-32 h-32 rounded-2xl"
                resizeMode="cover"
              />
              <View className="absolute bottom-2 right-2 bg-[#B1FF4D] rounded-full p-2">
                <MaterialIcons name="camera-alt" size={16} color="#000" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Playlist Title Input */}
          <View className="mx-6 mb-6">
            <Text className="text-white text-lg mb-3">Tên playlist</Text>
            <TextInput
              value={playlistTitle}
              onChangeText={setPlaylistTitle}
              className="bg-[#919EAB14] text-white px-4 py-3 rounded-xl text-base"
              placeholder="Nhập tên playlist..."
              placeholderTextColor="#919EAB"
            />
          </View>

          {/* Track Count */}
          <View className="mx-6 mb-4">
            <Text className="text-[#919EAB] text-sm">
              Danh sách phát của tôi • {editedTracks.length} bài hát
            </Text>
            <Text className="text-[#919EAB] text-xs mt-1">Nhấn X để xóa bài hát</Text>
          </View>

          {/* Editable Track List */}
          <ScrollView className="max-h-[300px]" showsVerticalScrollIndicator={false}>
            <View className="pb-8">
              {editedTracks.map((item, index) => (
                <EditablePlaylistItem
                  key={`${item.id}-${index}`}
                  item={item}
                  index={index}
                  onRemove={handleRemoveTrack}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </CustomBottomSheet>

      <ModalRequestRemove onClose={() => setModalRemove(false)} visible={modalRemove} />
    </ImageBackground>
  )
}
