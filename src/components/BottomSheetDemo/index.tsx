import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { View, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native'
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'

interface CustomBottomSheetProps {
  children?: React.ReactNode
  maxHeight?: any
  isVisible?: boolean
  onClose?: () => void
}

const CustomBottomSheet = ({
  children,
  maxHeight = '40%',
  isVisible = false,
  onClose,
}: CustomBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  console.log('CustomBottomSheet rendered with isVisible:', isVisible)

  useEffect(() => {
    console.log('isVisible changed to:', isVisible)
    if (isVisible) {
      bottomSheetRef.current?.expand()
    } else {
      bottomSheetRef.current?.close()
    }
  }, [isVisible])

  // Fallback sử dụng Modal nếu BottomSheet không hoạt động
  if (!isVisible) {
    return null
  }

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={[styles.modalContent, { minHeight: maxHeight }]}>
          <View style={styles.contentContainer}>{children}</View>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    flex: 1,
    borderColor: '#374151',
  },
  indicator: {
    backgroundColor: '#919EAB',
    width: 40,
    height: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#161C247A',
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    maxHeight: '80%',
  },
})

export default CustomBottomSheet
