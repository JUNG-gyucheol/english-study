import { supabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const WordsDetail = () => {
  const { id } = useParams()
  const router = useRouter()
  const [words, setWords] = useState<{ [key: string]: string }>()
  const [enVisible, setEnVisible] = useState(true)
  const [koVisible, setKoVisible] = useState(true)
  const { data } = useQuery({
    queryKey: ['words', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('words')
        .select('*')
        .eq('id', id)
        .single()
      return data
    },
  })

  useEffect(() => {
    if (data) {
      setWords(JSON.parse(data.words))
    }
  }, [data])

  const handleRemove = () => {
    supabase
      .from('words')
      .delete()
      .eq('id', id)
      .then(() => {
        router.push('/')
      })
  }

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="flex justify-between">
        <input
          type="checkbox"
          className="h-[20px] w-[20px]"
          defaultChecked={enVisible}
          onChange={(e) => {
            setEnVisible(e.target.checked)
          }}
        />
        <input
          type="checkbox"
          className="h-[20px] w-[20px]"
          defaultChecked={koVisible}
          onChange={(e) => {
            setKoVisible(e.target.checked)
          }}
        />
      </div>
      {words &&
        Object.keys(words).map((key) => {
          return (
            <div
              key={key}
              className="border-gray-3 flex justify-between gap-[10px] border-b pb-[6px]">
              <span
                className={`${enVisible ? 'opacity-100' : 'opacity-0'} text-[20px]`}>
                {key}
              </span>
              <span
                className={`${koVisible ? 'opacity-100' : 'opacity-0'} text-[20px]`}>
                {words[key]}
              </span>
            </div>
          )
        })}
      <div className="absolute bottom-[30px] left-[50%] w-full -translate-x-1/2 px-[14px]">
        <div
          onClick={() => handleRemove()}
          className="w-full cursor-pointer rounded-[10px] bg-[#4e73df] py-[10px] text-center text-[16px] font-semibold text-white transition-all duration-300 hover:bg-[#2e59d9]">
          <span className="font-merriweather text-white-1">REMOVE</span>
        </div>
      </div>
    </div>
  )
}

export default WordsDetail
