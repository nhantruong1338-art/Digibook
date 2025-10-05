import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'

interface SessionCardProps {
  title?: string
  description?: string
}

export default function SeeMoreCard({ title = '', description = '' }: SessionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const hasDescription = description?.trim()?.length > 0

  return (
    <View className="max-w-full mt-10">
      {title ? <Text className="text-gray-800 text-lg font-semibold mb-2">{title}</Text> : null}

      {hasDescription && (
        <>
          <Text
            numberOfLines={expanded ? undefined : 4}
            ellipsizeMode="tail"
            className="text-gray-500 text-base leading-6 mb-4"
          >
            {description}
          </Text>

          <Pressable
            onPress={() => setExpanded(!expanded)}
            className="self-start"
            android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
          >
            <Text className="text-[#637381] font-medium">{expanded ? 'Thu gọn' : 'Xem thêm'}</Text>
          </Pressable>
        </>
      )}
    </View>
  )
}
