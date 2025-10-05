import { FlatList, Image, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useLibrary } from '@/hooks/useLibrary'
import React, { useState } from 'react'
import HeaderBackComponent from '@/components/HeaderBackComponent'
import ModalReview from '@/modal/ModalReview'
import StarRating from '@/components/StarComponent'
import { Edit } from 'iconsax-react-native'
import { images } from '@/constants'

export default function ListComment() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>()
  const { getReviewBookDetail, submitReviewMutation } = useLibrary()
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false)

  const reviewBookQuery = getReviewBookDetail(bookId)

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
    <View className="mt-16 px-4">
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderBackComponent title="Đánh giá & Nhận xét" />
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
      {reviewBookQuery?.data?.data?.reviews && reviewBookQuery?.data?.data?.reviews?.length > 0 ? (
        <FlatList
          className="gap-2 mt-4 mb-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20 }}
          data={reviewBookQuery?.data?.data?.reviews}
          keyExtractor={(item) => `${item?.id?.toString()}Những bản nhạc mới`}
          renderItem={({ item, index }) => (
            <View className="w-full bg-[#919EAB14] p-4 rounded-xl">
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
      <ModalReview
        visible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        onSubmit={handleSubmitReview}
        isLoading={submitReviewMutation.isPending}
      />
    </View>
  )
}
