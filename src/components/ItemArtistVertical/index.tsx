import { Image, Text, TouchableOpacity, View } from 'react-native'
import IconTick from '~/assets/icon-svg/IconTick'
import { Artist } from '@/data/DataMusic'
import { images } from '@/constants'
import { useArtist } from '@/hooks/useArtist'
import { ERouteTable } from '@/constants/route-table'
import { useRouter } from 'expo-router'

export interface IItemArtistProps {
  isActive?: boolean
  data?: any
}

export default function ItemArtistVertical({ isActive = false, data }: IItemArtistProps) {
  const { followArtistMutation, unfollowArtistMutation } = useArtist()
  const router = useRouter()

  const handleFollow = () => {
    if (data?.id) {
      followArtistMutation.mutate(data.id)
    }
  }

  const handleUnFollow = () => {
    if (data?.id) {
      unfollowArtistMutation.mutate(data.id)
    }
  }

  return (
    <TouchableOpacity
      className="gap-1 flex-row justify-between items-center"
      onPress={() =>
        router.push({
          pathname: ERouteTable.ARTIST_DETAIL,
          params: { artistId: data?.id },
        })
      }
    >
      <View className="flex-row gap-2 items-center">
        <Image
          source={
            data?.avatarUrl
              ? {
                  uri: data?.avatarUrl,
                }
              : images.song
          }
          className="w-14 h-14 rounded-xl border border-[#FFFFFF29]"
          resizeMode="cover"
        />
        <View className="items-start">
          <Text className="text-center text-[#212B36] max-w-[90%]" numberOfLines={1}>
            {data?.name || 'Jack – J97'}
          </Text>
          <Text className="text-[#919EAB] text-center text-xs" numberOfLines={1}>
            2,3Tr người yêu thích
          </Text>
        </View>
      </View>
      <View className="items-center">
        {data?.isFollowed ? (
          <TouchableOpacity
            onPress={handleUnFollow}
            disabled={unfollowArtistMutation.isPending}
            className="flex-row gap-2 border border-[#EC38BC7A] p-2 rounded-2xl items-center"
          >
            <IconTick />
            <Text className="text-[#EC38BC]">
              {unfollowArtistMutation.isPending ? 'Đang xử lý...' : 'Đang theo dõi'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleFollow}
            disabled={followArtistMutation.isPending}
            className="border border-[#919EAB52] p-2 rounded-2xl"
          >
            <Text className="text-[#212B36]">
              {followArtistMutation.isPending ? 'Đang xử lý...' : 'Yêu thích'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}
