import { deleteImage, uploadToSupabase } from '@/lib/supabaseImage'
import { useState, useCallback } from 'react'
import ImageSwipe from '../imageSwipe'
import { toastListAtom } from '@/store/toastStore'
import { useAtom } from 'jotai'
import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'
import { AiOutlinePicture } from 'react-icons/ai'
import { useRouter } from 'next/navigation'

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [words, setWords] = useState<{ [key: string]: string }>()
  const [isDragOver, setIsDragOver] = useState(false)
  const [toastList, setToastList] = useAtom(toastListAtom)
  const [title, setTitle] = useState('')
  const router = useRouter()
  // 파일 유효성 검사
  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      setToastList([
        ...toastList,
        {
          status: 'error',
          message: 'Unsupported file type',
        },
      ])
      return false
    }

    if (file.size > maxSize) {
      setToastList([
        ...toastList,
        {
          status: 'error',
          message: 'File size is too large',
        },
      ])
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

      if (successfulUrls.length > 0) {
        // API 호출
        const res = await fetch('/api/word', {
          method: 'POST',
          body: JSON.stringify({ images: successfulUrls }),
        })
        const data = await res.json()
        setToastList([
          ...toastList,
          {
            status: 'success',
            message: 'Extracted successfully',
          },
        ])
        setWords(data)
        deleteImage()
      }
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

  const handleSave = async () => {
    if (!words) return
    try {
      const { data } = await supabase
        .from('words')
        .select('*')
        .lte('updated_at', dayjs().toISOString())
        .gte('updated_at', dayjs(dayjs().format('YYYY-MM-DD')).toISOString())
        .limit(1)
        .single<{ words: string; id: number }>()

      if (data) {
        const wordsData = { ...JSON.parse(data.words), ...words }
        await supabase
          .from('words')
          .update({
            words: JSON.stringify(wordsData),
            updated_at: dayjs().toISOString(),
            title: title || dayjs().format('YYYY-MM-DD'),
          })
          .eq('id', data.id)
      } else {
        await supabase.from('words').insert({
          words: JSON.stringify(words),
          title: title || dayjs().format('YYYY-MM-DD'),
        })
      }
      setToastList([
        ...toastList,
        {
          status: 'success',
          message: 'Saved successfully',
        },
      ])
      router.push('/')
    } catch (error) {
      console.error('Save failed:', error)
      setToastList([
        ...toastList,
        {
          status: 'error',
          message: 'Save failed',
        },
      ])
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-[24px] px-[10px]">
      <div className="flex flex-col gap-[4px]">
        <span className="text-[20px] font-semibold">Title</span>
        <input
          type="text"
          className="border-gray-3 w-full rounded-[10px] border px-[8px] py-[4px] outline-none"
          value={title}
          placeholder={`${dayjs().format('YYYY-MM-DD')}`}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {/* 드래그 앤 드롭 영역 */}
      <div className="flex flex-col gap-[4px]">
        <div>
          <span className="text-[20px] font-semibold">Extract words</span>
        </div>
        <div
          className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-3 hover:border-gray-2'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          <div className="flex flex-col items-center justify-center">
            <div className="text-[100px]">
              <AiOutlinePicture className="text-gray-2" />
            </div>
            <div>
              {/* <p className="text-lg font-medium">
                {isDragOver
                  ? '파일을 여기에 놓으세요'
                  : '파일을 드래그하거나 클릭하여 선택하세요'}
              </p> */}
              <p className="text-gray-2 mt-2 text-sm">
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
      </div>

      {/* 선택된 파일 목록 */}
      {files.length > 0 && (
        <ImageSwipe files={files} previews={previews} removeFile={removeFile} />
      )}

      {/* 업로드 버튼 */}
      <div className="mt-0 text-center">
        <button
          onClick={handleUpload}
          disabled={isUploading || files.length === 0}
          className="hover:bg-blue-2 bg-blue-1 disabled:bg-gray-2 text-white-1 cursor-pointer rounded-lg px-8 py-[4px] font-semibold transition-all duration-300 disabled:cursor-not-allowed">
          {isUploading ? 'Extracting...' : 'Extract'}
        </button>
      </div>

      {/* 결과 표시 */}
      <div className="mt-0">
        <h3 className="mb-4 text-[20px] font-semibold">Words</h3>
        {words ? (
          Array.from({
            length: Math.ceil(Object.entries(words).length / 2),
          }).map((_, rowIndex) => {
            return (
              <div className="mb-[4px] flex gap-[4px]" key={`row-${rowIndex}`}>
                {Array.from({ length: 2 }).map((_, colIndex) => {
                  try {
                    const [key, value] =
                      Object.entries(words)[rowIndex * 2 + colIndex]
                    return (
                      <div
                        key={`col-${colIndex + rowIndex}`}
                        className="bg-white-1 w-full rounded-lg p-4 text-center transition-colors">
                        <div className="text-[18px] font-bold text-black">
                          {key}
                        </div>
                        <div className="mt-1 text-sm text-black">{value}</div>
                      </div>
                    )
                  } catch (error) {
                    console.log(error)
                    return null
                  }
                })}
              </div>
            )
          })
        ) : (
          <div className="gr flex h-full grid-cols-none items-center justify-center">
            <span className="text-gray-2">No words</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-[30px] left-[50%] w-full -translate-x-1/2 px-[14px]">
        <div
          onClick={() => handleSave()}
          className="w-full cursor-pointer rounded-[10px] bg-[#4e73df] py-[10px] text-center text-[16px] font-semibold text-white transition-all duration-300 hover:bg-[#2e59d9]">
          <span className="font-merriweather text-white-1">SAVE</span>
        </div>
      </div>
    </div>
  )
}

export default FileUpload
