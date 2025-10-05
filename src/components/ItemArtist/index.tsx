import { Image, Text, TouchableOpacity, View } from 'react-native'
import IconTick from '~/assets/icon-svg/IconTick'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { useArtist } from '@/hooks/useArtist'
import { images } from '@/constants'

export interface IItemArtistProps {
  data?: {
    id: string
    name: string
    avatarUrl?: string
    bio: string
    playCount: number
    isFollowed: boolean
  }
}

export default function ItemArtist({ data }: IItemArtistProps) {
  const router = useRouter()
  const { followArtistMutation, unfollowArtistMutation } = useArtist()

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
      className="gap-1"
      onPress={() =>
        router.push({
          pathname: ERouteTable.ARTIST_DETAIL,
          params: { artistId: data?.id },
        })
      }
    >
      <Image
        source={
          data?.avatarUrl
            ? {
                uri:
                  data?.avatarUrl ||
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRijEkKwqZJbuh6TDfx5CDznfAPjTBu67UXzw&s',
              }
            : images.song
        }
        className="w-32 h-32 rounded-[32px] border border-[#FFFFFF29]"
        resizeMode="cover"
      />
      <Text className="mt-2 w-32 text-center text-[#212B36]" numberOfLines={1}>
        {data?.name || 'Jack – J97'}
      </Text>
      <Text className="text-[#919EAB] w-32 text-center text-xs" numberOfLines={1}>
        {data?.playCount} người yêu thích
      </Text>
      <View className="items-center">
        {data?.isFollowed ? (
          <TouchableOpacity
            className="flex-row gap-2 border border-[#EC38BC7A] p-2 rounded-2xl items-center"
            onPress={handleUnFollow}
            disabled={unfollowArtistMutation.isPending}
          >
            <IconTick />
            <Text className="text-[#EC38BC]">
              {unfollowArtistMutation.isPending ? 'Đang xử lý...' : 'Yêu thích'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="border border-[#919EAB52] p-2 rounded-2xl"
            onPress={handleFollow}
            disabled={followArtistMutation.isPending}
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
