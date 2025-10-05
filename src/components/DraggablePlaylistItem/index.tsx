import React from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
import ItemLibrary from '../ItemLibrary'
import { MaterialIcons } from '@expo/vector-icons'

interface EditablePlaylistItemProps {
  item: any
  index: number
  onRemove: (index: number) => void
}

export default function EditablePlaylistItem({ item, index, onRemove }: EditablePlaylistItemProps) {
  const handleRemove = () => {
    Alert.alert('Xóa bài hát', 'Bạn có chắc chắn muốn xóa bài hát này khỏi playlist?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => onRemove(index),
      },
    ])
  }

  return (
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-1">
        <ItemLibrary
          isRemove
          onRemove={handleRemove}
          title={item?.title}
          imageUrl={item?.coverUrl}
          artist={item?.artist || 'Unknown Artist'}
        />
      </View>
    </View>
  )
}
