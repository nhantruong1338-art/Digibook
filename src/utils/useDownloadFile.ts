import { useState, useCallback } from 'react'
import * as FileSystem from 'expo-file-system'
import { Alert } from 'react-native'

export function useDownloadFile() {
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  const downloadFile = useCallback(async (url: string, filename?: string) => {
    try {
      if (!url) {
        Alert.alert('Lỗi', 'Không có URL để tải.')
        return
      }

      setIsDownloading(true)
      setProgress(0)

      const safeFilename = filename || url.split('/').pop() || 'download.mp3'
      const fileUri = FileSystem.documentDirectory + safeFilename

      const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
        const progressPercent =
          downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
        setProgress(progressPercent)
      }

      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri, {}, callback)

      // @ts-ignore
      const { uri } = await downloadResumable.downloadAsync()
      console.log('File đã tải:', uri)
      return uri
    } catch (error) {
      console.error(error)
    } finally {
      setIsDownloading(false)
    }
  }, [])

  return { downloadFile, isDownloading, progress }
}
