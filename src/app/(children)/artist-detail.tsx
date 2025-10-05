import { FlatList, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { images } from '@/constants'
import HeaderBackComponent from '@/components/HeaderBackComponent'
import React, { useState } from 'react'
import IconTick from '~/assets/icon-svg/IconTick'
import TitleHome from '@/components/home/TitleHome'
import BlurHeaderBackground from '@/components/BackGroundBlur'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useArtist } from '@/hooks/useArtist'
import CustomBottomSheet from '@/components/BottomSheetDemo'
import ItemLarge from '@/components/home/ItemLarge'
import { Heart, More } from 'iconsax-react-native'
import { ERouteTable } from '@/constants/route-table'

export default function ArtistDetail() {
  const { artistId } = useLocalSearchParams<{ artistId: string }>()
  const { getArtistDetail, followArtistMutation, unfollowArtistMutation, getListBookArtist } =
    useArtist()
  const [isVisible, setIsVisible] = useState(false)
  const artistDetailQuery = getArtistDetail(artistId)
  const listBookQuery = getListBookArtist(artistId)
  const router = useRouter()


  const handleFollowToggle = () => {
    if (!artistId) return
    if (artistDetailQuery?.data?.data?.isFollowed) {
      unfollowArtistMutation.mutate(artistId)
    } else {
      followArtistMutation.mutate(artistId)
    }
  }

  const formatFollowersCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)} Tr`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)} K`
    }
    return count
  }

  const renderLeftHeader = () => {
    return (
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className="bg-[#919EAB] rounded-full h-12 w-12 items-center justify-center"
      >
        <More size="24" color="#212B36" />
      </TouchableOpacity>
    )
  }

  // Show full loading screen until data is loaded
  if (artistDetailQuery.isLoading) {
    return (
      <View className="bg-[#161c24] flex-1 items-center justify-center">
        <Text className="text-white text-lg">Đang tải thông tin nghệ sĩ...</Text>
      </View>
    )
  }

  // Show error screen if there's an error
  if (artistDetailQuery.error) {
    return (
      <View className="bg-[#161c24] flex-1 items-center justify-center">
        <Text className="text-red-500 text-lg mb-4">Có lỗi xảy ra khi tải dữ liệu</Text>
        <TouchableOpacity
          className="bg-[#919EAB14] px-4 py-2 rounded-xl"
          onPress={() => artistDetailQuery.refetch()}
        >
          <Text className="text-white">Thử lại</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Show not found screen if no data
  if (!artistDetailQuery?.data?.data) {
    return (
      <View className="bg-[#161c24] flex-1 items-center justify-center">
        <Text className="text-white text-lg">Không tìm thấy thông tin nghệ sĩ</Text>
      </View>
    )
  }

  return (
    <BlurHeaderBackground
      backgroundImage={
        artistDetailQuery?.data?.data.avatarUrl
          ? { uri: artistDetailQuery?.data?.data.avatarUrl }
          : images.song
      }
    >
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderBackComponent leftChildren={renderLeftHeader()} />
      <View className="mt-40">
        <Text className="font-semibold text-4xl text-[#212B36]">
          {artistDetailQuery?.data?.data.name}
        </Text>
        <View className="flex-row gap-1 items-center mt-2">
          <Text className="text-[#637381] text-sm">
            {formatFollowersCount(artistDetailQuery?.data?.data.followersCount)} người nghe hàng
            tháng
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center mt-2">
        <View className="flex-row gap-6 items-center">
          <View className="items-center">
            {artistDetailQuery?.data?.data.isFollowed ? (
              <TouchableOpacity
                className="flex-row gap-2 border border-[#EC38BC7A] p-2 rounded-2xl items-center"
                onPress={handleFollowToggle}
                disabled={followArtistMutation.isPending || unfollowArtistMutation.isPending}
              >
                <IconTick />
                <Text className="text-[#EC38BC]">Yêu thích</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="border border-[#919EAB52] p-2 rounded-2xl"
                onPress={handleFollowToggle}
                disabled={followArtistMutation.isPending || unfollowArtistMutation.isPending}
              >
                <Text className="text-[#212B36]">Yêu thích</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View className="mb-30 h-[70%]">
        {listBookQuery?.data?.data && (
          <ScrollView className="mt-6 mb-10" showsVerticalScrollIndicator={false}>
            <TitleHome text="Sách của tác giả" color="#FF9800" />
            {listBookQuery?.data?.data && listBookQuery?.data?.data?.length > 0 ? (
              <>
                <FlatList
                  className="flex-1 gap-2 mt-4 mb-8"
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  contentContainerStyle={{ gap: 20 }}
                  data={listBookQuery?.data?.data}
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
            ) : (
              <View className="items-center justify-center py-8">
                <Text className="text-[#212B36]">Chưa có tác phẩm nào</Text>
              </View>
            )}

            <View className="bg-[#F4F6F8] p-6 mt-6 rounded-xl">
              <View className="flex-row justify-between">
                <Image
                  source={
                    artistDetailQuery?.data?.data?.avatarUrl
                      ? { uri: artistDetailQuery?.data?.data.avatarUrl }
                      : images.song
                  }
                  className="w-16 h-16 rounded-full border border-[#FFFFFF29]"
                  resizeMode="cover"
                />
                <View className="items-center">
                  {artistDetailQuery?.data?.data.isFollowed ? (
                    <TouchableOpacity
                      className="flex-row gap-2 border border-[#EC38BC7A] p-2 rounded-2xl items-center"
                      onPress={handleFollowToggle}
                      disabled={followArtistMutation.isPending || unfollowArtistMutation.isPending}
                    >
                      <IconTick />
                      <Text className="text-[#EC38BC]">Yêu thích</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className="border border-[#919EAB52] p-2 rounded-2xl"
                      onPress={handleFollowToggle}
                      disabled={followArtistMutation.isPending || unfollowArtistMutation.isPending}
                    >
                      <Text className="text-[#212B36]">Yêu thích</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View className="mt-3">
                <Text className="text-2xl font-semibold text-[#212B36]">
                  {artistDetailQuery?.data?.data?.name}
                </Text>
                <View className="flex-row gap-1">
                  <Text className="text-[#212B36]">
                    {artistDetailQuery?.data?.data?.followersCount}
                  </Text>
                  <Text className="text-[#919EAB]">người yêu thích</Text>
                </View>
                <Text className="text-sm mt-2 font-semibold text-[#919EAB]">
                  {artistDetailQuery?.data?.data?.bio || 'Hệ thống chưa có mô tả cho nghệ sĩ này.'}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
      <CustomBottomSheet isVisible={isVisible} onClose={() => setIsVisible(false)} maxHeight="50%">
        <View className="mt-10 px-4">
          <View className="flex-row gap-4 items-center">
            <Image
              source={
                artistDetailQuery?.data?.data?.avatarUrl
                  ? { uri: artistDetailQuery?.data?.data.avatarUrl }
                  : images.song
              }
              className="w-14 h-14 rounded-xl border border-[#FFFFFF29]"
              resizeMode="cover"
            />
            <View>
              <Text className="text-[#212B36] font-semibold">
                {artistDetailQuery?.data?.data?.name}
              </Text>
              <Text className="text-[#919EAB] mt-1 text-sm">1,7 Tr người đọc hàng tháng</Text>
            </View>
          </View>
        </View>
        <View className="w-max border border-dashed my-4 border-[#919EAB3D]" />
        <View>
          <TouchableOpacity onPress={handleFollowToggle}>
            <View className="flex-row items-center gap-4 px-4 py-4">
              <Heart
                variant="Bold"
                size={24}
                color={artistDetailQuery?.data?.data.isFollowed ? '#EC38BC' : '#212B36'}
              />
              <Text
                className={`text-lg ${artistDetailQuery?.data?.data.isFollowed ? 'text-[#EC38BC]' : 'text-[#212B36]'}`}
              >
                {!artistDetailQuery?.data?.data.isFollowed ? 'Yêu thích' : 'Huỷ yêu thích'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>
    </BlurHeaderBackground>
  )
}
