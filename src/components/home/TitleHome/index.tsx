import { Text, View } from 'react-native'

interface ITitleHomeProps {
  color?: string
  text?: string
  leftActive?: any
}

export default function TitleHome({
  color = '#A766FF',
  text = 'Hay nghe gần đây',
  leftActive,
}: ITitleHomeProps) {
  return (
    <View className="flex-row justify-between items-center">
      <View className={`w-max`}>
        <Text className="text-2xl font-semibold">{text}</Text>
      </View>
      {leftActive && leftActive}
    </View>
  )
}
