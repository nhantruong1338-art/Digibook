import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, GestureResponderEvent } from 'react-native'
import { Star1 } from 'iconsax-react-native' // or 'iconsax-react' if your setup uses web react

type StarRatingProps = {
  rating: number // giá trị ban đầu 0..max
  max?: number // mặc định 5
  size?: number // kích thước icon
  color?: string // màu sao sáng
  inactiveColor?: string // màu sao không sáng
  editable?: boolean // cho phép click để đổi rating
  onChange?: (newRating: number) => void // callback khi user bấm
  style?: any
}

export default function StarRating({
  rating,
  max = 5,
  size = 28,
  color = '#FFC107',
  inactiveColor = '#D1D5DB',
  editable = false,
  onChange,
  style,
}: StarRatingProps) {
  const [value, setValue] = useState<number>(Math.max(0, Math.min(max, Math.round(rating))))

  useEffect(() => {
    // sync khi prop rating thay đổi
    setValue(Math.max(0, Math.min(max, Math.round(rating))))
  }, [rating, max])

  const handlePress = (index: number) => (e: GestureResponderEvent) => {
    if (!editable) return
    const newVal = index + 1
    setValue(newVal)
    onChange?.(newVal)
  }

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < value
        return (
          <TouchableOpacity
            key={`star-${i}`}
            onPress={handlePress(i)}
            activeOpacity={editable ? 0.7 : 1}
            disabled={!editable}
            style={{ padding: 4 }}
          >
            <Star1
              variant={filled ? 'Bold' : 'Outline'} // Iconsax hỗ trợ variant Bold / Outline
              size={size}
              color={filled ? color : inactiveColor}
            />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
