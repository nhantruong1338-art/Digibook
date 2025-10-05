import React from 'react'
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native'
import IconClose from '~/assets/icon-svg/IconClose'

const ModalComponent = ({ visible, onClose, children, height = '30%' }: any) => {
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View className="relative">
          <TouchableOpacity onPress={onClose} className="absolute z-10 left-[35%] top-4">
            <IconClose />
          </TouchableOpacity>
        </View>
        <View style={[styles.modalContainer, { height: height }]}>
          <View>{children}</View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute', // Full screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // Màu nền mờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
    backgroundColor: '#FFFFFF',
  },
})

export default ModalComponent
