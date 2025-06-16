import { usePathname, useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa6'

const Header = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="relative flex h-[60px] items-center justify-center py-[40px]">
      {pathname !== '/' && (
        <span
          onClick={() => router.back()}
          className="absolute top-[50%] left-0 -translate-y-1/2 cursor-pointer">
          <FaArrowLeft className="text-white-1 text-[30px]" />
        </span>
      )}
      <span className="font-merriweather text-[40px] font-bold tracking-wider text-[#e0e0e0] uppercase">
        English
      </span>
    </div>
  )
}

export default Header
