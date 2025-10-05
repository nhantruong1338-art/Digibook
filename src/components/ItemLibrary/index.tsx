import { Image, Text, TouchableOpacity, View } from 'react-native'
import { images } from '@/constants'
import IconThreePoint from '~/assets/icon-svg/home/IconThreePoint'
import IconAddSong from '~/assets/icon-svg/IconAddSong'
import { SimpleLineIcons, MaterialIcons } from '@expo/vector-icons'
import IconClose from '~/assets/icon-svg/IconClose'

interface IItemLibraryProps {
  title?: string
  artist?: string
  imageUrl?: string
  isEdit?: boolean
  onEdit?: () => void
  isAdd?: boolean
  onAdd?: () => void
  isArrow?: boolean
  isRemove?: boolean
  onRemove?: () => void
}

export default function ItemLibrary({
  title = 'Gã săn cá',
  artist = 'Em xinh Say Hi, Lâm Bảo Ngọc, Quỳnh Anh Shyn,..',
  imageUrl,
  isEdit = false,
  onEdit,
  isAdd,
  onAdd,
  isArrow,
  isRemove,
  onRemove,
}: IItemLibraryProps) {
  return (
    <View className="flex-row justify-between items-center">
      <View className="flex-row gap-2 items-center">
        <Image
          source={
            imageUrl
              ? {
                  uri: imageUrl,
                }
              : images.defaultSong
          }
          className="w-14 h-14 rounded-2xl border border-[#FFFFFF29]"
          resizeMode="cover"
        />
        <View>
          <Text className="text-[#212B36] max-w-[300px]" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-[#919EAB] text-xs" numberOfLines={1}>
            {artist}
          </Text>
        </View>
      </View>
      {isEdit && (
        <TouchableOpacity onPress={onEdit}>
          <IconThreePoint />
        </TouchableOpacity>
      )}
      {isAdd && (
        <TouchableOpacity onPress={onAdd}>
          <IconAddSong />
        </TouchableOpacity>
      )}
      {isRemove && (
        <TouchableOpacity onPress={onRemove}>
          <IconClose />
        </TouchableOpacity>
      )}
      {isArrow && <SimpleLineIcons name="arrow-right" size={16} color="#919EAB" />}
    </View>
  )
}
