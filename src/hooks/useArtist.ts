import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import API_CLIENT from '@/libs/api/client'
import { Routes } from '@/libs/api/routes/routes'
import { useToast } from '@/components/ToastNotify/ToastContext'

// Types for artist API parameters
interface ArtistListParams {
  searchFields?: string[]
  sort?: string
  filter?: string
  pageSize?: number
  pageNumber?: number
  search?: string
}

export function useArtist() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  // Follow Artist Mutation
  const followArtistMutation = useMutation({
    mutationFn: async (artistId: number | string) => {
      const response = await API_CLIENT.post(Routes.artist.follow(artistId))
      return response.data
    },
    onSuccess: (data, artistId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['home', 'popular-artists'] })
      queryClient.invalidateQueries({ queryKey: ['home', 'overview'] })
      queryClient.invalidateQueries({ queryKey: ['artists', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['artists', 'user-followed'] })
      queryClient.invalidateQueries({ queryKey: ['artists', 'detail', artistId] })

      showToast('Đã theo dõi nghệ sĩ!', 'success')
    },
    onError: (error) => {
      console.log('Follow artist error:', error)
      showToast('Có lỗi xảy ra khi theo dõi nghệ sĩ!', 'error')
    },
  })

  // Unfollow Artist Mutation
  const unfollowArtistMutation = useMutation({
    mutationFn: async (artistId: number | string) => {
      const response = await API_CLIENT.delete(Routes.artist.unfollow(artistId))
      return response.data
    },
    onSuccess: (data, artistId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['home', 'popular-artists'] })
      queryClient.invalidateQueries({ queryKey: ['home', 'overview'] })
      queryClient.invalidateQueries({ queryKey: ['artists', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['artists', 'user-followed'] })
      queryClient.invalidateQueries({ queryKey: ['artists', 'detail', artistId] })

      showToast('Đã bỏ theo dõi nghệ sĩ!', 'success')
    },
    onError: (error) => {
      console.log('Unfollow artist error:', error)
      showToast('Có lỗi xảy ra khi bỏ theo dõi nghệ sĩ!', 'error')
    },
  })

  // Get Artists List Query
  const getArtistsList = (params: ArtistListParams = {}) => {
    return useQuery({
      queryKey: ['artists', 'list', params],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.artist.list, {
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

  // Get Artist Detail Query
  const getArtistDetail = (artistId: number | string) => {
    return useQuery({
      queryKey: ['artists', 'detail', artistId],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.artist.detail(artistId))
        return response.data
      },
      enabled: !!artistId, // Only run query if artistId is provided
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    })
  }

  const getListTrackArtist = (artistId: number | string) => {
    return useQuery({
      queryKey: ['artists', 'list-tracks', artistId],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.artist.listTracks(artistId))
        return response.data
      },
      enabled: !!artistId, // Only run query if artistId is provided
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    })
  }

  const getListBookArtist = (artistId: number | string) => {
    return useQuery({
      queryKey: ['artists', 'list-book', artistId],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.artist.listBook(artistId))
        return response.data
      },
      enabled: !!artistId, // Only run query if artistId is provided
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    })
  }

  const getListAlbumsArtist = (artistId: number | string) => {
    return useQuery({
      queryKey: ['artists', 'list-albums', artistId],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.artist.listAlbum(artistId))
        return response.data
      },
      enabled: !!artistId, // Only run query if artistId is provided
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    })
  }

  return {
    followArtistMutation,
    unfollowArtistMutation,
    getArtistsList,
    getArtistDetail,
    getListTrackArtist,
    getListAlbumsArtist,
    getListBookArtist
  }
}
