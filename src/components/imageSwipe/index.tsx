import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Autoplay, Pagination, Keyboard, Mousewheel } from 'swiper/modules'

const ImageSwipe: React.FC<{
  files: File[]
  previews: string[]
  removeFile: (index: number) => void
}> = ({ files, previews, removeFile }) => {
  return (
    <div className="mt-6">
      <h3 className="mb-4 text-lg font-semibold">
        선택된 파일 ({files.length}개)
      </h3>
      <Swiper
        modules={[Autoplay, Keyboard, Mousewheel, Pagination]}
        direction="horizontal"
        slidesPerView={1.5}
        spaceBetween={30}
        mousewheel={true}
        keyboard={{ enabled: true }}
        onActiveIndexChange={() => {}}>
        {files.map((file, index) => (
          <SwiperSlide key={index}>
            <div
              key={index}
              className="flex h-[300px] items-center justify-center overflow-hidden rounded-[10px] border">
              <div className="relative flex h-full w-full items-center justify-center">
                <Image
                  src={previews[index]}
                  alt={file.name}
                  fill
                  objectFit="contain"
                  // className="absolute h-full w-full object-cover"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600">
                  ×
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ImageSwipe
