'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [photo, setPhoto] = useState<string>()

  useEffect(() => {
    // 카메라 접근
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert('카메라 접근 실패: ' + err.message)
        }
      }
    }

    getCamera()

    return () => {
      // 컴포넌트 unmount 시 스트림 정리
      if (videoRef.current && videoRef.current.srcObject) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track: MediaStreamTrack) => track.stop())
      }
    }
  }, [])

  const takePhoto = () => {
    const canvas = document.createElement('canvas')
    const video = videoRef.current
    if (!video) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    ctx?.drawImage(video, 0, 0)

    const imageDataUrl = canvas.toDataURL('image/png')
    setPhoto(imageDataUrl)
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
      <button onClick={takePhoto}>📸 사진 찍기</button>
      <br />
      {photo && (
        <Image
          src={photo}
          alt="캡처 이미지"
          style={{ marginTop: 10 }}
          width={400}
          height={400}
        />
      )}
    </div>
  )
}
