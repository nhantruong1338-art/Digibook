import { useQuery } from '@tanstack/react-query'
import API_CLIENT from '@/libs/api/client'
import { Routes } from '@/libs/api/routes/routes'

export interface UserRanking {
  id: number
  fullName: string
  email: string
  avatar: string | null
  totalScore: number
}

export function useHome() {
  // Top Charts
  const topChartsQuery = useQuery({
    queryKey: ['home', 'top-charts'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.home.topCharts)
      return response.data
    },
  })

  // Recent Tracks
  const recentTracksQuery = useQuery({
    queryKey: ['home', 'recent-tracks'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.home.recentTracks)
      return response.data
    },
  })

  // Recent Playlists
  const recentPlaylistsQuery = useQuery({
    queryKey: ['home', 'recent-playlists'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.home.recentPlaylists)
      return response.data
    },
  })

  // Followed Albums
  const followedAlbumsQuery = useQuery({
    queryKey: ['home', 'followed-albums'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.home.followedAlbums)
      return response.data
    },
  })

  // Tracks by Artist
  const tracksByArtistQuery = useQuery({
    queryKey: ['home', 'tracks-by-artist'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.home.tracksByArtist)
      return response.data
    },
  })

  // Popular Artists
  const popularArtistsQuery = useQuery({
    queryKey: ['home', 'popular-artists'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.home.popularArtists)
      return response.data
    },
  })

  // New Playlists
  const newPlaylistsQuery = useQuery({
    queryKey: ['home', 'new-playlists'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.home.newPlaylists)
      return response.data
    },
  })

  // Trending Playlists
  const trendingPlaylistsQuery = useQuery({
    queryKey: ['home', 'trending-playlists'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.home.trendingPlaylists)
      return response.data
    },
  })

  // Playlist by Genres
  const playlistByGenresQuery = useQuery({
    queryKey: ['home', 'playlist-by-genres'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.home.playlistByGenres)
      return response.data
    },
  })

  // // Search Overview
  // const searchOverviewQuery = useQuery({
  //   queryKey: ['home', 'search-overview'],
  //   queryFn: async () => {
  //     const response = await API_CLIENT.get(Routes.home.searchOverview)
  //     return response.data
  //   },
  // })

  // Search function with parameters
  const searchQuery = (params: { query: string; pageSize?: number; pageNumber?: number }) => {
    return useQuery({
      queryKey: ['home', 'search', params],
      queryFn: async () => {
        const response = await API_CLIENT.get(Routes.home.search, {
          params: {
            query: params.query ?? '',
            pageSize: params.pageSize || 10,
            pageNumber: params.pageNumber || 1,
          },
        })
        return response.data
      },
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
    })
  }

  return {
    // New home API queries
    topChartsQuery,
    recentTracksQuery,
    recentPlaylistsQuery,
    followedAlbumsQuery,
    tracksByArtistQuery,
    popularArtistsQuery,
    newPlaylistsQuery,
    trendingPlaylistsQuery,
    playlistByGenresQuery,
    // searchOverviewQuery,
    searchQuery,
  }
}

export function useOverView() {
  // Home Overview
  const overviewQuery = useQuery({
    queryKey: ['home', 'overview'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.home.overview)
      return response.data
    },
  })

  return {
    // New home API queries
    overviewQuery,
  }
}
