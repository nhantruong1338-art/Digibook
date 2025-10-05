import { StatusBar, Text, View } from 'react-native'
import HeaderComponentText from '@/components/HeaderComponentText'
import React from 'react'

export default function SupportScreen() {
  return (
    <View>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderComponentText title="Hỗ trợ" />
      <View className="px-4 mt-8">
        <Text className="text-[#637381]">Cập nhật lần cuối: 01/07/2025</Text>
        <Text className="text-[#637381] my-2">
          Chào mừng bạn! Các điều khoản và điều kiện này quản lý việc bạn truy cập và sử dụng ứng
          dụng nghe nhạc của chúng tôi. Bằng cách truy cập hoặc sử dụng Ứng dụng, bạn đồng ý bị ràng
          buộc bởi các Điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào của các Điều khoản
          này, bạn không được sử dụng Ứng dụng.
        </Text>
        <Text className="text-[#212B36] my-2 font-semibold">1. Chấp nhận các Điều khoản</Text>
        <Text className="text-[#637381]">
          Bằng cách sử dụng Ứng dụng, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi
          các Điều khoản này và Chính sách bảo mật của chúng tôi. Nếu bạn đang sử dụng Ứng dụng thay
          mặt cho một tổ chức, bạn tuyên bố và bảo đảm rằng bạn có quyền chấp nhận các Điều khoản
          này thay mặt cho tổ chức đó.
        </Text>
        <Text className="text-[#212B36] my-2 font-semibold">2. Thay đổi Điều khoản</Text>
        <Text className="text-[#637381]">
          Chúng tôi có quyền sửa đổi hoặc thay thế các Điều khoản này bất kỳ lúc nào theo quyết định
          riêng của chúng tôi. Nếu một bản sửa đổi là quan trọng, chúng tôi sẽ nỗ lực hợp lý để cung
          cấp thông báo ít nhất 30 ngày trước khi bất kỳ điều khoản mới nào có hiệu lực. Việc bạn
          tiếp tục truy cập hoặc sử dụng Ứng dụng sau khi các bản sửa đổi có hiệu lực sẽ cấu thành
          sự chấp nhận của bạn đối với các Điều khoản đã sửa đổi.
        </Text>
        <Text className="text-[#212B36] my-2 font-semibold">3. Truy cập và sử dụng Ứng dụng</Text>
        <Text className="text-[#637381]">
          Đủ điều kiện: Bạn phải đủ 13 tuổi để sử dụng Ứng dụng. Bằng cách sử dụng Ứng dụng, bạn
          tuyên bố và bảo đảm rằng bạn đáp ứng yêu cầu về độ tuổi này.
        </Text>
      </View>
    </View>
  )
}
