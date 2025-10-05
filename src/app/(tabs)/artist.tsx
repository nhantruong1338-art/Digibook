import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import HeaderHome from '@/components/home/HeaderHome'
import TitleHome from '@/components/home/TitleHome'
import ItemArtist from '@/components/ItemArtist'
import ItemArtistVertical from '@/components/ItemArtistVertical'
import { useHome } from '@/hooks/useHome'
import { useArtist } from '@/hooks/useArtist'

export default function LearnScreen() {
  const { popularArtistsQuery } = useHome()
  const { getArtistsList } = useArtist()
  const [currentPage, setCurrentPage] = useState(1)

  // Get artists list with pagination
  const artistsListQuery = getArtistsList({
    pageNumber: currentPage,
    pageSize: 10,
    sort: 'id,-createdAt',
  })

  const handleLoadMore = () => {
    if (artistsListQuery.data?.meta && currentPage < artistsListQuery.data.meta.totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  return (
    <View className="bg-[#FFFFFFD9] flex-1">
      <HeaderHome />
      <ScrollView className="mx-4 mt-8 flex-1" showsVerticalScrollIndicator={false}>
        {popularArtistsQuery?.data?.data && popularArtistsQuery?.data?.data?.length > 0 && (
          <>
            <TitleHome text="Nghệ sĩ phổ biến" />
            <FlatList
              className="flex-1 gap-2 mt-4 mb-8"
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{ gap: 20 }}
              data={popularArtistsQuery.data.data}
              keyExtractor={(item) => item?.id?.toString()}
              renderItem={({ item }) => <ItemArtist data={item} />}
            />
          </>
        )}

        <TitleHome text="Nhiều hơn" />
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
                <Text className="text-[#212B36]">
                  {artistsListQuery.isFetching ? 'Đang tải...' : 'Xem thêm'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View className="items-center justify-center py-8">
            <Text className="text-white">Không có nghệ sĩ nào</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
