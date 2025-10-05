import {
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'expo-router'
import { useArtist } from '@/hooks/useArtist'
import ItemArtistVertical from '@/components/ItemArtistVertical'

export default function AddArtist() {
  const router = useRouter()
  const { getArtistsList } = useArtist()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  // Debounce search text to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText)
      setCurrentPage(1) // Reset to first page when searching
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchText])

  const artistsListQuery = getArtistsList({
    pageNumber: currentPage,
    pageSize: 10,
    sort: 'id,-createdAt',
    search: debouncedSearchText.trim() || undefined, // Only send search if not empty
    searchFields: ['name'],
  })

  const handleLoadMore = () => {
    if (artistsListQuery.data?.meta && currentPage < artistsListQuery.data.meta.totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handleSearchChange = (text: string) => {
    setSearchText(text)
  }

  return (
    <View className="mx-4 mt-16 flex-1">
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <View className="flex-row justify-between items-center mb-6">
        <TextInput
          placeholderTextColor="#637381"
          placeholder="Tìm kiếm nghệ sĩ..."
          autoCapitalize="none"
          value={searchText}
          onChangeText={handleSearchChange}
          className="border border-[#919EAB52] w-[80%] text-[#637381] rounded-full px-4 py-3 text-base"
        />
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-12 w-12 bg-[#919EAB14] rounded-full items-center justify-center"
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView showsHorizontalScrollIndicator={false} className="flex-1">
        {artistsListQuery.isLoading ? (
          <View className="items-center justify-center py-8">
            <Text className="text-white">Đang tải...</Text>
          </View>
        ) : artistsListQuery.error ? (
          <View className="items-center justify-center py-8">
            <Text className="text-red-500">Có lỗi xảy ra khi tải dữ liệu</Text>
          </View>
        ) : artistsListQuery.data?.data && artistsListQuery.data.data.length > 0 ? (
          <>
            <FlatList
              className="flex-1 gap-2 mt-4 mb-8"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 20 }}
              data={artistsListQuery.data.data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ItemArtistVertical data={item} />}
            />
            {artistsListQuery.data.meta && currentPage < artistsListQuery.data.meta.totalPages && (
              <TouchableOpacity
                className="bg-[#919EAB14] w-[80px] h-[32px] rounded-xl items-center justify-center self-center mb-4"
                onPress={handleLoadMore}
                disabled={artistsListQuery.isFetching}
              >
                <Text className="text-white">
                  {artistsListQuery.isFetching ? 'Đang tải...' : 'Xem thêm'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View className="items-center justify-center py-8">
            <Text className="text-white">
              {debouncedSearchText ? 'Không tìm thấy nghệ sĩ phù hợp' : 'Không có nghệ sĩ nào'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
