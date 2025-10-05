import { Image, Text, View } from 'react-native'
import { images } from '@/constants'

export interface IItemMini {
  data?: any
}

export default function ItemMini({ data }: IItemMini) {
  return (
    <View>
      <Image
        source={
          data?.coverUrl
            ? {
                uri: data?.coverUrl,
              }
            : images.song
        }
        className="w-[90px] h-[90px] rounded-[16px] border border-[#FFFFFF29]"
        resizeMode="cover"
      />
      <Text className="w-[90px] mt-2 text-[#212B36]" numberOfLines={1}>
        {data?.title || 'Gã săn cá'}
      </Text>
      {data?.artist?.name && (
        <Text className="w-[90px] text-[#637381] text-xs" numberOfLines={1}>
          {data?.artist || 'Em xinh Say Hi, Lâm Bảo Ngọc, Quỳnh Anh Shyn,...'}
        </Text>
      )}
    </View>
  )
}
