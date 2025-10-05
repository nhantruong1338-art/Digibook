import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import IconBot from '~/assets/icon-svg/IconBot'
import ModalBotMusic from '@/modal/ModalBotMusic'

export default function FloatingAssistant() {
  const [modalVisible, setModalVisible] = useState(false);
  const pan = useRef(new Animated.ValueXY({ x: 350, y: 700 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event<[GestureResponderEvent, PanResponderGestureState]>(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Animated.View
        className="absolute w-16 h-16 rounded-full bg-[#B1FF4D] justify-center items-center shadow-lg"
        style={{ transform: [{ translateX: pan.x }, { translateY: pan.y }] }}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity 
          className="flex-1 justify-center items-center"
          onPress={handleOpenModal}
        >
          <IconBot />
        </TouchableOpacity>
      </Animated.View>
      
      <ModalBotMusic
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </>
  );
}
