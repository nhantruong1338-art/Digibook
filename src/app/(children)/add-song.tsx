import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ItemLibrary from '@/components/ItemLibrary'
import { ERouteTable } from '@/constants/route-table'
import { useHome } from '@/hooks/useHome'
import { useLibrary } from '@/hooks/useLibrary'
import { useDebounce } from '../../hooks/useDebounce'

const listCategoryMusic = [
  { title: 'Album', value: 'albums' },
  { title: 'Bài hát', value: 'tracks' },
  { title: 'Nghệ sĩ', value: 'artists' },
]

function getYearFromDate(dateString: any) {
  return new Date(dateString).getFullYear()
}

export default function AddSong() {
  const router = useRouter()
  const { searchQuery } = useHome()
  const { addTrackToPlaylistMutation } = useLibrary()
  const { playlistId } = useLocalSearchParams<{ playlistId: string }>()

  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState('tracks')
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearchText = useDebounce(searchText, 500)

  const searchResult = searchQuery({
    query: debouncedSearchText,
    pageSize: 10,
    pageNumber: currentPage,
  })

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleLoadMore = () => {
    if (searchResult.data?.data && activeTab === 'tracks') {
      const tracksMeta = searchResult.data.data.tracks?.meta
      if (tracksMeta && currentPage < tracksMeta.totalPages) {
        setCurrentPage((prev) => prev + 1)
      }
    } else if (searchResult.data?.data && activeTab === 'albums') {
      const albumsMeta = searchResult.data.data.albums?.meta
      if (albumsMeta && currentPage < albumsMeta.totalPages) {
        setCurrentPage((prev) => prev + 1)
      }
    } else if (searchResult.data?.data && activeTab === 'artists') {
      const artistsMeta = searchResult.data.data.artists?.meta
      if (artistsMeta && currentPage < artistsMeta.totalPages) {
        setCurrentPage((prev) => prev + 1)
      }
    }
  }

  const renderSearchResults = () => {
    if (searchResult.isLoading) {
      return (
        <View className="items-center justify-center py-8">
          <Text className="text-white text-lg">Đang tìm kiếm...</Text>
        </View>
      )
    }

    if (searchResult.error) {
      return (
        <View className="items-center justify-center py-8">
          <Text className="text-red-500 text-lg">Có lỗi xảy ra khi tìm kiếm</Text>
        </View>
      )
    }

    const data = searchResult.data?.data
    if (!data) {
      return (
        <View className="items-center justify-center py-8">
          <Text className="text-white text-lg">Không tìm thấy kết quả</Text>
        </View>
      )
    }

    const currentData = data[activeTab as keyof typeof data]
    if (!currentData?.data || currentData.data.length === 0) {
      return (
        <View className="items-center justify-center py-8">
          <Text className="text-white text-lg">
            Không tìm thấy{' '}
            {activeTab === 'tracks' ? 'bài hát' : activeTab === 'albums' ? 'album' : 'nghệ sĩ'} nào
          </Text>
        </View>
      )
    }

    const handleAddTrankToPlaylist = (idTrack: any, playlistId: any) => {
      if (!idTrack || !playlistId) {
        console.error('Missing trackId or playlistId')
        return
      }

      addTrackToPlaylistMutation.mutate({
        trackId: Number(idTrack),
        playlistId: Number(playlistId),
      })
    }

    return (
      <>
        <FlatList
          className="gap-2 mt-4 mb-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20 }}
          data={currentData.data}
          keyExtractor={(item) => `${item.id.toString()}-${activeTab}`}
          renderItem={({ item }) => {
            if (activeTab === 'tracks') {
              return (
                <TouchableOpacity>
                  <ItemLibrary
                    onAdd={() => handleAddTrankToPlaylist(item.id, playlistId)}
                    isAdd={true}
                    title={item.title}
                    imageUrl={item.coverUrl}
                    artist={formatDuration(item.duration)}
                  />
                </TouchableOpacity>
              )
            } else if (activeTab === 'albums') {
              return (
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: ERouteTable.ADD_SONG_ALBUM,
                      params: { albumId: item.id, playlistId: playlistId },
                    })
                  }}
                >
                  <ItemLibrary
                    isArrow={true}
                    title={item.title}
                    imageUrl={item.coverUrl}
                    artist={`Album • ${getYearFromDate(item.createdAt)}`}
                  />
                </TouchableOpacity>
              )
            } else if (activeTab === 'artists') {
              return (
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: ERouteTable.ADD_SONG_ARTIST,
                      params: { artistId: item.id, playlistId: playlistId },
                    })
                  }}
                >
                  <ItemLibrary
                    isArrow={true}
                    title={item.name}
                    imageUrl={item.avatarUrl}
                    artist={`${item.followersCount} người theo dõi`}
                  />
                </TouchableOpacity>
              )
            }
            return null
          }}
        />
        {currentData.meta && currentPage < currentData.meta.totalPages && (
          <TouchableOpacity
            className="bg-[#919EAB14] w-[80px] h-[32px] rounded-xl items-center justify-center self-center mb-4"
            onPress={handleLoadMore}
            disabled={searchResult.isFetching}
          >
            <Text className="text-white">
              {searchResult.isFetching ? 'Đang tải...' : 'Xem thêm'}
            </Text>
          </TouchableOpacity>
        )}
      </>
    )
  }

  return (
    <View className="mx-4 mt-16 flex-1">
      <View className="flex-row justify-between items-center mb-6">
        <TextInput
          placeholderTextColor="#637381"
          placeholder="Tìm kiếm..."
          autoCapitalize="none"
          value={searchText}
          onChangeText={setSearchText}
          className="border border-[#919EAB52] w-[80%] text-white rounded-full px-4 py-3 text-base"
        />
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-12 w-12 bg-[#919EAB14] rounded-full items-center justify-center"
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View className="flex-row flex-wrap gap-3 mb-6">
        {listCategoryMusic.map((item) => (
          <TouchableOpacity
            key={item.title}
            className={`py-2 px-4 rounded-xl ${
              activeTab === item.value ? 'bg-[#B1FF4D]' : 'bg-[#919EAB14]'
            }`}
            onPress={() => {
              setActiveTab(item.value)
              setCurrentPage(1)
            }}
          >
            <Text className={`${activeTab === item.value ? 'text-black' : 'text-white'}`}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView showsHorizontalScrollIndicator={false} className="flex-1">
        {renderSearchResults()}
      </ScrollView>
    </View>
  )
}
