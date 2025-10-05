import React, { useState } from 'react'
import { FlatList, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import HeaderComponent from '@/components/HeaderComponent'
import TabPLayList from '@/module/library/TabPLayList'
import TabAlbum from '@/module/library/TabAlbum'
import TabArtists from '@/module/library/TabArtists'

const listTab = [
  {
    name: 'Tiếp tục',
    key: 'playlist',
  },
  {
    name: 'Đã đọc',
    key: 'album',
  },
  {
    name: 'Yêu thích',
    key: 'artist',
  },
]

export default function PracticeScreen() {
  const [activeTab, setActiveTab] = React.useState<string>('playlist')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'playlist':
        return <TabPLayList />
      case 'album':
        return <TabAlbum />
      case 'artist':
        return <TabArtists />
      default:
        return null
    }
  }

  return (
    <View className="bg-[#FFFFFF] flex-1">
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderComponent title="Thư viện" />
      <View className="mx-4">
        <FlatList
          className="gap-2 mt-4 mb-4 h-[32px]"
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{ gap: 20 }}
          data={listTab}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveTab(item.key)}
              className={`p-2 h-[32px] w-max ${activeTab === item.key ? 'bg-[#FF9315]' : 'bg-[#919EAB14]'} rounded-xl`}
            >
              <Text className={`${activeTab === item.key ? 'text-white' : ''} font-semibold`}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View className="mx-4 flex-1">{renderTabContent()}</View>
    </View>
  )
}
