import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  FlatList,
  Alert
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { images } from '@/constants'
import { useLibrary } from '@/hooks/useLibrary'
import { useBook } from '@/hooks/useBook'
import { ArrowLeft, Bookmark, More, Crown, Trash, Edit, CloseCircle } from 'iconsax-react-native'
import { RenderHTML } from 'react-native-render-html'
import { State } from 'react-native-gesture-handler'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function ReadingBook() {
  const router = useRouter()
  const { bookId } = useLocalSearchParams<{ bookId: string }>()

  const { getBookDetail } = useLibrary()
  const {
    getChaptersByBook,
    trackReadingMutation,
    createBookmarkMutation,
    bulkDeleteBookmarksMutation,
    getBookmarksByBook
  } = useBook()

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [isTableOfContentsVisible, setIsTableOfContentsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'table' | 'bookmarks'>('table')
  const [readingProgress, setReadingProgress] = useState(20)
  const [selectedBookmarkIds, setSelectedBookmarkIds] = useState<number[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const bookDetailQuery = getBookDetail(bookId)
  const chaptersQuery = getChaptersByBook(bookId)
  const bookmarksQuery = getBookmarksByBook(bookId)

  const bookData = bookDetailQuery?.data?.data
  const chapters = chaptersQuery?.data?.data || []
  const bookmarks = bookmarksQuery?.data?.data || []

  // Calculate reading progress based on current chapter
  useEffect(() => {
    if (chapters.length > 0) {
      const progress = ((currentChapterIndex + 1) / (chapters.length + 1)) * 100 // +1 for cover page
      setReadingProgress(Math.round(progress))
    }
  }, [currentChapterIndex, chapters.length])

  // Track reading progress when chapter changes
  useEffect(() => {
    if (currentChapterIndex > 0 && chapters[currentChapterIndex - 1]) {
      const currentChapter = chapters[currentChapterIndex - 1]
      trackReadingMutation.mutate({
        bookId: Number(bookId),
        chapterId: currentChapter.id
      })
    }
  }, [currentChapterIndex])

  const handleSwipeLeft = () => {
    if (currentChapterIndex < chapters.length) {
      setCurrentChapterIndex(currentChapterIndex + 1)
    }
  }

  const handleSwipeRight = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1)
    }
  }

  const onGestureEvent = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent

      // Check both translation and velocity for better swipe detection
      const swipeThreshold = 30
      const velocityThreshold = 0.5

      if (translationX > swipeThreshold || velocityX > velocityThreshold) {
        handleSwipeRight()
      } else if (translationX < -swipeThreshold || velocityX < -velocityThreshold) {
        handleSwipeLeft()
      }
    }
  }

  // Bookmark functions
  const handleCreateBookmark = () => {
    const currentChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null
    if (!currentChapter) {
      Alert.alert('Lỗi', 'Không thể tạo dấu trang ở trang bìa')
      return
    }

    // Auto-generate title based on chapter
    const autoTitle = `${currentChapter.title} - Dấu trang ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`

    createBookmarkMutation.mutate({
      title: '0',
      position: 0,
      content: '0',
      chapterId: currentChapter.id
    }, {
      onSuccess: () => {
        Alert.alert('Thành công', 'Đã tạo dấu trang thành công!')
      }
    })
  }

  const handleDeleteBookmarks = () => {
    if (selectedBookmarkIds.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn dấu trang để xóa')
      return
    }

    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa ${selectedBookmarkIds.length} dấu trang?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            bulkDeleteBookmarksMutation.mutate({
              ids: selectedBookmarkIds
            }, {
              onSuccess: () => {
                setSelectedBookmarkIds([])
                setIsSelectionMode(false)
              }
            })
          }
        }
      ]
    )
  }

  const toggleBookmarkSelection = (bookmarkId: number) => {
    setSelectedBookmarkIds(prev =>
      prev.includes(bookmarkId)
        ? prev.filter(id => id !== bookmarkId)
        : [...prev, bookmarkId]
    )
  }

  const handleBookmarkPress = (bookmark: any) => {
    // Find the chapter index for this bookmark
    const chapterIndex = chapters.findIndex((chapter: any) => chapter.id === bookmark.chapterId)
    if (chapterIndex !== -1) {
      setCurrentChapterIndex(chapterIndex + 1) // +1 because index 0 is cover page
      setIsTableOfContentsVisible(false)
    }
  }

  const renderBookCover = () => (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-14 pb-4">
        <TouchableOpacity
          className="h-12 w-12 rounded-full bg-black/10 items-center justify-center"
          onPress={() => router.back()}
        >
          <ArrowLeft size="24" color="#000" />
        </TouchableOpacity>

        <View className="flex-row gap-2">
          <TouchableOpacity
            className="h-12 w-12 rounded-full bg-black/10 items-center justify-center"
            onPress={handleCreateBookmark}
          >
            <Bookmark size="20" color="#212B36" />
          </TouchableOpacity>
          <TouchableOpacity
            className="h-12 w-12 rounded-full bg-black/10 items-center justify-center"
            onPress={() => setIsTableOfContentsVisible(true)}
          >
            <More size="24" color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Book Cover */}
      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={
            bookData?.book_cover_url
              ? { uri: bookData.book_cover_url }
              : images.song
          }
          className="w-64 h-96 rounded-2xl mb-8"
          resizeMode="cover"
        />

        {/* Book Title */}
        <Text className="text-2xl font-bold text-center text-gray-800 mb-2">
          {bookData?.book_title}
        </Text>

        {/* Author */}
        <Text className="text-lg text-gray-600 mb-8">
          {bookData?.artist_name}
        </Text>

        {/* Progress */}
        <View className="w-full px-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-600">{bookData?.book_title}</Text>
            <Text className="text-sm text-gray-600">{readingProgress}%</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full">
            <View
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${readingProgress}%` }}
            />
          </View>
        </View>
      </View>
    </View>
  )

  const renderChapterContent = (chapter: any) => (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-12 pb-4">
        <TouchableOpacity
          className="h-12 w-12 rounded-full bg-black/10 items-center justify-center"
          onPress={() => router.back()}
        >
          <ArrowLeft size="24" color="#000" />
        </TouchableOpacity>

        <View className="flex-row gap-2">
          <TouchableOpacity
            className="h-12 w-12 rounded-full bg-black/10 items-center justify-center"
            onPress={handleCreateBookmark}
          >
            <Bookmark size="24" color="#212B36" />
          </TouchableOpacity>
          <TouchableOpacity
            className="h-12 w-12 rounded-full bg-black/10 items-center justify-center"
            onPress={() => setIsTableOfContentsVisible(true)}
          >
            <More size="24" color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chapter Content */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Text className="text-xl font-bold text-gray-800 mb-6">
          {chapter.title}
        </Text>

        <RenderHTML
          contentWidth={screenWidth - 48}
          source={{ html: chapter.content }}
          tagsStyles={{
            p: {
              fontSize: 16,
              lineHeight: 24,
              color: '#374151',
              marginBottom: 16
            },
            h1: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: 12
            },
            h2: {
              fontSize: 18,
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: 10
            },
            h3: {
              fontSize: 16,
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: 8
            }
          }}
        />
      </ScrollView>

      {/* Progress Bar */}
      <View className="px-4 py-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm text-gray-600">{bookData?.book_title}</Text>
          <Text className="text-sm text-gray-600">{readingProgress}%</Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full">
          <View
            className="h-2 bg-green-500 rounded-full"
            style={{ width: `${readingProgress}%` }}
          />
        </View>
      </View>
    </View>
  )

  const renderTableOfContents = () => (
    <Modal
      visible={isTableOfContentsVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setIsTableOfContentsVisible(false)}
    >
      <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        {/* Header */}
        <View className="flex-row justify-between items-center px-4 pt-12 pb-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800 max-w-[70%]" numberOfLines={1}>
            {bookData?.book_title}
          </Text>
          <TouchableOpacity
            className="w-8 h-8 items-center justify-center"
            onPress={() => setIsTableOfContentsVisible(false)}
          >
            <CloseCircle size="24" color="#212B36"/>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row px-4 py-4">
          <TouchableOpacity
            className={`flex-1 items-center pb-2 ${activeTab === 'table' ? 'border-b-2 border-gray-800' : ''}`}
            onPress={() => setActiveTab('table')}
          >
            <Text className={`font-semibold ${activeTab === 'table' ? 'text-gray-800' : 'text-gray-400'}`}>
              Mục lục
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 items-center pb-2 ${activeTab === 'bookmarks' ? 'border-b-2 border-gray-800' : ''}`}
            onPress={() => setActiveTab('bookmarks')}
          >
            <Text className={`font-semibold ${activeTab === 'bookmarks' ? 'text-gray-800' : 'text-gray-400'}`}>
              Dấu trang
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'table' ? (
          <FlatList
            data={chapters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                className="px-4 py-3 border-b border-gray-100"
                onPress={() => {
                  setCurrentChapterIndex(index + 1)
                  setIsTableOfContentsVisible(false)
                }}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-800 flex-1">{item.title}</Text>
                  {index >= 6 && (
                    <Crown size="16" color="#FFD700" />
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View className="flex-1">
            {bookmarks.length > 0 ? (
              <>
                {/* Bookmark Actions */}
                <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
                  <Text className="text-gray-600">{bookmarks.length} dấu trang</Text>
                  <View className="flex-row gap-2">
                    {isSelectionMode ? (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedBookmarkIds([])
                            setIsSelectionMode(false)
                          }}
                          className="px-3 py-1 bg-gray-200 rounded-lg"
                        >
                          <Text className="text-gray-600 text-sm">Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleDeleteBookmarks}
                          className="px-3 py-1 bg-red-500 rounded-lg"
                        >
                          <Text className="text-white text-sm">Xóa ({selectedBookmarkIds.length})</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setIsSelectionMode(true)}
                        className="px-3 py-1 bg-blue-500 rounded-lg"
                      >
                        <Text className="text-white text-sm">Chọn</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Bookmarks List */}
                <FlatList
                  data={bookmarks}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className={`px-4 py-3 border-b border-gray-100 ${
                        isSelectionMode ? 'bg-gray-50' : ''
                      }`}
                      onPress={() => {
                        if (isSelectionMode) {
                          toggleBookmarkSelection(item.id)
                        } else {
                          handleBookmarkPress(item)
                        }
                      }}
                      onLongPress={() => {
                        if (!isSelectionMode) {
                          setIsSelectionMode(true)
                          setSelectedBookmarkIds([item.id])
                        }
                      }}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="font-semibold text-gray-800 mb-1">
                            {chaptersQuery?.data?.data?.filter((it: any) => it.id === item.chapterId)?.[0]?.title}
                          </Text>
                          <Text className="text-gray-500 text-sm mb-1">
                            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                          </Text>
                        </View>

                        {isSelectionMode && (
                          <View className="ml-3">
                            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                              selectedBookmarkIds.includes(item.id) 
                                ? 'bg-blue-500 border-blue-500' 
                                : 'border-gray-300'
                            }`}>
                              {selectedBookmarkIds.includes(item.id) && (
                                <Text className="text-white text-xs">✓</Text>
                              )}
                            </View>
                          </View>
                        )}

                        {!isSelectionMode && (
                          <Bookmark size="16" color="#FF9315" />
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Bookmark size="48" color="#9CA3AF" />
                <Text className="text-gray-500 mt-4 text-center">
                  Chưa có dấu trang nào
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  Nhấn vào biểu tượng bookmark để tạo dấu trang
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Modal>
  )

  const renderCurrentPage = () => {
    if (currentChapterIndex === 0) {
      return renderBookCover()
    } else if (chapters[currentChapterIndex - 1]) {
      return renderChapterContent(chapters[currentChapterIndex - 1])
    } else {
      return renderBookCover() // fallback
    }
  }

  // Simple fallback if gesture handler causes issues
  if (!bookData || !chapters) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">Đang tải...</Text>
      </View>
    )
  }


  return (
    <View className="flex-1">
      {renderCurrentPage()}
      {renderTableOfContents()}
    </View>
  )
}