import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import React, { useState, useCallback } from 'react'
import TitleHome from '@/components/home/TitleHome'
import ItemLarge from '@/components/home/ItemLarge'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ItemLibrary from '@/components/ItemLibrary'
import { ERouteTable } from '@/constants/route-table'
import { useHome } from '@/hooks/useHome'
import { useLibrary } from '@/hooks/useLibrary'
import { useDebounce } from '../../hooks/useDebounce'
import HeaderComponentText from '@/components/HeaderComponentText'
import { useArtist } from '@/hooks/useArtist'

const listCategoryMusic = [
  { title: 'Album', value: 'albums' },
  { title: 'Bài hát', value: 'tracks' },
  { title: 'Nghệ sĩ', value: 'artists' },
]

function getYearFromDate(dateString: any) {
  return new Date(dateString).getFullYear()
}

export default function AddSongArtist() {
  const { artistId, playlistId } = useLocalSearchParams<{ artistId: string; playlistId: string }>()
  const { addTrackToPlaylistMutation } = useLibrary()
  const { getArtistDetail, getListTrackArtist } = useArtist()
  const artistDetailQuery = getArtistDetail(artistId)
  const listTrackQuery = getListTrackArtist(artistId)

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
      <HeaderComponentText title={artistDetailQuery?.data?.data?.name} />
      <ScrollView showsHorizontalScrollIndicator={false} className="flex-1">
        <View className="gap-3 mt-6 mb-8">
          {listTrackQuery?.data?.data.map((track: any) => (
            <TouchableOpacity key={track.id}>
              <ItemLibrary
                onAdd={() => handleAddTrankToPlaylist(track.id, playlistId)}
                isAdd={true}
                title={track.title}
                imageUrl={track.coverUrl}
                artist={`${track.playCount} lượt nghe`}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
