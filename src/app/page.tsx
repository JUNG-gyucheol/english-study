'use client'

import FileUpload from '@/components/fileupload'

export default function Home() {
  // const takePhoto = async () => {
  //   const canvas = document.createElement('canvas')
  //   const video = videoRef.current
  //   if (!video) return

  //   canvas.width = video.videoWidth
  //   canvas.height = video.videoHeight

  //   const ctx = canvas.getContext('2d')
  //   ctx?.drawImage(video, 0, 0)

  //   // Canvas를 blob으로 변환
  //   const blob = await new Promise<Blob>((resolve) => {
  //     canvas.toBlob((blob) => {
  //       resolve(blob as Blob)
  //     }, 'image/png')
  //   })

  //   // Blob으로부터 File 객체 생성
  //   // const file = new File([blob], 'photo.png', {
  //   //   type: 'image/png',
  //   // })

  //   const imageUrl = URL.createObjectURL(blob)
  //   setPhoto(imageUrl)

  //   // 파일 업로드 호출
  //   const uploadedUrl = await uploadImage()
  //   console.log('Uploaded URL:', uploadedUrl)

  //   if (uploadedUrl) {
  //     fetch('/api/word', {
  //       method: 'POST',
  //       body: JSON.stringify({ image: uploadedUrl }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data)
  //         const parsedData = JSON.parse(data)
  //         console.log(parsedData)
  //         setData(parsedData)
  //       })
  //   }

  //   // // 메모리 정리
  //   URL.revokeObjectURL(imageUrl)
  // }

  // const createExample = (word: string) => {
  //   fetch('/api/example', {
  //     method: 'POST',
  //     body: JSON.stringify({ word }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data)
  //       const parsedData = JSON.parse(data)
  //       console.log(parsedData)
  //     })
  // }

  return (
    <div>
      <div></div>
      <FileUpload />
      {/* <div>
        <button>Test</button>
      </div> */}
    </div>
  )
}
