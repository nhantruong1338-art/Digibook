import { ScrollView, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import ItemLibrary from '@/components/ItemLibrary'
import { useLibrary } from '@/hooks/useLibrary'
import HeaderComponentText from '@/components/HeaderComponentText'

export default function AddSongAlbum() {
  const { albumId, playlistId } = useLocalSearchParams<{ albumId: string; playlistId: string }>()
  const { getAlbumDetail } = useLibrary()
  const albumDetailQuery = getAlbumDetail(albumId)
  const { addTrackToPlaylistMutation } = useLibrary()
  const handleAddTrankToPlaylist = (idTrack: any, playlistId: any) => {
    if (!idTrack || !playlistId) {
      console.error('Missing trackId or playlistId')
      return
    }

    addTrackToPlaylistMutation.mutate({
      trackId: Number(idTrack),
      playlistId: Number(playlistId),
    })
  }

  return (
    <View className="mx-4 flex-1">
      <HeaderComponentText title={albumDetailQuery?.data?.data?.title} />
      <ScrollView showsHorizontalScrollIndicator={false} className="flex-1">
        <View className="gap-3 mt-3 mb-8">
          {albumDetailQuery?.data?.data?.tracks?.map((item: any) => (
            <TouchableOpacity key={item.id}>
              <ItemLibrary
                onAdd={() => handleAddTrankToPlaylist(item.id, playlistId)}
                isAdd={true}
                title={item.title}
                imageUrl={item?.coverUrl}
                artist={albumDetailQuery?.data?.data?.artist?.name || 'Chưa có nghệ sĩ'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
