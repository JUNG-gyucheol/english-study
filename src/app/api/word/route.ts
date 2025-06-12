import { client } from '@/lib/openai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    const response = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: `단어와 뜻을 정리해줘. 부가적인 단어는 필요없고 메인 단어들과 뜻만 정리해
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
              text: '나는 찍어준 사진 속에 단어들을 공부중이야. 단어를 데스크탑으로 정리하기위해서 옮길려고해. 단어,뜻을 정리해줘',
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    })

    console.log(response.choices[0].message.content)
    return NextResponse.json(response.choices[0].message.content)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
