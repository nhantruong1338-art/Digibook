import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import CustomButton from '@/components/CustomButton'
import { useAuthStore } from '@/store/useAuthStore'
import { ArrowLeft2 } from 'iconsax-react-native'

const VerifyAccount = () => {
  const router = useRouter()
  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const inputs = useRef<Array<TextInput | null>>([])
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { email } = useLocalSearchParams<{ email: string }>()
  const { sendOtpMutation, verifyOtpMutation } = useAuth()
  const { user } = useAuthStore()

  useEffect(() => {
    let timer: number
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }
    return () => clearInterval(timer)
  }, [countdown])

  // Watch for user changes and navigate accordingly
  useEffect(() => {
    if (user && !isLoading) {
      // Check if user needs to complete profile
      if (user.fullName === null) {
        // User needs to complete profile, navigate to user information screen
        router.replace(ERouteTable.USER_INFORMATION)
      } else {
        // User profile is complete, navigate to home
        router.replace(ERouteTable.HOME)
      }
    }
  }, [user, isLoading, router])

  const handleInput = (text: string, index: number) => {
    const newCode = [...code]
    if (text.length === 1) {
      newCode[index] = text
      setCode(newCode)
      if (index < 5) {
        inputs.current[index + 1]?.focus()
      }
    } else if (text.length > 1) {
      const pasted = text.slice(0, 6).split('')
      const filled = Array(6).fill('')
      pasted.forEach((char, idx) => (filled[idx] = char))
      setCode(filled)
      filled.forEach((char, idx) => {
        if (inputs.current[idx]) {
          inputs.current[idx]?.setNativeProps({ text: char })
        }
      })
      inputs.current[5]?.focus()
    } else {
      newCode[index] = ''
      setCode(newCode)
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const onSubmit = async () => {
    const otpCode = code.join('')
    if (otpCode.length !== 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 chữ số.')
      return
    }

    try {
      setIsLoading(true)
      await verifyOtpMutation.mutateAsync({ email, otpCode })
      // Navigation will be handled by useEffect when user data is updated
    } catch (error) {
      console.error(error)
      Alert.alert('Lỗi', 'Mã xác thực không hợp lệ.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      if (canResend) {
        setIsLoading(true)
        await sendOtpMutation.mutateAsync({ email })
        setCountdown(60)
        setCanResend(false)
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Lỗi', 'Gửi lại mã thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ImageBackground source={images.bgAuth} resizeMode="cover" className="h-full">
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <View className="mx-8">
        <Image source={images.logoOnboarding} className="h-[32px] w-[166px] mt-16" />
      </View>
      <View className="justify-center p-6 rounded-xl pt-48 pb-12">
        <Text className="text-center text-3xl font-normal mt-10">Kiểm tra email</Text>
        <Text className="mt-2 text-center text-gray-500">
          Chúng tôi đã gửi cho bạn một mã xác nhận. Vui lòng kiểm tra hộp thư đến của bạn tại
        </Text>
        <Text className="mb-6 font-bold text-center text-gray-500">{email}</Text>

        {/* Mã xác thực 6 ô */}
        <View className="flex-row justify-between mb-2 mt-4 px-2">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref
                }}
                className="w-[50px] h-[60px] rounded-xl border border-[#919EAB52] text-center text-[22px]"
                keyboardType="numeric"
                maxLength={1}
                value={code[index]}
                onChangeText={(text) => handleInput(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                editable={!isLoading}
              />
            ))}
        </View>

        <CustomButton
          title={isLoading ? 'Đang xử lý...' : 'Xác thực'}
          onPress={onSubmit}
          containerStyle={`w-full mt-7 mb-2 ${isLoading ? 'bg-[#FF9315]' : 'bg-[#FF9315]'} min-h-12`}
          textStyle="text-white"
          disabled={isLoading}
        />

        <TouchableOpacity
          className="flex-row gap-1 mt-4 flex mx-auto"
          onPress={handleResendCode}
          disabled={!canResend || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#734DBE" />
          ) : !canResend ? (
            <Text className="text-[#919EAB] font-semibold">{countdown}s</Text>
          ) : (
            <Text className="text-[#919EAB] font-semibold">Gửi lại</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row gap-1 mt-6 flex mx-auto"
          onPress={() => router.push(ERouteTable.SIGIN_IN)}
          disabled={isLoading}
        >
          <ArrowLeft2 size="20" color="black" />

          <Text className="text-sm font-semibold">Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

export default VerifyAccount
