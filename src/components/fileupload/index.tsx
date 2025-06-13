import { deleteImage, uploadToSupabase } from '@/lib/supabaseImage'
import { useState, useCallback } from 'react'
import ImageSwipe from '../imageSwipe'

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [words, setWords] = useState<{ [key: string]: string }>()
  const [isDragOver, setIsDragOver] = useState(false)

  // 파일 유효성 검사
  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert(
        `${file.name}: 지원하지 않는 파일 형식입니다. (JPEG, PNG, GIF, WebP만 가능)`,
      )
      return false
    }

    if (file.size > maxSize) {
      alert(`${file.name}: 파일 크기가 너무 큽니다. (최대 5MB)`)
      return false
    }

    return true
  }

  // 파일 처리 함수
  const processFiles = useCallback(
    (selectedFiles: FileList | File[]) => {
      const validFiles = Array.from(selectedFiles).filter(validateFile)

      if (validFiles.length === 0) return

      setFiles(validFiles)

      // 이전 미리보기 URL들 정리
      previews.forEach((url) => URL.revokeObjectURL(url))

      // 새로운 미리보기 URL 생성
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file))
      setPreviews(newPreviews)
    },
    [previews],
  )

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      processFiles(selectedFiles)
    }
  }

  // 드래그 앤 드롭 핸들러
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles)
      }
    },
    [processFiles],
  )

  // 파일 업로드
  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)

    try {
      // 모든 파일 동시에 업로드
      const uploadPromises = files.map((file) => uploadToSupabase(file))
      const urls = await Promise.all(uploadPromises)

      // null 값 필터링 (업로드 실패한 경우)
      const successfulUrls = urls.map((v) => v?.url as string).filter(Boolean)

      console.log(successfulUrls)

      if (successfulUrls.length > 0) {
        // API 호출
        fetch('/api/word', {
          method: 'POST',
          body: JSON.stringify({ images: successfulUrls }),
        })
          .then((res) => res.json())
          .then((data) => {
            setWords(data)
            deleteImage()
          })
      }

      // 성공 메시지
      alert(`${successfulUrls.length}개의 파일이 업로드되었습니다.`)

      // 파일 선택 초기화
      setFiles([])
      setPreviews([])
    } catch (error) {
      console.error('Upload failed:', error)
      alert('업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  // 개별 파일 제거
  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)

    // 제거된 파일의 URL 정리
    URL.revokeObjectURL(previews[index])

    setFiles(newFiles)
    setPreviews(newPreviews)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-[10px] px-[10px]">
      <div>
        <span className="text-[20px] font-semibold">Extract words</span>
      </div>
      {/* 드래그 앤 드롭 영역 */}
      <div
        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <div className="space-y-4">
          <div className="text-6xl">📁</div>
          <div>
            <p className="text-lg font-medium">
              {isDragOver
                ? '파일을 여기에 놓으세요'
                : '파일을 드래그하거나 클릭하여 선택하세요'}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              JPEG, PNG, GIF, WebP 파일 (최대 5MB)
            </p>
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
            id="file-input"
            disabled={isUploading}
          />
        </div>
      </div>

      {/* 업로드 진행률 */}
      {/* {isUploading && (
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>업로드 중...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )} */}

      {/* 선택된 파일 목록 */}
      {files.length > 0 && (
        <ImageSwipe files={files} previews={previews} removeFile={removeFile} />
      )}

      {/* 업로드 버튼 */}
      <div className="mt-6 text-center">
        <button
          onClick={handleUpload}
          disabled={isUploading || files.length === 0}
          className="rounded-lg bg-green-500 px-8 py-3 text-lg font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400">
          {isUploading ? '업로드 중...' : '단어'}
        </button>
      </div>

      {/* 결과 표시 */}
      {words && (
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-semibold">인식된 단어</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Object.entries(words).map(([key, value]) => (
              <div
                key={key}
                className="cursor-pointer rounded-lg border border-blue-200 bg-blue-50 p-4 text-center transition-colors hover:bg-blue-100">
                <div className="font-medium text-blue-800">{key}</div>
                <div className="mt-1 text-sm text-blue-600">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload
