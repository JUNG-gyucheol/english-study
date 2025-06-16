import { toastListAtom } from '@/store/toastStore'
import { useAtom } from 'jotai'
import { useRef } from 'react'
import ToastItem from './item'

const Toast = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [toastList] = useAtom(toastListAtom)

  return (
    <div
      ref={ref}
      className={`fixed top-[100px] left-[50%] flex w-[300px] -translate-x-1/2 flex-col rounded-lg transition-all duration-300`}>
      {toastList.map((item, index) => (
        <ToastItem key={index} index={index} item={item} />
      ))}
    </div>
  )
}

export default Toast
