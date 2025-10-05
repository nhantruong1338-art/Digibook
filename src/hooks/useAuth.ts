import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore'
import API_CLIENT from '@/libs/api/client'
import { AuthRoutes } from '@/libs/api/routes/auth-routes'
import { _queryClient } from '@/context/QueryProvider'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { useToast } from '@/components/ToastNotify/ToastContext'

export function useAuth() {
  const { setUser, setToken, token, setRefreshToken } = useAuthStore()
  const router = useRouter()
  const { showToast } = useToast()

  const sendOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await API_CLIENT.post(AuthRoutes.auth.sendOtp, {
        email: email,
      })
      return response.data
    },
    onSuccess: (res, variables) => {
      showToast('OTP đã được gửi đến email của bạn!', 'success')
      router.push({
        pathname: ERouteTable.VERIFY_ACCOUNT,
        params: { email: variables.email },
      })
    },
    onError: (error) => {
      console.log(error)
      showToast('Có lỗi xảy ra vui lòng thử lại!', 'error')
    },
  })

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ email, otpCode }: { email: string; otpCode: string }) => {
      console.log('Verifying OTP with:', { email, otp: otpCode })
      const response = await API_CLIENT.post(AuthRoutes.auth.verifyOtp, {
        email: email,
        otp: otpCode,
      })
      return response.data
    },
    onSuccess: async (response: any) => {
      console.log('OTP verification response:', response)

      // Handle the backend response structure
      if (response.success && response.data?.loginResponse) {
        const { loginResponse } = response.data
        const { accessToken, refreshToken, user } = loginResponse

        if (accessToken && refreshToken) {
          // Store tokens
          setToken(accessToken)
          setRefreshToken(refreshToken)

          // Store user data
          setUser(user)

          await _queryClient.invalidateQueries({ queryKey: ['user'] })
          showToast('Xác thực thành công!', 'success')
        } else {
          showToast('Xác thực thành công!', 'success')
        }
      } else {
        showToast('Xác thực thành công!', 'success')
      }
    },
    onError: (error) => {
      console.log('OTP verification error:', error)
      showToast('Mã OTP không hợp lệ!', 'error')
    },
  })

  // ✅ Fetch authenticated user
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const profileRes = await API_CLIENT.get(AuthRoutes.auth.me)
        setUser(profileRes.data)
        return profileRes.data || null
      } catch (error) {
        console.error('Error fetching user:', error)
        return null
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false,
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { fullName: string; avatar?: string }) => {
      const response = await API_CLIENT.patch(AuthRoutes.auth.updateProfile, data)
      return response.data
    },
    onSuccess: async (response: any) => {
      if (response.success && response.data) {
        setUser(response.data)
        await _queryClient.invalidateQueries({ queryKey: ['user'] })
        showToast('Cập nhật thông tin thành công!', 'success')
      }
    },
    onError: (error) => {
      console.log('Update profile error:', error)
      showToast('Có lỗi xảy ra khi cập nhật thông tin!', 'error')
    },
  })

  return {
    sendOtpMutation,
    userQuery,
    verifyOtpMutation,
    updateProfileMutation,
  }
}
