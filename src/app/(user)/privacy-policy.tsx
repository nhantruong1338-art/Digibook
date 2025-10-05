import { StatusBar, Text, View } from 'react-native'
import HeaderComponentText from '@/components/HeaderComponentText'
import React from 'react'

export default function PrivacyPolicy() {
  return (
    <View>
      <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
      <HeaderComponentText title="Chính sách bảo mật" />
      <View className="px-4 mt-8">
        <Text className="text-[#637381]">Cập nhật lần cuối: 01/07/2025</Text>
        <Text className="text-[#637381] my-2">
          Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng và chia sẻ thông tin của bạn
          khi bạn sử dụng ứng dụng nghe nhạc của chúng tôi.
        </Text>
        <Text className="text-[#212B36] my-2 font-semibold">1. Thông tin chúng tôi thu thập</Text>
        <Text className="text-[#637381]">
          Chúng tôi có thể thu thập các loại thông tin sau: {'\n'}
          {'\n'}
          Thông tin cá nhân bạn cung cấp trực tiếp:
          {'\n'}
          {'\n'}- Thông tin tài khoản: Khi bạn đăng ký tài khoản, chúng tôi có thể thu thập tên
          người dùng, địa chỉ email, mật khẩu (được mã hóa) và bất kỳ thông tin hồ sơ nào bạn chọn
          cung cấp (ví dụ: ảnh đại diện). {'\n'}- Thông tin thanh toán: Nếu bạn mua các tính năng
          cao cấp hoặc đăng ký dịch vụ, chúng tôi hoặc các đối tác xử lý thanh toán của chúng tôi sẽ
          thu thập thông tin thanh toán của bạn (ví dụ: số thẻ tín dụng, ngày hết hạn). Chúng tôi
          không lưu trữ thông tin thẻ tín dụng đầy đủ trên máy chủ của mình. {'\n'}- Liên hệ hỗ trợ:
          Nếu bạn liên hệ với chúng tôi để được hỗ trợ, chúng tôi sẽ thu thập thông tin bạn cung cấp
          trong quá trình liên hệ. {'\n'}
          {'\n'}
          Thông tin tự động thu thập: {'\n'}
          {'\n'}- Dữ liệu sử dụng: Chúng tôi thu thập thông tin về cách bạn tương tác với Ứng dụng,
          bao gồm các bài hát bạn nghe, danh sách phát bạn tạo, thời lượng nghe, tính năng bạn sử
          dụng và thời gian bạn dành cho Ứng dụng.{'\n'}- Thông tin thiết bị: Chúng tôi có thể thu
          thập thông tin về thiết bị bạn sử dụng để truy cập Ứng dụng, bao gồm kiểu thiết bị, hệ
          điều hành, địa chỉ IP, nhận dạng thiết bị duy nhất và dữ liệu mạng di động.{'\n'}- Dữ liệu
          nhật ký: Khi bạn sử dụng Ứng dụng, máy chủ của chúng tôi tự động ghi lại thông tin ("dữ
          liệu nhật ký") bao gồm địa chỉ IP của bạn, loại trình duyệt, nhà cung cấp dịch vụ
          Internet, trang tham chiếu/thoát, dấu thời gian và dữ liệu clickstream.{'\n'}
          {'\n'}
          Thông tin từ các nguồn bên thứ ba:{'\n'}
          {'\n'}- Nếu bạn chọn đăng nhập bằng tài khoản mạng xã hội (ví dụ: Google, Facebook), chúng
          tôi có thể nhận được thông tin nhất định từ các dịch vụ đó theo cài đặt quyền riêng tư của
          bạn.
        </Text>
      </View>
    </View>
  )
}
