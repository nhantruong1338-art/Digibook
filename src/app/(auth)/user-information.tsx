import React from 'react'
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
} from 'react-native'
import { useRouter } from 'expo-router'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import CustomButton from '@/components/CustomButton'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import IconUploadImage from '~/assets/icon-svg/IconUploadImage'
import { useAuth } from '@/hooks/useAuth'

// Define validation schema
const schema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên của bạn'),
})

type FormData = {
  name: string
}

const UserInformation = () => {
  const router = useRouter()
  const { updateProfileMutation } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await updateProfileMutation.mutateAsync({ fullName: data.name })
      // After successful profile update, navigate to home
      router.replace(ERouteTable.HOME)
    } catch (error) {
      console.error(error)
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin.')
    }
  }

  return (
    <ImageBackground source={images.bgAuth} resizeMode="cover" className="h-full">
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <View className="mx-8">
        <Image source={images.logoOnboarding} className="h-[32px] w-[166px] mt-16" />
      </View>
      <View className="justify-center p-6 rounded-xl pt-48 pb-12">
        <Text className="text-center text-3xl font-normal mt-10">
          Hãy cho chúng tôi biết về bạn
        </Text>

        <TouchableOpacity className="flex-row gap-3 items-center justify-center mt-10 mb-6">
          <IconUploadImage />
          <View>
            <Text className="">Tối thiểu 300x300px</Text>
            <Text className="text-[#637381]">JPG hoặc PNG. Tối đa 2MB.</Text>
          </View>
        </TouchableOpacity>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <View>
              <Text className="my-2 ml-2">Tên của bạn</Text>
              <TextInput
                className="border border-[#919EAB52] rounded-xl px-4 py-3 mb-1 text-base"
                placeholderTextColor="#94A3B8"
                placeholder="Tên của bạn"
                onChangeText={onChange}
                value={value}
                editable={!updateProfileMutation.isPending}
              />
              {errors.name && (
                <Text className="text-red-500 text-sm mb-2">{errors.name.message}</Text>
              )}
            </View>
          )}
        />

        <CustomButton
          title={updateProfileMutation.isPending ? 'Đang xử lý...' : 'Tiếp tục'}
          onPress={handleSubmit(onSubmit)}
          containerStyle={`w-full mt-7 mb-2 bg-[#FF9315] min-h-12`}
          textStyle="text-white"
          disabled={updateProfileMutation.isPending}
        />

        <TouchableOpacity
          className="flex-row gap-1 mt-6 flex mx-auto"
          onPress={() => router.push(ERouteTable.HOME)}
          disabled={updateProfileMutation.isPending}
        >
          <Text className="text-[#919EAB] text-sm">Bỏ qua</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

export default UserInformation
