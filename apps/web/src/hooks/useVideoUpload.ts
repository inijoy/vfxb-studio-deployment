import { useCallback, useRef } from 'react'
import { api } from '../lib/api'
import { useVideoStore } from '../store/video'
import { useUIStore } from '../store/ui'

const ALLOWED_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'video/mpeg',
]

interface UseVideoUploadReturn {
  upload: (file: File) => Promise<string | null>
  isUploading: boolean
  progress: number
  cancel: () => void
}

export function useVideoUpload(): UseVideoUploadReturn {
  const abortRef = useRef<AbortController | null>(null)
  const { isUploading, uploadProgress, setIsUploading, setUploadProgress, setUploadVideoId, setIsProcessing, pollVideoStatus } =
    useVideoStore()
  const { setActiveView } = useUIStore()

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    setIsUploading(false)
    setUploadProgress(0)
  }, [setIsUploading, setUploadProgress])

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(`Unsupported file type: ${file.type}`)
      }
      if (file.size > 10 * 1024 * 1024 * 1024) {
        throw new Error('File exceeds 10 GB limit')
      }

      abortRef.current = new AbortController()
      setIsUploading(true)
      setUploadProgress(0)

      try {
        // Step 1: get presigned upload URL + video_id from API
        const { upload_url, video_id } = await api.post<{
          upload_url: string
          video_id: string
        }>('/api/upload/presigned', {
          filename: file.name,
          filetype: file.type,
          filesize: file.size,
        })

        setUploadVideoId(video_id)

        // Step 2: upload directly to R2 via single presigned PUT
        const xhr = new XMLHttpRequest()
        await new Promise<void>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              setUploadProgress(Math.round((e.loaded / e.total) * 90))
            }
          })
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve()
            else reject(new Error(`R2 upload failed: ${xhr.status}`))
          })
          xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
          xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')))

          xhr.open('PUT', upload_url)
          xhr.setRequestHeader('Content-Type', file.type)
          xhr.send(file)

          abortRef.current?.signal.addEventListener('abort', () => xhr.abort())
        })

        setUploadProgress(95)

        // Step 3: notify API that upload is complete → triggers analysis pipeline
        await api.post('/api/upload/complete', { video_id })

        setUploadProgress(100)
        setIsUploading(false)
        setIsProcessing(true)

        // Navigate to studio view and start polling for analysis completion
        setActiveView('studio')
        pollVideoStatus(video_id)

        return video_id
      } catch (err) {
        setIsUploading(false)
        setUploadProgress(0)
        throw err
      }
    },
    [setIsUploading, setUploadProgress, setUploadVideoId, setIsProcessing, setActiveView, pollVideoStatus],
  )

  return { upload, isUploading, progress: uploadProgress, cancel }
}
