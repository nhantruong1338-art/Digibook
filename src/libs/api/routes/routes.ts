export class Routes {
  static home = {
    // Legacy endpoints
    listCategory: '/categories/user',
    listLearning: '/courses/category/',
    learningDetail: '/courses',
    quizLearning: '/quiz/course/',
    submitQuizLearning: '/courses/submit',

    // New home API endpoints
    topCharts: '/api/v1/charts/top',
    overview: '/api/v1/home/overview',
    recentTracks: '/api/v1/home/recent-tracks',
    recentPlaylists: '/api/v1/home/recent-playlists',
    followedAlbums: '/api/v1/home/followed-albums',
    tracksByArtist: '/api/v1/home/tracks-by-artist',
    popularArtists: '/api/v1/home/popular-artists',
    newPlaylists: '/api/v1/home/new-playlists',
    trendingPlaylists: '/api/v1/home/trending-playlists',
    playlistByGenres: '/api/v1/home/playlist-by-genres',
    searchOverview: '/api/v1/home/search-overview',
    search: '/api/v1/home/search',
  }
  static settings = {
    getUser: '/users/me',
    changeName: '/users',
    changePassword: '/users/change-password',
    updateAvatar: '/users/avatar',
    rankUser: 'users/rank-user',
  }
  static practice = {
    quiz: '/quiz',
    quizDetail: '/quiz/',
    submitQuizPractice: '/quiz/submit',
  }
  static rank = {
    rank: '/users/rank',
  }
  static chess = {
    getWinLose: '/practice/win-lose-count',
  }
  static artist = {
    follow: (id: number | string) => `/api/v1/artist_followers/${id}/follow`,
    unfollow: (id: number | string) => `/api/v1/artist_followers/${id}/follow`,
    list: '/api/v1/artists',
    detail: (id: number | string) => `/api/v1/artists/${id}`,
    userFollowed: '/api/v1/artists/me',
    listTracks: (id: number | string) => `/api/v1/tracks/artist/${id}`,
    listBook: (id: number | string) => `/api/v1/books/artist/${id}`,
    listAlbum: (id: number | string) => `/api/v1/albums/artist/${id}`,
  }
  static playlist = {
    userPlaylists: '/api/v1/playlists/me',
    detail: (id: number | string) => `/api/v1/playlists/${id}`,
    create: '/api/v1/playlists',
    favoriteDetail: '/api/v1/playlists/favorite',
    addTrack: '/api/v1/playlist-tracks',
    update: (id: number | string) => `/api/v1/playlists/${id}`,
    bulkDelete: '/api/v1/playlists/bulk-delete',
  }

  static book = {
    bookDetail: (id: number | string) => `/api/v1/books/${id}`,
    reviewBook: (id: number | string) => `/api/v1/books/${id}/reviews`,
  }

  static album = {
    userAlbums: '/api/v1/albums/me',
    albumDetail: (id: number | string) => `/api/v1/albums/${id}`,
    follow: (id: number | string) => `/api/v1/album_favorites/${id}/follow`,
  }
  static track = {
    list: '/api/v1/tracks',
    detail: (id: number | string) => `/api/v1/tracks/${id}`,
    next: (id: number | string) => `/api/v1/tracks/next/${id}`,
  }
}
