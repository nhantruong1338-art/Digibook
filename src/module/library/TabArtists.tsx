import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { ERouteTable } from '@/constants/route-table'
import ItemLibrary from '@/components/ItemLibrary'
import { Add } from 'iconsax-react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useLibrary } from '@/hooks/useLibrary'
import { useBook } from '@/hooks/useBook'
import ItemLarge from '@/components/home/ItemLarge'

export default function TabArtists() {
  const router = useRouter()
  const { getLikedBooks } = useBook()
  const likedBooksQuery = getLikedBooks()

  if (likedBooksQuery.isLoading) {
    return <Text>Đang tải...</Text>
  }

  if (likedBooksQuery.isError) {
    return <Text>Lỗi: {likedBooksQuery.error.message}</Text>
  }

  return (
    <View>
      {likedBooksQuery?.data?.data && likedBooksQuery?.data?.data?.length > 0 ? (
        <FlatList
          className="gap-2 mt-4 mb-8"
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ gap: 20 }}
          data={likedBooksQuery?.data?.data}
          keyExtractor={(item) => `${item?.id?.toString()}Những bản nhạc mới`}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: ERouteTable.BOOK_DETAIL,
                  params: { bookId: item.id },
                })
              }}
            >
              <ItemLarge data={item} />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View className="mt-10">
          <Text className="text-[#919EAB] font-semibold text-lg text-center">Sách yêu thích trống</Text>
          <Text className="text-[#919EAB] text-center">
            Có vẻ như bạn chưa có sách yêu thích nào.
          </Text>
        </View>
      )}
    </View>
  )
}
