import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import API_CLIENT from '@/libs/api/client'
import { useToast } from '@/components/ToastNotify/ToastContext'

// Types for book API parameters
interface PaginationParams {
  pageSize?: number
  pageNumber?: number
}

// Types for reading API parameters
interface ReadingParams {
  bookId: number
  chapterId: number
}

// Types for bookmark API parameters
interface BookmarkParams {
  title: string
  position: number
  content: string
  chapterId: number
}

interface BulkDeleteBookmarkParams {
  ids: number[]
}

export function useBook() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  // Like Book
  const likeBookMutation = useMutation({
    mutationFn: async (bookId: number | string) => {
      const response = await API_CLIENT.post(`/api/v1/likes/${bookId}`)
      return response.data
    },
    onSuccess: (_data, bookId) => {
      queryClient.invalidateQueries({ queryKey: ['books', 'liked'] })
      queryClient.invalidateQueries({ queryKey: ['books', 'reading-history'] })
      queryClient.invalidateQueries({ queryKey: ['books', 'continue-reading'] })
      queryClient.invalidateQueries({ queryKey: ['book', 'detail', bookId] })
      showToast('Đã thích sách!', 'success')
    },
    onError: (error) => {
      console.log('Like book error:', error)
      showToast('Có lỗi xảy ra khi thích sách!', 'error')
    },
  })

  // Unlike Book
  const unlikeBookMutation = useMutation({
    mutationFn: async (bookId: number | string) => {
      const response = await API_CLIENT.delete(`/api/v1/likes/${bookId}`)
      return response.data
    },
    onSuccess: (_data, bookId) => {
      queryClient.invalidateQueries({ queryKey: ['books', 'liked'] })
      queryClient.invalidateQueries({ queryKey: ['books', 'reading-history'] })
      queryClient.invalidateQueries({ queryKey: ['books', 'continue-reading'] })
      queryClient.invalidateQueries({ queryKey: ['book', 'detail', bookId] })
      showToast('Đã bỏ thích sách!', 'success')
    },
    onError: (error) => {
      console.log('Unlike book error:', error)
      showToast('Có lỗi xảy ra khi bỏ thích sách!', 'error')
    },
  })

  // Reading history
  const getReadingHistory = (params: PaginationParams = {}) => {
    return useQuery({
      queryKey: ['books', 'reading-history', params],
      queryFn: async () => {
        const response = await API_CLIENT.get('/api/v1/books/reading-history', {
          params: {
            pageSize: params.pageSize || 250,
            pageNumber: params.pageNumber || 1,
          },
        })
        return response.data
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    })
  }

  // Continue reading
  const getContinueReading = (params: PaginationParams = {}) => {
    return useQuery({
      queryKey: ['books', 'continue-reading', params],
      queryFn: async () => {
        const response = await API_CLIENT.get('/api/v1/books/continue-reading', {
          params: {
            pageSize: params.pageSize || 250,
            pageNumber: params.pageNumber || 1,
          },
        })
        return response.data
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    })
  }

  // Liked books
  const getLikedBooks = (params: PaginationParams = {}) => {
    return useQuery({
      queryKey: ['books', 'liked', params],
      queryFn: async () => {
        const response = await API_CLIENT.get('/api/v1/books/liked', {
          params: {
            pageSize: params.pageSize || 250,
            pageNumber: params.pageNumber || 1,
          },
        })
        return response.data
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    })
  }

  // Chapters by book
  const getChaptersByBook = (bookId: number | string) => {
    return useQuery({
      queryKey: ['books', 'chapters', bookId],
      queryFn: async () => {
        const response = await API_CLIENT.get(`/api/v1/chapter/book/${bookId}`)
        return response.data
      },
      enabled: !!bookId,
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    })
  }

  // Track reading progress
  const trackReadingMutation = useMutation({
    mutationFn: async (params: ReadingParams) => {
      const response = await API_CLIENT.post('/api/v1/reading', {
        bookId: params.bookId,
        chapterId: params.chapterId,
      })
      return response.data
    },
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({ queryKey: ['books', 'reading-history'] })
      queryClient.invalidateQueries({ queryKey: ['home', 'overview'] })
      queryClient.invalidateQueries({ queryKey: ['books', 'continue-reading'] })
      queryClient.invalidateQueries({ queryKey: ['book', 'detail', params.bookId] })
    },
    onError: (error) => {
      console.log('Track reading error:', error)
      showToast('Có lỗi xảy ra khi lưu tiến độ đọc sách!', 'error')
    },
  })

  // Create bookmark
  const createBookmarkMutation = useMutation({
    mutationFn: async (params: BookmarkParams) => {
      const response = await API_CLIENT.post('/api/v1/bookmark', {
        title: params.title,
        position: params.position,
        content: params.content,
        chapterId: params.chapterId,
      })
      return response.data
    },
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', 'book', params.chapterId] })
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      showToast('Đã tạo dấu trang!', 'success')
    },
    onError: (error) => {
      console.log('Create bookmark error:', error)
      showToast('Có lỗi xảy ra khi tạo dấu trang!', 'error')
    },
  })

  // Bulk delete bookmarks
  const bulkDeleteBookmarksMutation = useMutation({
    mutationFn: async (params: BulkDeleteBookmarkParams) => {
      const response = await API_CLIENT.delete('/api/v1/bookmark/bulk-delete', {
        data: {
          ids: params.ids,
        },
      })
      return response.data
    },
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      showToast(`Đã xóa ${params.ids.length} dấu trang!`, 'success')
    },
    onError: (error) => {
      console.log('Bulk delete bookmarks error:', error)
      showToast('Có lỗi xảy ra khi xóa dấu trang!', 'error')
    },
  })

  // Get bookmarks by book
  const getBookmarksByBook = (bookId: number | string) => {
    return useQuery({
      queryKey: ['bookmarks', 'book', bookId],
      queryFn: async () => {
        const response = await API_CLIENT.get(`/api/v1/bookmark/book/${bookId}`)
        return response.data
      },
      enabled: !!bookId,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    })
  }

  return {
    likeBookMutation,
    unlikeBookMutation,
    getReadingHistory,
    getContinueReading,
    getLikedBooks,
    getChaptersByBook,
    trackReadingMutation,
    createBookmarkMutation,
    bulkDeleteBookmarksMutation,
    getBookmarksByBook,
  }
}


