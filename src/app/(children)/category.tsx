import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import TitleHome from '@/components/home/TitleHome'
import ItemLarge from '@/components/home/ItemLarge'
import { useRouter } from 'expo-router'
import ItemLibrary from '@/components/ItemLibrary'
import HeaderBackComponent from '@/components/HeaderBackComponent'
import { ERouteTable } from '@/constants/route-table'

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

export default function Category() {
  const router = useRouter()

  return (
    <View className="mx-4 mt-16 flex-1">
      <ScrollView showsHorizontalScrollIndicator={false} className="flex-1">
        <HeaderBackComponent />
        <View className="mt-10">
          <TitleHome text="Thể loại nhạc" />
        </View>
        <View className="flex-row flex-wrap gap-3 mt-6 mb-6">
          {listCategoryMusic.map((it) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  params: {
                    label: it.title,
                  },
                  pathname: ERouteTable.CATEGORY_DETAIL,
                })
              }
              key={it.title}
              className="py-2 px-4 bg-[#919EAB14] rounded-xl"
            >
              <Text className="text-white">{it.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
