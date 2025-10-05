import { Image, ImageBackground, Pressable, StatusBar, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { images } from '@/constants'
import { useAuth } from '@/hooks/useAuth'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import IconGoogle from '~/assets/icon-svg/IconGoogle'
import { LinearGradient } from 'expo-linear-gradient'

// Define validation schema
const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
})

type FormData = {
  email: string
}

const SignIn = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { sendOtpMutation } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: 'tuan209200@gmail.com',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      await sendOtpMutation.mutateAsync(data)
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading(false)
    }
    // router.replace(ERouteTable.HOME)
  }

  return (
    <ImageBackground source={images.bgAuth} resizeMode="cover" className="h-full">
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <View className="mx-8">
        <Image source={images.logoOnboarding} className="h-[32px] w-[166px] mt-16" />
      </View>
      <View className="justify-center p-8 rounded-3xl pt-48 pb-12">
        <Text className="text-3xl mb-3 text-center">Đăng nhập</Text>

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className={`bg-[#919EAB14] h-12 flex-row items-center justify-center gap-2 mt-4 py-3 rounded-xl ${loading ? 'opacity-50' : ''}`}
        >
          <IconGoogle />
          <Text className="text-[#637381] text-center text-base">Đăng nhập bằng Google</Text>
        </Pressable>
        <Text className="text-[#637381] text-center text-base my-6">
          Hoặc sử dụng email của bạn
        </Text>

        {/* Email Input */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View className="mb-6">
              <Text className="my-2 ml-2">Email</Text>
              <TextInput
                placeholderTextColor="#637381"
                placeholder="Nhập email để nhận mã OTP"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                className="border border-[#919EAB52] h-14 text-[#919EAB] rounded-2xl px-4 mb-2 text-base"
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mb-2">{errors.email.message}</Text>
              )}
            </View>
          )}
        />
        <Pressable onPress={handleSubmit(onSubmit)} disabled={loading}>
          <LinearGradient
            colors={['#FF9315', '#FF9315']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 48,
              borderRadius: 16,
              justifyContent: 'center',
              opacity: loading ? 0.5 : 1,
            }}
          >
            <Text className="text-white text-center text-base font-semibold">
              {loading ? 'Đăng nhập...' : 'Đăng nhập'}
            </Text>
          </LinearGradient>
        </Pressable>
        <Pressable onPress={() => router.push(ERouteTable.SIGIN_UP)}>
          <Text className="text-center text-sm text-[#6B7280] mt-6">
            Bạn chưa có tài khoản? <Text className="underline text-[#212B36]">Đăng ký</Text>
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

export default SignIn
