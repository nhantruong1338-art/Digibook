import React from 'react'
import { Modal, View, StyleSheet } from 'react-native'

const ModalComponentUser = ({ visible, onClose, children, height = '30%' }: any) => {
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { height: height }]}>
          <View className="w-full">{children}</View>
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
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    elevation: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 120,
  },
})

export default ModalComponentUser
