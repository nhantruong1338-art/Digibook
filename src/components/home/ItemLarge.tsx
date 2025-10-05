import { Image, Text, View } from 'react-native'
import { images } from '@/constants'

export interface IItemLarge {
  data?: any
}

export default function ItemLarge({ data }: IItemLarge) {
  console.log(data)
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
        className="w-[150px] h-[225px] rounded-[12px] border border-[#FFFFFF29]"
        resizeMode="cover"
      />
      <Text className="w-[150px] mt-2 text-[#212B36]" numberOfLines={1}>
        {data?.title || 'Gã săn cá'}
      </Text>
      {data?.artist?.name && (
        <Text className="w-[150px] text-[#637381] text-xs" numberOfLines={1}>
          {data?.artist?.name || 'Em xinh Say Hi, Lâm Bảo Ngọc, Quỳnh Anh Shyn,...'}
        </Text>
      )}
    </View>
  )
}
