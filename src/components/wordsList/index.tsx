import { supabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const WordsList = () => {
  const [list, setList] = useState<
    {
      created_at: string
      id: number
      title: string
      updated_at: string
      words: string
      date: number
    }[]
  >([])
  const { data } = useQuery({
    queryKey: ['words'],
    queryFn: async () => {
      const { data } = await supabase.from('words').select('*')
      return data
    },
  })

  useEffect(() => {
    if (data) {
      setList(data)
    }
  }, [data])

  return (
    <div>
      <div className="mb-[10px] flex justify-between">
        <span className="text-[30px] font-semibold">List</span>
        <Link
          href={'/create'}
          className="cursor-pointer text-[30px] font-semibold">
          +
        </Link>
      </div>
      <div className="flex flex-col gap-[10px]">
        {list.map((item) => {
          return (
            <div
              key={item.id}
              className="border-gray-3 bg-white-1 rounded-[10px] border">
              <Link href={`/words/${item.id}`}>
                <div className="p-[10px]">
                  <div className="flex flex-col justify-center">
                    <span className="text-[20px] text-black">{item.title}</span>
                    <span className="text-gray-2 text-[14px] font-semibold">
                      {dayjs.unix(item.date).format('YYYY-MM-DD')}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WordsList
