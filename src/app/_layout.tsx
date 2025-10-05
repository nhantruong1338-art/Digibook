import { Stack } from 'expo-router'
import { View } from 'react-native'
import '~/global.css'
import { QueryProvider } from '@/context/QueryProvider'
import { ToastProvider } from '@/components/ToastNotify/ToastContext'
import { StatusBar } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <ToastProvider>
          <View className="flex-1">
            <StatusBar translucent barStyle="light-content" backgroundColor="#FFFFFFD9" />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </View>
        </ToastProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  )
}
