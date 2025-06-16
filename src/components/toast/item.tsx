import { useAtom } from 'jotai'
import { toastListAtom } from '@/store/toastStore'
import { useEffect, useRef, useState } from 'react'

const ToastItem = ({
  index,
  item,
}: {
  index: number
  item: {
    status: 'error' | 'success' | 'warning'
    message: string
  }
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [toastList, setToastList] = useAtom(toastListAtom)
  const [animation, setAnimation] = useState('toast_ani_visible')
  useEffect(() => {
    if (animation === 'toast_ani_visible') {
      setTimeout(() => {
        setAnimation('toast_ani_hidden')
      }, 3000)
    }
  }, [animation, index, setToastList, toastList])

  return (
    <div
      ref={ref}
      className={`${animation} mb-[10px] flex h-[30px] items-center justify-center rounded-[10px] ${
        item.status === 'error'
          ? 'bg-red-1'
          : item.status === 'success'
            ? 'bg-green-600'
            : 'bg-yellow-600'
      } transition-all duration-300`}>
      <span className="font-semibold">{item.message}</span>
    </div>
  )
}

export default ToastItem
