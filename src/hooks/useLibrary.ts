import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import API_CLIENT from '@/libs/api/client'
import { Routes } from '@/libs/api/routes/routes'
import { useToast } from '@/components/ToastNotify/ToastContext'

// Types for playlist API parameters
interface CreatePlaylistParams {
  title: string
}

// Types for playlist track API parameters
interface AddTrackToPlaylistParams {
  playlistId: number
  trackId: number
}

// Types for playlist update API parameters
interface UpdatePlaylistParams {
  title?: string
  coverUrl?: string
}

// Types for bulk delete API parameters
interface BulkDeleteParams {
  ids: number[]
}

// Types for artist API parameters
interface ArtistListParams {
  searchFields?: string[]
  sort?: string
  filter?: string
  pageSize?: number
  pageNumber?: number
  search?: string
}

// Types for album favorites API parameters
interface AlbumFavoriteParams {
  id: number
}

// Types for book review API parameters
interface SubmitReviewParams {
  bookId: string
  rating: number
  comment: string
}

export function useLibrary() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  // Create Playlist Mutation
  const createPlaylistMutation = useMutation({
    mutationFn: async (params: CreatePlaylistParams) => {
      const response = await API_CLIENT.post(Routes.playlist.create, params)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['playlists', 'user'] })
      queryClient.invalidateQueries({ queryKey: ['home', 'overview'] })

      showToast('Đã tạo playlist thành công!', 'success')
    },
    onError: (error) => {
      console.log('Create playlist error:', error)
      showToast('Có lỗi xảy ra khi tạo playlist!', 'error')
    },
  })

  // Add Track to Playlist Mutation
  const addTrackToPlaylistMutation = useMutation({
    mutationFn: async (params: AddTrackToPlaylistParams) => {
      const response = await API_CLIENT.post(Routes.playlist.addTrack, params)
      return response.data
    },
    onSuccess: (data, variables) => {
      console.log(variables, '---variables')
      // Invalidate playlist detail to refresh track list
      queryClient.invalidateQueries({
        queryKey: ['playlists', 'detail', variables.playlistId.toString()],
      })
      queryClient.invalidateQueries({ queryKey: ['playlists', 'user'] })
      queryClient.invalidateQueries({ queryKey: ['home', 'overview'] })

      showToast('Đã thêm bài hát vào playlist thành công!', 'success')
    },
    onError: (error) => {
      console.log('Add track to playlist error:', error)
      showToast('Có lỗi xảy ra khi thêm bài hát vào playlist!', 'error')
    },
  })

  // Update Playlist Mutation
  const updatePlaylistMutation = useMutation({
    mutationFn: async ({
      playlistId,
      params,
    }: {
      playlistId: number | string
      params: UpdatePlaylistParams
    }) => {
      const response = await API_CLIENT.patch(Routes.playlist.update(playlistId), params)
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['playlists', 'detail', variables.playlistId.toString()],
      })
      queryClient.invalidateQueries({ queryKey: ['playlists', 'user'] })
      queryClient.invalidateQueries({ queryKey: ['home', 'overview'] })

      showToast('Đã cập nhật playlist thành công!', 'success')
    },
    onError: (error) => {
      console.log('Update playlist error:', error)
      showToast('Có lỗi xảy ra khi cập nhật playlist!', 'error')
    },
  })

  // Bulk Delete Tracks Mutation
  const bulkDeleteTracksMutation = useMutation({
    mutationFn: async (params: BulkDeleteParams) => {
      const response = await API_CLIENT.delete(Routes.playlist.bulkDelete, { data: params })
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlists', 'detail'] })
      // Invalidate all playlist queries since we don't know which playlist was affected
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
      queryClient.invalidateQueries({ queryKey: ['home', 'overview'] })

      showToast('Đã xóa bài hát thành công!', 'success')
    },
    onError: (error) => {
      console.log('Bulk delete tracks error:', error)
      showToast('Có lỗi xảy ra khi xóa bài hát!', 'error')
    },
  })

  // Get User Playlists Query
  const getUserPlaylists = () => {
    return useQuery({
      queryKey: ['playlists', 'user'],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.playlist.userPlaylists)
        return response.data
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    })
  }

  const getUserPlaylistsFavorite = () => {
    return useQuery({
      queryKey: ['playlists', 'user', 'Favorite'],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.playlist.favoriteDetail)
        return response.data
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    })
  }

  // Get Playlist Detail Query
  const getPlaylistDetail = (playlistId: number | string) => {
    return useQuery({
      queryKey: ['playlists', 'detail', playlistId],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.playlist.detail(playlistId))
        return response.data
      },
      enabled: !!playlistId, // Only run query if playlistId is provided
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    })
  }

  // Get Playlist Detail Query
  const getBookDetail = (bookId: number | string) => {
    return useQuery({
      queryKey: ['book', 'detail', bookId],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.book.bookDetail(bookId))
        return response.data
      },
      enabled: !!bookId, // Only run query if playlistId is provided
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    })
  }

  const getReviewBookDetail = (bookId: number | string) => {
    return useQuery({
      queryKey: ['book', 'review', bookId],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.book.reviewBook(bookId))
        return response.data
      },
      enabled: !!bookId, // Only run query if playlistId is provided
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    })
  }

  // Get User Albums Query
  const getUserAlbums = () => {
    return useQuery({
      queryKey: ['albums', 'user'],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.album.userAlbums)
        return response.data
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    })
  }

  const getAlbumDetail = (albumId: number | string) => {
    return useQuery({
      queryKey: ['album', 'detail', albumId],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.album.albumDetail(albumId))
        return response.data
      },
      enabled: !!albumId, // Only run query if playlistId is provided
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    })
  }

  // Get User Followed Artists Query
  const getUserFollowedArtists = (params: ArtistListParams = {}) => {
    return useQuery({
      queryKey: ['artists', 'user-followed', params],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.artist.userFollowed, {
          params: {
            searchFields: params.searchFields || ['name', 'description'],
            sort: params.sort || '',
            filter: params.filter,
            pageSize: params.pageSize || 250,
            pageNumber: params.pageNumber || 1,
            search: params.search,
          },
        })
        return response.data
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    })
  }

  // Get Track Detail Query
  const getTrackDetail = (trackId: number | string) => {
    return useQuery({
      queryKey: ['tracks', 'detail', trackId],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.track.detail(trackId))
        return response.data
      },
      enabled: !!trackId, // Only run query if trackId is provided
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    })
  }

  // Get Tracks Query
  // API Response Structure:
  // {
  //   "success": boolean,
  //   "errorCode": string,
  //   "message": string,
  //   "data": Array<{
  //     "id": number,
  //     "title": string,
  //     "audioUrl": string,
  //     "coverUrl": string,
  //     "duration": number,
  //     "artists": Array<{id, name, avatarUrl, isFollowed}>,
  //     "playCount": number,
  //     "likeCount": number
  //   }>
  // }
  const getTracks = (params?: {
    searchFields?: string[]
    sort?: string
    filter?: string
    pageSize?: number
    pageNumber?: number
    search?: string
  }) => {
    return useQuery({
      queryKey: ['tracks', 'list', params],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.track.list, { params })
        return response.data
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
    })
  }

  // Get Random Track Query
  // API Response Structure:
  // {
  //   "success": boolean,
  //   "errorCode": string,
  //   "message": string,
  //   "data": {
  //     "id": number,
  //     "title": string,
  //     "audioUrl": string,
  //     "coverUrl": string,
  //     "duration": number,
  //     "artists": Array<{id, name, avatarUrl, isFollowed}>,
  //     "playCount": number,
  //     "likeCount": number
  //   }
  // }
  const getRandomTrack = (currentTrackId: string | undefined) => {
    return useQuery({
      queryKey: ['tracks', 'random', currentTrackId],
      queryFn: async () => {
        if (!currentTrackId) throw new Error('Current Track ID is required')
        const response = await API_CLIENT.get(Routes.track.next(currentTrackId))
        return response.data
      },
      enabled: !!currentTrackId,
      staleTime: 0, // Always fetch fresh random track
      gcTime: 5 * 60 * 1000, // 5 minutes
    })
  }

  // Follow Album Mutation
  const followAlbumMutation = useMutation({
    mutationFn: async (params: AlbumFavoriteParams) => {
      const response = await API_CLIENT.post(Routes.album.follow(params.id), {})
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['albums', 'user'] })
      queryClient.invalidateQueries({ queryKey: ['home', 'overview'] })

      showToast('Đã theo dõi album thành công!', 'success')
    },
    onError: (error) => {
      console.log('Follow album error:', error)
      showToast('Có lỗi xảy ra khi theo dõi album!', 'error')
    },
  })

  // Unfollow Album Mutation
  const unfollowAlbumMutation = useMutation({
    mutationFn: async (params: AlbumFavoriteParams) => {
      const response = await API_CLIENT.delete(Routes.album.follow(params.id))
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['albums', 'user'] })
      queryClient.invalidateQueries({ queryKey: ['home', 'overview'] })

      showToast('Đã bỏ theo dõi album thành công!', 'success')
    },
    onError: (error) => {
      console.log('Unfollow album error:', error)
      showToast('Có lỗi xảy ra khi bỏ theo dõi album!', 'error')
    },
  })

  // Submit Book Review Mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (params: SubmitReviewParams) => {
      const response = await API_CLIENT.post(Routes.book.reviewBook(params.bookId), {
        rating: Number(params.rating),
        comment: params.comment,
      })
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch book reviews
      queryClient.invalidateQueries({ queryKey: ['book', 'review', variables.bookId] })
      showToast('Đánh giá đã được gửi thành công!', 'success')
    },
    onError: (error) => {
      console.error('Error submitting review:', error)
      showToast('Có lỗi xảy ra khi gửi đánh giá', 'error')
    },
  })

  return {
    createPlaylistMutation,
    addTrackToPlaylistMutation,
    updatePlaylistMutation,
    bulkDeleteTracksMutation,
    getUserPlaylists,
    getPlaylistDetail,
    getUserAlbums,
    getUserFollowedArtists,
    getAlbumDetail,
    getUserPlaylistsFavorite,
    getTrackDetail,
    getTracks,
    getRandomTrack,
    followAlbumMutation,
    unfollowAlbumMutation,
    getBookDetail,
    getReviewBookDetail,
    submitReviewMutation
  }
}
