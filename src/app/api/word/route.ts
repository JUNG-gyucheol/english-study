import { client } from '@/lib/openai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { images } = await req.json()
    let res = {}

    const imagesData = images.map((image: string) => ({
      type: 'image_url',
      image_url: {
        url: image,
      },
    }))

    const response = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: `단어와 뜻을 정리해줘. 부가적인 단어는 필요없고 메인 단어들과 뜻만 정리해 아래와 같은 양식으로 대답해줘.


            영어공부이미지가 아닌경우: null,

            영어이미지인 경우:
              {
               "단어": "뜻"
              }
  
              예시:
              {
                "단어": "뜻",
                "단어": "뜻",
                ...
              }
              `,
        },
        {
          role: 'user',
          name: 'ggyu',
          content: [
            {
              type: 'text',
              text: '나는 찍어준 사진 속에 단어들을 공부중이야. 단어를 데스크탑으로 정리하기위해서 옮길려고해. 단어,뜻을 정리해줘(단, 영어공부책 이미지만 처리해줘, 다른 이미지는 정리할 필요없고 "null"로 대답해줘)',
            },
            ...imagesData,
          ],
        },
      ],
    })
    const parsedData = JSON.parse(response.choices[0].message.content as string)

    res = { ...res, ...parsedData }

    return NextResponse.json(res)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
