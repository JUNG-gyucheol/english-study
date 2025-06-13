import { deleteImage, uploadToSupabase } from '@/lib/supabaseImage'
import Image from 'next/image'
import { useState } from 'react'

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [words, setWords] = useState<{ [key: string]: string }>()

  // 파일 선택 시 미리보기 설정
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(selectedFiles)

    // 이전 미리보기 URL들 정리
    previews.forEach((url) => URL.revokeObjectURL(url))

    // 새로운 미리보기 URL 생성
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
    setPreviews(newPreviews)
  }

  // 파일 업로드
  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    try {
      // 모든 파일 동시에 업로드
      const uploadPromises = files.map((file) => uploadToSupabase(file))
      const urls = await Promise.all(uploadPromises)

      // null 값 필터링 (업로드 실패한 경우)
      const successfulUrls = urls.map((v) => v?.url as string)

      console.log(successfulUrls)
      // 성공 메시지
      alert(`${successfulUrls.length}개의 파일이 업로드되었습니다.`)

      if (successfulUrls) {
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

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">파일 업로드</h2>

      {/* 파일 선택 */}
      <input
        type="file"
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="mb-4"
        disabled={isUploading}
      />

      {/* 미리보기 이미지 */}
      {previews.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">미리보기:</h3>
          <div className="grid grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 업로드 버튼 */}
      <button
        onClick={handleUpload}
        disabled={isUploading || files.length === 0}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400">
        {isUploading ? '업로드 중...' : '단어 변환'}
      </button>

      <div>
        {words &&
          Object.entries(words).map(([key, value]) => (
            <div key={key} className="flex gap-[12px]">
              <h3>{key}</h3>
              <p>{value}</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default FileUpload
