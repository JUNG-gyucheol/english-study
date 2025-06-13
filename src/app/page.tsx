'use client'

import FileUpload from '@/components/fileupload'
import { supabase } from '@/lib/supabase'
import { useRef, useState } from 'react'

async function uploadImage() {
  // const filePath = `uploads/${Date.now()}_${file.name}`

  const { data: bucketData, error: bucketError } =
    await supabase.storage.createBucket('photos')
  console.log(bucketData, bucketError)

  // const { error } = await supabase.storage
  //   .from('photos')
  //   .upload(filePath, file, {
  //     cacheControl: '3600',
  //     upsert: false,
  //   })

  // console.log('upload', error)

  // if (error) {
  //   console.error('업로드 에러:', error)
  //   return null
  // }

  // public URL 가져오기
  // const { data: publicUrlData } = supabase.storage
  //   .from('photos')
  //   .getPublicUrl(filePath)
  const { data: publicUrlData } = await supabase.storage
    .from('photos')
    .createSignedUrl('uploads/e.jpg', 60)

  console.log(publicUrlData)
  return publicUrlData?.signedUrl
  // return publicUrlData.publicUrl // 이미지 URL 반환
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [, setPhoto] = useState<string>()
  const [data, setData] = useState<{ [key: string]: string }>()

  const takePhoto = async () => {
    const canvas = document.createElement('canvas')
    const video = videoRef.current
    if (!video) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    ctx?.drawImage(video, 0, 0)

    // Canvas를 blob으로 변환
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob as Blob)
      }, 'image/png')
    })

    // Blob으로부터 File 객체 생성
    // const file = new File([blob], 'photo.png', {
    //   type: 'image/png',
    // })

    const imageUrl = URL.createObjectURL(blob)
    setPhoto(imageUrl)

    // 파일 업로드 호출
    const uploadedUrl = await uploadImage()
    console.log('Uploaded URL:', uploadedUrl)

    if (uploadedUrl) {
      fetch('/api/word', {
        method: 'POST',
        body: JSON.stringify({ image: uploadedUrl }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          const parsedData = JSON.parse(data)
          console.log(parsedData)
          setData(parsedData)
        })
    }

    // // 메모리 정리
    URL.revokeObjectURL(imageUrl)
  }

  const createExample = (word: string) => {
    fetch('/api/example', {
      method: 'POST',
      body: JSON.stringify({ word }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        const parsedData = JSON.parse(data)
        console.log(parsedData)
      })
  }

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="100%"
        style={{ maxWidth: 400 }}
      />
      <br />
      <button onClick={takePhoto}>Test</button>
      <br />
      {/* {photo && (
        <Image
          src={photo}
          alt="캡처 이미지"
          style={{ marginTop: 10 }}
          width={400}
          height={400}
        />
      )} */}
      {data && (
        <div>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} onClick={() => createExample(key)}>
              {key}: {value}
            </div>
          ))}
        </div>
      )}
      <FileUpload />
    </div>
  )
}
