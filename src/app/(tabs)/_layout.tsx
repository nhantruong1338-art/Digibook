import React from 'react'
import { Tabs } from 'expo-router'
import { View } from 'react-native'
import IconHomeActive from '~/assets/icon-svg/BottomTab/IconHomeActive'
import { LinearGradient } from 'expo-linear-gradient'
import IconArtist from '~/assets/icon-svg/BottomTab/IconArtist'
import IconLibrary from '~/assets/icon-svg/BottomTab/IconLibrary'
import MiniPlayer from '@/components/MiniPlayer'
import FloatingAssistant from '@/components/FloatingAssistant'
import { Book1, Home, User } from 'iconsax-react-native'

const TabsLayout = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFFD9" }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#734DBE',
          tabBarInactiveTintColor: '#64748B',
          tabBarStyle: {
            height: 100,
            paddingTop: 20,
            paddingHorizontal: 24,
            backgroundColor: '#FFFFFF',
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: '',
            tabBarIcon: ({ color }) => (
              <View className="mt-[27px] ml-2">
                {color === '#734DBE' ? (
                  <LinearGradient
                    colors={['#FF9315', '#FF9315']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      height: 52,
                      borderRadius: 9999,
                      justifyContent: 'center',
                      width: 107,
                      alignItems: 'center',
                    }}
                  >
                    <Home size="24" color="white" variant="Bold"/>
                  </LinearGradient>
                ) : (
                  <View className={`items-center h-[52px] justify-center rounded-full`}>
                    <Home size="24" color="#212B36" />
                  </View>
                )}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: '',
            tabBarIcon: ({ color }) => (
              <View className="mt-[27px] ml-2">
                {color === '#734DBE' ? (
                  <LinearGradient
                    colors={['#FF9315', '#FF9315']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      height: 52,
                      borderRadius: 9999,
                      justifyContent: 'center',
                      width: 107,
                      alignItems: 'center',
                    }}
                  >
                    <Book1 size="24" color="white" variant="Bold"/>
                  </LinearGradient>
                ) : (
                  <View className={`items-center h-[52px] justify-center rounded-full`}>
                    <Book1 size="24" color="#212B36"/>
                  </View>
                )}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="artist"
          options={{
            title: '',
            tabBarIcon: ({ color }) => (
              <View className="mt-[27px] ml-2">
                {color === '#734DBE' ? (
                  <LinearGradient
                    colors={['#FF9315', '#FF9315']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      height: 52,
                      borderRadius: 9999,
                      justifyContent: 'center',
                      width: 107,
                      alignItems: 'center',
                    }}
                  >
                    <User size="24" color="white" variant="Bold" />
                  </LinearGradient>
                ) : (
                  <View className={`items-center h-[52px] justify-center rounded-full`}>
                    <User size="24" color="#212B36" />
                  </View>
                )}
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  )
}

export default TabsLayout
