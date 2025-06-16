import { atom } from 'jotai'

export const toastStatusAtom = atom<boolean>(true)

export const toastListAtom = atom<
  {
    status: 'error' | 'success' | 'warning'
    message: string
  }[]
>([])
