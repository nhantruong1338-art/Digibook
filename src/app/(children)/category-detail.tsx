import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import TitleHome from '@/components/home/TitleHome'
import { useLocalSearchParams, useRouter } from 'expo-router'
import HeaderBackComponent from '@/components/HeaderBackComponent'
import IconShare from '~/assets/icon-svg/IconShare'
import ItemLarge from '@/components/home/ItemLarge'

const listCategoryMusic = [
  { title: 'Dance', value: 'dance' },
  { title: 'Hip-Hop', value: 'hip-hop' },
  { title: 'Pop', value: 'pop' },
  { title: 'Rock', value: 'rock' },
  { title: 'Jazz', value: 'jazz' },
  { title: 'Classical', value: 'classical' },
  { title: 'Electronic', value: 'electronic' },
  { title: 'R&B', value: 'rnb' },
  { title: 'Reggae', value: 'reggae' },
  { title: 'Country', value: 'country' },
  { title: 'Blues', value: 'blues' },
  { title: 'Indie', value: 'indie' },
  { title: 'Lo-fi', value: 'lofi' },
  { title: 'K-Pop', value: 'kpop' },
  { title: 'V-Pop', value: 'vpop' },
  { title: 'Instrumental', value: 'instrumental' },
  { title: 'Metal', value: 'metal' },
  { title: 'Folk', value: 'folk' },
  { title: 'House', value: 'house' },
  { title: 'Trance', value: 'trance' },
  { title: 'Chill', value: 'chill' },
  { title: 'Ambient', value: 'ambient' },
]

export default function CategoryDetail() {
  const params = useLocalSearchParams()
  const router = useRouter()

  return (
    <View className="mx-4 mt-16 flex-1">
      <ScrollView showsHorizontalScrollIndicator={false} className="flex-1">
        <HeaderBackComponent
          title="Thể loại"
          leftChildren={
            <TouchableOpacity className="h-12 w-12 rounded-full items-center bg-[#919EAB3D] justify-center">
              <IconShare />
            </TouchableOpacity>
          }
        />
        <Text className="mt-10 text-white font-bold text-4xl">{params.label}</Text>
        <View className="mt-10">
          <TitleHome text="Phổ biến" color="#B1FF4D" />
        </View>
        <FlatList
          className="flex-1 gap-2 mt-4 mb-8"
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ gap: 20 }}
          data={[0, 1, 2, 3]}
          renderItem={({ item, index }) => <ItemLarge />}
        />
        <TitleHome text="Danh sách phát mới" color="#B1FF4D" />
        <FlatList
          className="flex-1 gap-2 mt-4 mb-8"
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ gap: 20 }}
          data={[0, 1, 2, 3]}
          renderItem={({ item, index }) => <ItemLarge />}
        />
      </ScrollView>
    </View>
  )
}
