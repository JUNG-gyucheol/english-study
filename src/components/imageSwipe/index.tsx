import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Autoplay, Pagination, Keyboard, Mousewheel } from 'swiper/modules'
import { IoCloseOutline } from 'react-icons/io5'

const ImageSwipe: React.FC<{
  files: File[]
  previews: string[]
  removeFile: (index: number) => void
}> = ({ files, previews, removeFile }) => {
  return (
    <div className="">
      <h3 className="mb-2 text-lg font-semibold">Preview ({files.length}개)</h3>
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
                  className="bg-orange-1 absolute top-2 right-2 flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full text-white transition-all duration-300 hover:opacity-80">
                  <IoCloseOutline className="text-[20px] text-white" />
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
