import ModalComponent from '@/components/ModalComponent'
import { ScrollView, Text, TouchableOpacity, View, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import { UserRanking } from '@/hooks/useHome'
import { MusicSquareAdd, Send2 } from 'iconsax-react-native'

interface IModalSelectModeProps {
  onClose: () => void
  visible: boolean
  data?: UserRanking[] // Optional data prop, can be used for future enhancements
}

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: string
  hasAudio?: boolean
  audioTitle?: string
}

export default function ModalBotMusic({ onClose, visible, data }: IModalSelectModeProps) {
  const [inputText, setInputText] = useState('')
  
  // Sample chat messages based on the image
  const [messages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hey John, I am looking for the best admin template. Could you please help me to find it out? 🤔",
      isUser: false,
      timestamp: "4:02 PM"
    },
    {
      id: '2',
      text: "Stack admin is the responsive bootstrap 4 admin template.",
      isUser: true,
      timestamp: "4:02 PM"
    },
    {
      id: '3',
      text: "",
      isUser: false,
      timestamp: "4:02 PM",
      hasAudio: true,
      audioTitle: "DJ Long Nhat....."
    }
  ])

  const handleSend = () => {
    if (inputText.trim()) {
      // Handle send message logic here
      setInputText('')
    }
  }

  const handleAddSampleMusic = () => {
    // Handle add sample music logic here
  }

  return (
    <ModalComponent onClose={onClose} visible={visible} height="90%">
      <View className="flex-1 w-full px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6 mt-2">
          <View className="flex-row items-center">
            <View>
              <Text className="text-white font-semibold text-lg">Xin chào</Text>
              <Text className="text-[#A766FF] font-semibold text-lg">Chris Hemsworth!</Text>
            </View>
          </View>
          <Text className="text-[#919EAB] text-sm">4:02 PM</Text>
        </View>

        {/* Chat Messages */}
        <ScrollView className="flex-1 mb-4" showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <View key={message.id} className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}>
              <Text className="text-[#919EAB] text-xs mb-2">{message.timestamp}</Text>
              
              {message.text && (
                <View className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.isUser 
                    ? 'bg-[#A766FF]' 
                    : 'bg-[#2D3748]'
                }`}>
                  <Text className="text-white text-sm">
                    {message.text}
                  </Text>
                </View>
              )}

              {message.hasAudio && (
                <View className="max-w-[80%] px-4 py-3 rounded-2xl bg-[#2D3748]">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-white text-sm font-medium">{message.audioTitle}</Text>
                      <Text className="text-[#919EAB] text-xs">MP3</Text>
                    </View>
                    <TouchableOpacity className="ml-3 bg-[#A766FF] px-3 py-1 rounded-lg">
                      <Text className="text-white text-xs font-medium">Nghe</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View className="bg-[#2D3748] rounded-2xl p-4 mb-4 border border-[#919EAB52]">
          <TextInput
            className="text-white text-sm mb-3 min-h-[20px]"
            placeholder="Bạn muốn tạo nhạc..."
            placeholderTextColor="#919EAB"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          
          <View className="flex-row items-center justify-between">
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={handleAddSampleMusic}
            >
              <MusicSquareAdd
                size="20"
                color="#919EAB"
              />
              <Text className="text-[#919EAB] text-sm ml-2">Thêm nhạc mẫu</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-white px-4 py-2 rounded-xl flex-row items-center"
              onPress={handleSend}
            >
              <Text className="text-black font-semibold mr-2">Gửi</Text>
              <Send2 size="20" color="#212B36"/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ModalComponent>
  )
}
