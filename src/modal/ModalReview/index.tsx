import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import ModalComponent from '@/components/ModalComponent'
import StarRating from '@/components/StarComponent'
import ModalComponentUser from '@/components/ModalComponentUser'

interface IModalReviewProps {
  visible: boolean
  onClose: () => void
  onSubmit: (rating: number, comment: string) => void
  isLoading?: boolean
}

export default function ModalReview({ visible, onClose, onSubmit, isLoading = false }: IModalReviewProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const maxCommentLength = 300

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment)
      // Reset form after submission
      setRating(0)
      setComment('')
    }
  }

  const handleClose = () => {
    // Reset form when closing
    setRating(0)
    setComment('')
    onClose()
  }

  return (
    <ModalComponentUser visible={visible} onClose={handleClose} height="50%">
      <View className="mt-8">
        {/* Header */}
        <View className="flex-row justify-center items-center mb-6">
          <Text className="text-2xl font-bold text-center text-[#212B36]">Đánh giá và nhận xét</Text>
        </View>

        {/* Rating Section */}
        <View className="mb-6 w-full">
          <View className="flex-row items-center gap-3 mb-3">
            <Text className="text-base font-semibold text-[#212B36]">Đánh giá</Text>
            <StarRating
              rating={rating}
              editable={true}
              onChange={setRating}
              size={24}
              color="#FF9800"
              inactiveColor="#D1D5DB"
            />
          </View>
        </View>

        {/* Comment Section */}
        <View className="mb-6">
          <Text className="text-base text-[#212B36] font-semibold mb-3">Nhận xét</Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Viết nhận xét"
            placeholderTextColor="#919EAB"
            multiline
            numberOfLines={4}
            maxLength={maxCommentLength}
            style={styles.commentInput}
            textAlignVertical="top"
          />
          <Text className="text-center text-sm text-[#919EAB] mt-2">
            {comment.length}/{maxCommentLength}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.submitButton,
              rating === 0 && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={isLoading || rating === 0}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Đang gửi...' : 'Gửi nhận xét'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalComponentUser>
  )
}

const styles = StyleSheet.create({
  commentInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#212B36',
    backgroundColor: '#FFFFFF',
    minHeight: 100,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212B36',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FF9315',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})
