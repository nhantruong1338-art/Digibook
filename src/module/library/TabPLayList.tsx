import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ERouteTable } from '@/constants/route-table'
import { images } from '@/constants'
import ItemLibrary from '@/components/ItemLibrary'
import { Add } from 'iconsax-react-native'
import CustomBottomSheet from '@/components/BottomSheetDemo'
import IconAddToPlayList from '~/assets/icon-svg/song/IconAddToPlayList'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { useLibrary } from '@/hooks/useLibrary'
import { useBook } from '@/hooks/useBook'

export default function TabPLayList() {
  const router = useRouter()
  const { getContinueReading } = useBook()
  const continueReadingQuery = getContinueReading()

  if (continueReadingQuery.isLoading) {
    return <Text>Đang tải...</Text>
  }

  if (continueReadingQuery.isError) {
    return <Text>Lỗi: {continueReadingQuery.error.message}</Text>
  }

  return (
    <View className="bg-[#FFFFFF]">
      <ScrollView>
        <View className="gap-3 mt-3 mb-8">
          {continueReadingQuery?.data?.data && continueReadingQuery?.data?.data?.length > 0 ? (
            continueReadingQuery?.data?.data?.map((item: any) => (
              <View key={item.id}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: ERouteTable.BOOK_DETAIL,
                      params: { bookId: item.id },
                    })
                  }
                  className="w-full h-[108px] bg-[#F4F6F8] rounded-xl gap-2 p-3 flex-row items-center"
                >
                  <Image
                    source={item?.coverUrl ? { uri: item.coverUrl } : images.song}
                    className="w-[56px] h-[84px]"
                  />
                  <View className="w-[80%]">
                    <Text className="font-semibold">{item.title}</Text>
                    <Text className="text-[#637381]">{item?.artists?.[0]?.name}</Text>
                    <Text className="text-[#637381] mt-3 mb-2">
                      <Text className="text-[#919EAB]">Đã đọc</Text> {item?.progressPercent}%
                    </Text>
                    <View className="h-[4px] w-full rounded-full bg-[#919EAB14]">
                      <View
                        className="h-[4px] bg-[#21C45D] rounded-full"
                        style={{ width: `${item?.progressPercent}%` }}
                      ></View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View className="mt-10">
              <Text className="text-[#919EAB] font-semibold text-lg text-center">Thư viện trống!</Text>
              <Text className="text-[#919EAB] text-center">
                Có vẻ như bạn chưa đọc sách nào
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
