import { FlatList, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { images } from '@/constants'
import HeaderBackComponent from '@/components/HeaderBackComponent'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import CustomBottomSheet from '@/components/BottomSheetDemo'
import { useLibrary } from '@/hooks/useLibrary'
import { useBook } from '@/hooks/useBook'
import BlurHeaderBackground from '@/components/BackGroundBlur'
import { ArchiveTick, ArrowRight2, Edit, Eye, Heart, More, Star1, User } from 'iconsax-react-native'
import SeeMoreCard from '@/components/SeeMoreCard'
import { ERouteTable } from '@/constants/route-table'
import TitleHome from '@/components/home/TitleHome'
import StarRating from '@/components/StarComponent'
import { useArtist } from '@/hooks/useArtist'
import ItemLarge from '@/components/home/ItemLarge'
import ModalReview from '@/modal/ModalReview'

export default function BookDetail() {
  const router = useRouter()

  const { bookId } = useLocalSearchParams<{ bookId: string }>()
  const { getBookDetail, getReviewBookDetail, submitReviewMutation } = useLibrary()
  const { getListBookArtist } = useArtist()
  const { likeBookMutation, unlikeBookMutation } = useBook()

  const [isVisible, setIsVisible] = useState(false)
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false)

  const bookDetailQuery = getBookDetail(bookId)
  const reviewBookQuery = getReviewBookDetail(bookId)
  const listBookQuery = getListBookArtist(bookDetailQuery?.data?.data?.artist_id || '')

  const renderLeftHeader = () => {
    return (
      <View className="flex-row gap-2 items-center">
        <TouchableOpacity
          className="bg-[#919EAB] h-[48px] w-[48px] rounded-full items-center justify-center"
          onPress={() => setIsVisible(true)}
        >
          <More size="24" color="#212B36" />
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    if (bookId) {
      bookDetailQuery.refetch()
    }
  }, [bookId])

  const handleLikeToggle = () => {
    if (!bookId) return

    const isLiked = bookDetailQuery?.data?.data?.liked

    if (isLiked) {
      // If currently liked, unlike the book
      unlikeBookMutation.mutate(bookId)
    } else {
      // If not liked, like the book
      likeBookMutation.mutate(bookId)
    }
  }

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!bookId) return

    submitReviewMutation.mutate(
      {
        bookId,
        rating,
        comment,
      },
      {
        onSuccess: () => {
          setIsReviewModalVisible(false)
        },
      },
    )
  }

  return (
    <BlurHeaderBackground
      backgroundImage={
        bookDetailQuery?.data?.data?.book_cover_url
          ? { uri: bookDetailQuery?.data?.data?.book_cover_url }
          : images.song
      }
    >
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderBackComponent leftChildren={renderLeftHeader()} />

      <ScrollView className="mb-10" showsVerticalScrollIndicator={false}>
        <View className="items-center mt-4">
          <Image
            source={
              bookDetailQuery?.data?.data?.book_cover_url
                ? { uri: bookDetailQuery?.data?.data?.book_cover_url }
                : images.song
            }
            className="w-48 h-72 rounded-2xl mb-8"
            resizeMode="cover"
          />
          <Text className="font-semibold text-xl text-center text-[#212B36]">
            {bookDetailQuery?.data?.data?.book_title}
          </Text>
          <View className="flex-row gap-4 mt-2">
            <View className="flex-row gap-1 items-center">
              <Text className="text-[#919EAB] text-sm">
                Tác giả:{' '}
                <Text className="text-[#212B36] ml-1">
                  {bookDetailQuery?.data?.data?.artist_name}
                </Text>
              </Text>
            </View>
          </View>
          <View className="flex-row gap-4 mt-2">
            <View className="flex-row gap-1 items-center">
              <Star1 size="14" color="#FF9800" variant="Bold" />
              <Text className="text-[#919EAB] text-sm">
                {reviewBookQuery?.data?.data?.averageRating}
              </Text>
            </View>
            <View className="flex-row gap-1 items-center">
              <Eye size="14" color="#637381" />
              <Text className="text-[#919EAB] text-sm">
                {bookDetailQuery?.data?.data?.playCount} Lượt đọc
              </Text>
            </View>
            <View className="flex-row gap-1 items-center">
              <ArchiveTick size="14" color="#637381" />
              <Text className="text-[#919EAB] text-sm">
                {bookDetailQuery?.data?.data?.likeCount} Lượt lưu
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-4 mt-2">
            <TouchableOpacity onPress={handleLikeToggle}>
              <Heart
                variant="Bold"
                size={24}
                color={bookDetailQuery?.data?.data?.liked ? '#EC38BC' : '#212B36'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: ERouteTable.READING_BOOK,
                  params: { bookId: bookId },
                })
              }
              className="bg-[#FF9315] px-4 py-2 rounded-xl"
            >
              <Text className="text-white font-semibold">Đọc sách</Text>
            </TouchableOpacity>
          </View>
          <SeeMoreCard description={bookDetailQuery?.data?.data?.summary} />
        </View>
        <View className="mt-4">
          <TitleHome
            text="Độc giả đánh giá"
            leftActive={
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: ERouteTable.LIST_COMMENT,
                    params: { bookId: bookId },
                  })
                }
              >
                <Text>Xem thêm</Text>
              </TouchableOpacity>
            }
          />
          <View className="flex-row mt-4 justify-between">
            <View>
              <View className="flex-row items-center gap-1">
                <Text className="text-lg font-semibold">
                  {reviewBookQuery?.data?.data?.averageRating}/5
                </Text>
                <StarRating size={16} rating={reviewBookQuery?.data?.data?.averageRating} />
              </View>
              <View>
                <Text className="text-[#637381]">
                  {reviewBookQuery?.data?.data?.reviews?.length} Đánh giá
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() => setIsReviewModalVisible(true)}
            >
              <Edit size="18" color="#212B36" />
              <Text className="font-semibold text-xs">Đánh giá</Text>
            </TouchableOpacity>
          </View>
          {reviewBookQuery?.data?.data?.reviews &&
          reviewBookQuery?.data?.data?.reviews?.length > 0 ? (
            <FlatList
              className="gap-2 mt-4 mb-8"
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{ gap: 20 }}
              data={reviewBookQuery?.data?.data?.reviews}
              keyExtractor={(item) => `${item?.id?.toString()}Những bản nhạc mới`}
              renderItem={({ item, index }) => (
                <View className="w-[320px] bg-[#919EAB14] p-4 rounded-xl">
                  <View className="flex-row justify-between">
                    <View className="flex-row items-center gap-2">
                      <Image
                        source={
                          item?.createdBy?.avatarUrl
                            ? { uri: item?.createdBy?.avatarUrl }
                            : images.avatar
                        }
                        className="h-[36px] w-[36px] rounded-full"
                      />
                      <View>
                        <Text>{item?.createdBy?.fullName || 'Ẩn danh'}</Text>
                        <StarRating rating={item?.rating || 0} size={12} />
                      </View>
                    </View>
                    <Text className="text-[#637381] text-sm">
                      {new Intl.DateTimeFormat('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                      }).format(new Date(item?.createdAt))}
                    </Text>
                  </View>
                  <Text className="mt-3" numberOfLines={3}>
                    {item?.comment}
                  </Text>
                </View>
              )}
            />
          ) : (
            <View className="items-center justify-center py-8">
              <Text className="text-[#212B36]">Chưa có đánh giá nào</Text>
            </View>
          )}

          <TitleHome text="Cùng tác giả" color="#FF9800" />
          {listBookQuery?.data?.data &&
          listBookQuery?.data?.data?.length > 0 &&
          listBookQuery?.data?.data?.filter((it: any) => it.id !== Number(bookId))?.length > 0 ? (
            <>
              <FlatList
                className="flex-1 gap-2 mt-4 mb-8"
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{ gap: 20 }}
                data={listBookQuery?.data?.data?.filter((it: any) => it.id !== Number(bookId))}
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
        </View>
      </ScrollView>
      <CustomBottomSheet isVisible={isVisible} onClose={() => setIsVisible(false)} maxHeight="70%">
        <View className="flex-1 mt-6 px-2">
          <View className="flex-row items-center gap-4 border-b border-dashed pb-4 mb-8 border-b-[#919EAB3D]">
            <Image
              source={
                bookDetailQuery?.data?.data?.book_cover_url
                  ? { uri: bookDetailQuery?.data?.data?.book_cover_url }
                  : images.defaultSong
              }
              className="w-[56px] h-[84px] rounded-2xl"
              resizeMode="cover"
            />
            <View>
              <Text className="font-semibold text-xl text-[#212B36]">
                {bookDetailQuery?.data?.data?.book_title}
              </Text>
              <Text className="text-[#919EAB] text-sm">
                {bookDetailQuery?.data?.data?.artist_name}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleLikeToggle}>
            <View className="flex-row items-center gap-4 py-4">
              <Heart
                variant="Bold"
                size={24}
                color={bookDetailQuery?.data?.data?.liked ? '#EC38BC' : '#212B36'}
              />
              <Text
                className={`text-lg ${bookDetailQuery?.data?.data?.liked ? 'text-[#EC38BC]' : 'text-[#212B36]'}`}
              >
                {!bookDetailQuery?.data?.data?.liked ? 'Yêu thích' : 'Huỷ yêu thích'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: ERouteTable.ARTIST_DETAIL,
                params: { artistId: bookDetailQuery?.data?.data?.artist_id },
              })
            }}
          >
            <View className="flex-row justify-between items-center py-4">
              <View className="flex-row items-center gap-4">
                <User size="24" color="#212B36" />
                <Text className={`text-lg text-[#212B36]`}>Xem tác giả</Text>
              </View>
              <ArrowRight2 size="24" color="#212B36" />
            </View>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>

      {/* Review Modal */}
      <ModalReview
        visible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        onSubmit={handleSubmitReview}
        isLoading={submitReviewMutation.isPending}
      />
    </BlurHeaderBackground>
  )
}
