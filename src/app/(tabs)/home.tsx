import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import HeaderHome from 'src/components/home/HeaderHome'
import TitleHome from '@/components/home/TitleHome'
import IconThreePoint from '~/assets/icon-svg/home/IconThreePoint'
import ItemLarge from '@/components/home/ItemLarge'
import React from 'react'
import ItemMini from '@/components/home/ItemMini'
import { useRouter } from 'expo-router'
import ItemArtist from '@/components/ItemArtist'
import { ERouteTable } from '@/constants/route-table'
import { useOverView } from '@/hooks/useHome'
import { images } from '@/constants'

export default function HomeScreen() {
  const router = useRouter()
  const { overviewQuery } = useOverView()

  // Loading state
  const isLoading = overviewQuery?.isLoading
  const hasError = overviewQuery?.isError

  // Loading component for sections
  const SectionLoading = () => (
    <View className="bg-[#212B36] p-4 mt-4 rounded-[32px] gap-4 mb-10">
      <View className="flex-row gap-4 items-center">
        <View className="w-14 h-14 bg-[#374151] rounded-2xl animate-pulse" />
        <View className="flex-1">
          <View className="h-4 bg-[#374151] rounded w-32 mb-2 animate-pulse" />
          <View className="h-3 bg-[#374151] rounded w-24 animate-pulse" />
        </View>
      </View>
      <View className="flex-row gap-4 items-center">
        <View className="w-14 h-14 bg-[#374151] rounded-2xl animate-pulse" />
        <View className="flex-1">
          <View className="h-4 bg-[#374151] rounded w-28 mb-2 animate-pulse" />
          <View className="h-3 bg-[#374151] rounded w-20 animate-pulse" />
        </View>
      </View>
      <View className="flex-row gap-4 items-center">
        <View className="w-14 h-14 bg-[#374151] rounded-2xl animate-pulse" />
        <View className="flex-1">
          <View className="h-4 bg-[#374151] rounded w-30 mb-2 animate-pulse" />
          <View className="h-3 bg-[#374151] rounded w-22 animate-pulse" />
        </View>
      </View>
    </View>
  )

  // Loading component for horizontal lists
  const HorizontalListLoading = () => (
    <View className="flex-row gap-5 mt-4 mb-8">
      {[1, 2, 3].map((item) => (
        <View key={item} className="w-32">
          <View className="w-32 h-32 bg-[#374151] rounded-2xl animate-pulse mb-2" />
          <View className="h-4 bg-[#374151] rounded w-24 mb-1 animate-pulse" />
          <View className="h-3 bg-[#374151] rounded w-20 animate-pulse" />
        </View>
      ))}
    </View>
  )

  // Loading component for artists
  const ArtistListLoading = () => (
    <View className="flex-row gap-5 mt-4 mb-8">
      {[1, 2, 3].map((item) => (
        <View key={item} className="items-center">
          <View className="w-20 h-20 bg-[#374151] rounded-full animate-pulse mb-2" />
          <View className="h-3 bg-[#374151] rounded w-16 animate-pulse" />
        </View>
      ))}
    </View>
  )

  // Error state
  if (hasError) {
    return (
      <View className="flex-1">
        <HeaderHome />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-white text-lg mb-4">Đã xảy ra lỗi</Text>
          <Text className="text-[#919EAB] text-center mb-6">Không thể tải dữ liệu từ server</Text>
          <TouchableOpacity
            className="bg-[#B1FF4D] px-6 py-3 rounded-full"
            onPress={() => overviewQuery.refetch()}
          >
            <Text className="text-black font-medium">Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-[#FFFFFFD9]">
      <HeaderHome />
      <ScrollView className="mx-4 mt-8 flex-1" showsVerticalScrollIndicator={false}>
        {/* Recent Tracks Section */}
        {isLoading ? (
          <>
            <TitleHome text="Tiếp tục đọc" />
            <SectionLoading />
          </>
        ) : (
          overviewQuery?.data?.data?.recentBooks &&
          overviewQuery?.data?.data?.recentBooks?.length > 0 && (
            <>
              <TitleHome text="Tiếp tục đọc" />
              <FlatList
                className="flex-1 gap-2 mt-4 mb-8"
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{ gap: 20 }}
                data={overviewQuery?.data?.data?.recentBooks}
                keyExtractor={(item) => `${item?.id?.toString()}recentBooks b`}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: ERouteTable.BOOK_DETAIL,
                        params: { bookId: item.id },
                      })
                    }}
                    className="w-[320px] h-[234px] bg-[#F4F6F8] rounded-xl gap-2 p-6 flex-row items-center"
                  >
                    <Image
                      source={item?.coverUrl ? { uri: item.coverUrl } : images.song}
                      className="w-[124px] h-[186px]"
                    />
                    <View>
                      <Text className="font-semibold">{item.title}</Text>
                      <Text className="text-[#637381]">{item?.artist?.name}</Text>
                      <Text className="text-[#637381] mt-3 mb-2">
                        <Text className="text-[#919EAB]">Đã đọc</Text> {item?.progress?.percent}%
                      </Text>
                      <View className="h-[4px] w-full rounded-full bg-[#919EAB14]">
                        <View
                          className="h-[4px] bg-[#21C45D] rounded-full"
                          style={{ width: `${item?.progress?.percent}%` }}
                        ></View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </>
          )
        )}

        {/* Popular Artists Section */}
        {isLoading ? (
          <>
            <TitleHome text="Tác giả nổi bật" color="#FF9800" />
            <ArtistListLoading />
          </>
        ) : (
          overviewQuery?.data?.data?.popularArtists &&
          overviewQuery?.data?.data?.popularArtists?.length > 0 && (
            <>
              <TitleHome text="Tác giả nổi bật" color="#FF9800" />
              <FlatList
                className="flex-1 gap-2 mt-4 mb-8"
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{ gap: 20 }}
                data={overviewQuery?.data?.data?.popularArtists}
                keyExtractor={(item) => `${item?.id?.toString()}hổ b`}
                renderItem={({ item, index }) => <ItemArtist data={item} />}
              />
            </>
          )
        )}

        {/* New Playlists Section */}
        {isLoading ? (
          <>
            <TitleHome text="Sách mới" color="#00BCD4" />
            <HorizontalListLoading />
          </>
        ) : (
          overviewQuery?.data?.data?.newestBooks &&
          overviewQuery?.data?.data?.newestBooks?.length > 0 && (
            <>
              <TitleHome text="Sách mới" color="#00BCD4" />
              <FlatList
                className="flex-1 gap-2 mt-4 mb-8"
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{ gap: 20 }}
                data={overviewQuery?.data?.data?.newestBooks}
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
            </>
          )
        )}

        {/* New Playlists Section */}
        {isLoading ? (
          <>
            <TitleHome text="Sách của tác giả bạn yêu thích" color="#00BCD4" />
            <HorizontalListLoading />
          </>
        ) : (
          overviewQuery?.data?.data?.booksFromFavoriteArtists &&
          overviewQuery?.data?.data?.booksFromFavoriteArtists?.length > 0 && (
            <>
              <TitleHome text="Sách của tác giả bạn yêu thích" color="#00BCD4" />
              <FlatList
                className="flex-1 gap-2 mt-4 mb-8"
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{ gap: 20 }}
                data={overviewQuery?.data?.data?.booksFromFavoriteArtists}
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
            </>
          )
        )}
      </ScrollView>
    </View>
  )
}
