# Audio Queue Management - Usage Guide

## Tổng quan

Hệ thống quản lý hàng đợi âm thanh tối ưu cho việc phát nhạc liên tục giữa các màn hình.

## Cách sử dụng trong các màn khác

### 1. Import functions cần thiết

```typescript
import { playSingleTrack, playFromList, addToQueue, playNext } from '@/utils/audioQueueManager'
```

### 2. Phát một bài hát đơn lẻ

```typescript
// Thay thế cho router.push hiện tại
// TRƯỚC:
router.push({
  pathname: ERouteTable.PLAY_MUSIC,
  params: { trackId: item.id },
})

// SAU:
playSingleTrack(item.id)
```

### 3. Phát từ danh sách bài hát

```typescript
// Khi user click vào một bài trong playlist/album
const trackIds = ['track1', 'track2', 'track3', 'track4']
const selectedTrackId = 'track2'

playFromList(trackIds, selectedTrackId)
// Sẽ phát track2, sau đó track3, track4, track1 (loop)
```

### 4. Thêm vào hàng đợi

```typescript
// Thêm một bài vào cuối hàng đợi
addToQueue('track5')

// Thêm nhiều bài
addToQueue(['track6', 'track7', 'track8'])

// Thêm vào phát tiếp theo (sau bài hiện tại)
playNext('track9')
```

### 5. Ví dụ cụ thể cho các màn

#### Home Screen (Phát từ danh sách trending)

```typescript
const handlePlayFromTrending = (selectedTrack: any, trendingTracks: any[]) => {
  const trackIds = trendingTracks.map((track) => track.id.toString())
  playFromList(trackIds, selectedTrack.id.toString())
}
```

#### Library Detail (Phát từ playlist)

```typescript
const handlePlayFromPlaylist = (selectedTrack: any, playlistTracks: any[]) => {
  const trackIds = playlistTracks.map((track) => track.id.toString())
  playFromList(trackIds, selectedTrack.id.toString())
}
```

#### Artist Detail (Phát từ top songs)

```typescript
const handlePlayFromArtist = (selectedTrack: any, artistTracks: any[]) => {
  const trackIds = artistTracks.map((track) => track.id.toString())
  playFromList(trackIds, selectedTrack.id.toString())
}
```

## Tính năng trong Play Music Screen

### Các chế độ phát

- **Normal**: Phát theo thứ tự trong queue
- **Repeat**: Lặp lại bài hiện tại
- **Shuffle**: Phát ngẫu nhiên (giữ nguyên bài hiện tại, xáo trộn phần còn lại)

### Controls

- **Next/Previous**: Điều hướng trong queue
- **Repeat**: Toggle chế độ lặp
- **Shuffle**: Toggle chế độ xáo trộn

### Smart Queue Management

- Tự động thêm bài mới vào queue khi navigate từ màn khác
- Duy trì state khi chuyển giữa các màn
- Xử lý thông minh khi queue trống (chỉ có 1 bài)

## API Functions

### Core Functions

- `playSingleTrack(trackId)` - Phát một bài đơn lẻ
- `playFromList(trackIds, startTrackId)` - Phát từ danh sách
- `addToQueue(trackIds)` - Thêm vào queue
- `playNext(trackId)` - Phát tiếp theo

### Queue Management

- `getQueueInfo()` - Lấy thông tin queue hiện tại
- `clearQueue()` - Xóa queue
- `removeFromQueue(trackId)` - Xóa bài khỏi queue
- `shuffleQueue()` - Xáo trộn queue
- `restoreOriginalQueue()` - Khôi phục thứ tự gốc

## Migration Guide

### Cập nhật các màn hiện tại:

1. **home.tsx** - Thay thế 4 chỗ router.push
2. **library-detail.tsx** - Thay thế 1 chỗ router.push
3. **favorite-detail.tsx** - Thay thế 1 chỗ router.push
4. **add-song.tsx** - Thay thế 1 chỗ router.push
5. **artist-detail.tsx** - Thay thế 1 chỗ router.push

### Template cho migration:

```typescript
// TRƯỚC
onPress={() => {
  router.push({
    pathname: ERouteTable.PLAY_MUSIC,
    params: { trackId: item.id },
  })
}}

// SAU - Phát đơn lẻ
onPress={() => playSingleTrack(item.id.toString())}

// SAU - Phát từ danh sách
onPress={() => {
  const trackIds = listData.map(track => track.id.toString())
  playFromList(trackIds, item.id.toString())
}}
```

## Benefits

✅ **Seamless Playback** - Phát nhạc liên tục giữa các màn  
✅ **Smart Queue** - Tự động quản lý hàng đợi  
✅ **Cross-Screen State** - Duy trì state khi navigate  
✅ **Optimized Performance** - Giảm rerender và memory usage  
✅ **User-Friendly** - Next/Previous/Shuffle hoạt động đúng  
✅ **Backward Compatible** - Không thay đổi UI hiện tại

## Notes

- Tất cả trackId được convert sang string để consistency
- Global state được persist giữa các navigation
- Auto-fallback khi queue trống
- Support cả single track và playlist playback
