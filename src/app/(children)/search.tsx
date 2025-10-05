import {
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import TitleHome from '@/components/home/TitleHome'
import { useRouter } from 'expo-router'
import ItemLibrary from '@/components/ItemLibrary'
import { ERouteTable } from '@/constants/route-table'
import { useHome, useOverView } from '@/hooks/useHome'
import { useDebounce } from '@/hooks/useDebounce'
import ItemLarge from '@/components/home/ItemLarge'

const listCategoryBooks = [
  { title: 'Sách', value: 'books' },
  { title: 'Tác giả', value: 'artists' },
]

function getYearFromDate(dateString: any) {
  return new Date(dateString).getFullYear()
}

export default function SearchScreen() {
  const router = useRouter()
  const { searchQuery } = useHome()
  const { overviewQuery } = useOverView()

  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState('books')
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearchText = useDebounce(searchText, 500)

  const searchResult = searchQuery({
    query: debouncedSearchText,
    pageSize: 10,
    pageNumber: currentPage,
  })


  const handleLoadMore = () => {
    if (searchResult.data?.data && activeTab === 'books') {
      const booksMeta = searchResult.data.data.books?.meta
      if (booksMeta && currentPage < booksMeta.totalPages) {
        setCurrentPage((prev) => prev + 1)
      }
    } else if (searchResult.data?.data && activeTab === 'artists') {
      const artistsMeta = searchResult.data.data.artists?.meta
      if (artistsMeta && currentPage < artistsMeta.totalPages) {
        setCurrentPage((prev) => prev + 1)
      }
    }
  }

  const renderSearchResults = () => {
    if (searchResult.isLoading) {
      return (
        <View className="items-center justify-center py-8">
          <Text className="text-[#212B36] text-lg">Đang tìm kiếm...</Text>
        </View>
      )
    }

    if (searchResult.error) {
      return (
        <View className="items-center justify-center py-8">
          <Text className="text-red-500 text-lg">Có lỗi xảy ra khi tìm kiếm</Text>
        </View>
      )
    }

    const data = searchResult.data?.data
    if (!data) {
      return (
        <View className="items-center justify-center py-8">
          <Text className="text-[#212B36] text-lg">Không tìm thấy kết quả</Text>
        </View>
      )
    }

    const currentData = data[activeTab as keyof typeof data]
    if (!currentData?.data || currentData.data.length === 0) {
      return (
        <View className="items-center justify-center py-8">
          <Text className="text-[#212B36] text-lg">
            Không tìm thấy{' '}
            {activeTab === 'books' ? 'sách' : 'tác giả'} nào
          </Text>
        </View>
      )
    }

    console.log(currentData.data)

    return (
      <>
        <FlatList
          className="gap-2 mt-4 mb-8"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20 }}
          data={currentData.data}
          horizontal={activeTab !== 'artists'}
          keyExtractor={(item) => `${item.id.toString()}-${activeTab}`}
          renderItem={({ item }) => {
            if (activeTab === 'books') {
              return (
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
              )
            } else if (activeTab === 'artists') {
              return (
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: ERouteTable.ARTIST_DETAIL,
                      params: { artistId: item.id },
                    })
                  }}
                >
                  <ItemLibrary
                    isArrow={true}
                    title={item.name}
                    imageUrl={item.avatarUrl}
                    artist={`${item.followersCount} người theo dõi`}
                  />
                </TouchableOpacity>
              )
            }
            return null
          }}
        />
        {currentData.meta && currentPage < currentData.meta.totalPages && (
          <TouchableOpacity
            className="bg-[#919EAB14] w-[80px] h-[32px] rounded-xl items-center justify-center self-center mb-4"
            onPress={handleLoadMore}
            disabled={searchResult.isFetching}
          >
            <Text className="text-[#212B36]">
              {searchResult.isFetching ? 'Đang tải...' : 'Xem thêm'}
            </Text>
          </TouchableOpacity>
        )}
      </>
    )
  }

  console.log(overviewQuery?.data?.data?.popularArtists)

  const renderDefaultContent = () => {
    return (
      <>
        {overviewQuery?.data?.data?.recentBooks?.length > 0 && (
          <View>
            <TitleHome text="Sách gần đây" color="#EC38BC" />
            <FlatList
              className="gap-2 mt-4 mb-8"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 20 }}
              data={overviewQuery?.data?.data?.recentBooks || []}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: ERouteTable.BOOK_DETAIL,
                      params: { bookId: item.id },
                    })
                  }}
                >
                  <ItemLibrary
                    isArrow={true}
                    title={item.title}
                    imageUrl={item.coverUrl}
                    artist={item.artist?.name || 'Không xác định'}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <TitleHome text="Tác giả phổ biến" color="#B1FF4D" />
        <FlatList
          className="gap-2 mt-4 mb-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20 }}
          data={overviewQuery?.data?.data?.popularArtists || []}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: ERouteTable.ARTIST_DETAIL,
                  params: { artistId: item?.id },
                })
              }}
            >
              <ItemLibrary
                isArrow={true}
                title={item.name}
                imageUrl={item.avatarUrl}
                artist={`${item.playCount} người yêu thích`}
              />
            </TouchableOpacity>
          )}
        />
      </>
    )
  }

  return (
    <View className="mx-4 mt-16 flex-1">
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <View className="flex-row justify-between items-center mb-6">
        <TextInput
          placeholderTextColor="#637381"
          placeholder="Tìm kiếm sách, tác giả..."
          autoCapitalize="none"
          value={searchText}
          onChangeText={setSearchText}
          className="border border-[#919EAB52] bg-[#919EAB14] w-[80%] text-[#212B36] rounded-full px-4 py-3 text-base"
        />
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-12 w-12 bg-[#919EAB14] rounded-full items-center justify-center"
        >
          <Ionicons name="close" size={24} color="#212B36" />
        </TouchableOpacity>
      </View>

      {searchText ? (
        <>
          <View className="flex-row flex-wrap gap-3 mb-6">
            {listCategoryBooks.map((item) => (
              <TouchableOpacity
                key={item.title}
                className={`py-2 px-4 rounded-xl ${
                  activeTab === item.value ? 'bg-[#FF9315]' : 'bg-[#919EAB14]'
                }`}
                onPress={() => {
                  setActiveTab(item.value)
                  setCurrentPage(1)
                }}
              >
                <Text className={`${activeTab === item.value ? 'text-white' : 'text-[#212B36]'}`}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView showsHorizontalScrollIndicator={false} className="flex-1">
            {renderSearchResults()}
          </ScrollView>
        </>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {renderDefaultContent()}
        </ScrollView>
      )}
    </View>
  )
}
