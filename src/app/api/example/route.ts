import { client } from '@/lib/openai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { word } = await req.json()
    console.log(word)
    const response = await client.chat.completions.create({
      model: 'o4-mini',
      messages: [
        {
          role: 'system',
          content: `단어를 제시하면 3개정도의 예제 문장을 만들어줘(일상에서 잘 사용하는 문장들로만!). 문장에 해석들도 같이 넣어줘! 반복되는 문장은 만들지마 항상 다른 문장들로 만들어줘
            {
             "단어": [{
              "예제1": ["문장1", "문장1의 해석"],
              "예제2": ["문장2", "문장2의 해석"],
              "예제3": ["문장3", "문장3의 해석"]
             }]
            }

            예시:
            {
              "단어": [{
              "예제1": ["문장1", "문장1의 해석"],
              "예제2": ["문장2", "문장2의 해석"],
              "예제3": ["문장3", "문장3의 해석"]
             }]
            }
            `,
        },
        {
          role: 'user',
          name: 'ggyu',
          content: [
            {
              type: 'text',
              text: '단어를 줄테니까 문장을 만들어줘',
            },
            {
              type: 'text',
              text: `단어: ${word}`,
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
