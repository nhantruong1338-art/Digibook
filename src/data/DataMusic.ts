export interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number // in seconds
  uri: string // local file path or URL
  artwork?: string
  genre?: string
  year?: number
  isFavorite?: boolean
}

export interface Playlist {
  id: string
  name: string
  description?: string
  artwork?: string
  songs: Song[]
  createdAt: Date
  updatedAt: Date
}

export interface Album {
  id: string
  title: string
  artist: string
  artwork?: string
  year?: number
  songs: Song[]
}

export interface Artist {
  id: string
  name: string
  avatar?: string
  bio?: string
  albums: Album[]
  topSongs: Song[]
}

// Sample music data (using working audio URLs for testing)
export const sampleSongs: Song[] = [
  {
    id: '1',
    title: 'Ông bà già tao lo hết',
    artist: 'Bình Gold, Lil Shady',
    album: 'Sample Album',
    duration: 30,
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    artwork: 'https://avatar-ex-swe.nixcdn.com/song/2023/02/06/8/d/a/c/1675677382296_640.jpg',
    genre: 'Test',
    year: 2024,
    isFavorite: false,
  },
  {
    id: '2',
    title: 'Sample Music 2',
    artist: 'Test Artist',
    album: 'Sample Album',
    duration: 25,
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    artwork:
      'https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/cover/3/2/7/f/327f68099674128289ba8a2e98232d68.jpg',
    genre: 'Test',
    year: 2024,
    isFavorite: true,
  },
  {
    id: '3',
    title: 'Nắng ấm xa dần',
    artist: 'Sơn Tung MTP',
    album: 'Demo Collection',
    duration: 20,
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    artwork: 'https://i.scdn.co/image/ab67616d0000b273445dcdddde9f9c5040c63efe',
    genre: 'Demo',
    year: 2024,
    isFavorite: false,
  },
  {
    id: '4',
    title: 'Be the shy',
    artist: 'Sơn Tung MTP',
    album: 'Test Album',
    duration: 30,
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    artwork: 'https://i1.sndcdn.com/artworks-csChE71TzjpFiFuO-Z0zktA-t500x500.png',
    genre: 'Sample',
    year: 2024,
    isFavorite: true,
  },
]

export const samplePlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Nhạc Việt Yêu Thích',
    description: 'Những bài hát Việt được yêu thích nhất',
    artwork: 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/playlist-viet.jpg',
    songs: sampleSongs,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Top Hits 2024',
    description: 'Những ca khúc hot nhất năm 2024',
    artwork: 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/tophits2024.jpg',
    songs: sampleSongs.slice(0, 2),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20'),
  },
]

export const sampleArtists: Artist[] = [
  {
    id: '1',
    name: 'Sơn Tùng M-TP',
    avatar:
      'https://hosongoisao.com/wp-content/uploads/2025/01/son-tung-mtp-17182382517241228747767.jpg',
    bio: 'Nghệ sĩ nổi tiếng Việt Nam',
    albums: [],
    topSongs: sampleSongs.filter((song) => song.artist === 'Sơn Tùng M-TP'),
  },
  {
    id: '2',
    name: 'Đức Phúc',
    avatar: 'https://tudienwiki.com/wp-content/uploads/2023/03/DUC-PHUC.jpg',
    bio: 'Ca sĩ trẻ tài năng',
    albums: [],
    topSongs: sampleSongs.filter((song) => song.artist === 'Đức Phúc'),
  },
  {
    id: '3',
    name: 'Jack pipu',
    avatar:
      'https://media.vov.vn/sites/default/files/styles/large/public/2021-04/poster_comeback_jack.jpg',
    bio: 'Ca sĩ trẻ tài năng',
    albums: [],
    topSongs: sampleSongs.filter((song) => song.artist === 'Đức Phúc'),
  },
  {
    id: '4',
    name: 'Mỹ Tâm',
    avatar:
      'https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2023/12/27/my-tam--17036889140861950442759.jpg',
    bio: 'Ca sĩ trẻ tài năng',
    albums: [],
    topSongs: sampleSongs.filter((song) => song.artist === 'Đức Phúc'),
  },
  {
    id: '5',
    name: 'Hà Anh Tuấn',
    avatar: 'https://i-giaitri.vnecdn.net/2025/07/18/ha-anh-tuan-1752812820-5002-1752813336.jpg',
    bio: 'Ca sĩ trẻ tài năng',
    albums: [],
    topSongs: sampleSongs.filter((song) => song.artist === 'Đức Phúc'),
  },
]
