import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { ERouteTable } from '@/constants/route-table'
import ItemLibrary from '@/components/ItemLibrary'
import React from 'react'
import { useLibrary } from '@/hooks/useLibrary'
import { useRouter } from 'expo-router'
import { useBook } from '@/hooks/useBook'
import ItemLarge from '@/components/home/ItemLarge'

export default function TabAlbum() {
  const router = useRouter()
  const { getReadingHistory } = useBook()
  const readingHistoryQuery = getReadingHistory()

  if (readingHistoryQuery.isLoading) {
    return <Text>Đang tải...</Text>
  }

  if (readingHistoryQuery.isError) {
    return <Text>Lỗi: {readingHistoryQuery.error.message}</Text>
  }

  return (
    <View>
      {readingHistoryQuery?.data?.data && readingHistoryQuery?.data?.data?.length > 0 ? (
        <FlatList
          className="gap-2 mt-4 mb-8"
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ gap: 20 }}
          data={readingHistoryQuery?.data?.data}
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
          <Text className="text-[#919EAB] font-semibold text-lg text-center">Thư viện trống!</Text>
          <Text className="text-[#919EAB] text-center">
            Có vẻ như bạn chưa đọc sách nào
          </Text>
        </View>
      )}
    </View>
  )
}
