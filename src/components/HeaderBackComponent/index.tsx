import { useRouter } from 'expo-router'
import { View, Text, TouchableOpacity } from 'react-native'
import IconBack from '~/assets/icon-svg/IconBack'
import { ArrowLeft } from 'iconsax-react-native'

interface IHeaderBackComponentProps {
  title?: string
  leftChildren?: any
}

export default function HeaderBackComponent({ title, leftChildren }: IHeaderBackComponentProps) {
  const router = useRouter()
  return (
    <View className="flex-row justify-between items-center">
      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-[#919EAB] h-12 w-12 justify-center items-center rounded-full"
      >
        <ArrowLeft size="24" color="#212B36" />
      </TouchableOpacity>
      {title && <Text className="font-semibold text-lg">{title}</Text>}
      <View>
        {leftChildren && leftChildren}
      </View>
    </View>
  )
}
