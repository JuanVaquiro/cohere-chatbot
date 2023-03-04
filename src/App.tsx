import { useEffect, useRef, useState } from 'react'
import { EXAMPLES, API_KEY } from './const'

type Message = {
  id: string;
  type: 'bot' | 'user';
  text: React.ReactNode;
}

const ANSWERS = {
  default: (
    <p>
      Losiento son una IA progrmada para
      contestas a ciertas preguntas reformula tu pregunta
      por favaor
    </p>
  ),
  Biologia: (
    <p>
      esto es un pregunta de biologia.
      y respondera a ella con lo siguiente bla:
    </p>
  ),
  Español: (
    <p>
      esto es un pregunta de Español.
      que lengua lengjaue bien echo mano
    </p>
  )
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: String(Date.now()),
      type: 'bot',
      text: 'hola! Soy un Bot preprado para atender algunas de tus preguntas para ayudarte a darte consejos para el mantenimiento de una impresora.'
    }
  ])
  const [question, setQuestion] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const container = useRef<HTMLDivElement>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (loading) return

    setLoading(true)

    setMessages((messages) =>
      messages.concat({
        id: String(Date.now()),
        type: 'user',
        text: question
      }),
    )

    setQuestion('')

    const { classifications } = await fetch('https://api.cohere.ai/classify', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'large',
        inputs: [question],
        examples: EXAMPLES
      })
    }).then((res) => res.json())

    setMessages((messages) =>
      messages.concat({
        id: String(Date.now()),
        type: 'bot',
        text: ANSWERS[classifications[0].prediction as keyof typeof ANSWERS] || ANSWERS['default']
      }),
    )

    setLoading(false)
    console.log(classifications)
  }

  useEffect(() => {
    container.current?.scrollTo(0, container.current.scrollHeight)
  }, [messages])

  return (
    <main className='P-4'>
      <div className='flex flex-col gap-4 m-auto max-w-lg border border-gray-400 p-4 rounded-md'>
        <div ref={container} className='flex flex-col gap-4 h-[318px] overflow-y-auto'>
          {
            messages.map((message) => (
              <div
                key={message.id}
                className={
                  `max-w-[80%] p-4 rounded-3xl text-white 
                  ${message.type === 'bot'
                    ? 'bg-slate-500 text-left self-start rounded-bl-none'
                    : 'bg-blue-500 text-right self-end rounded-br-none'
                  }`}
              >
                {message.text}
              </div>
            ))
          }
        </div>
        <form className='flex items-center' onSubmit={handleSubmit}>
          <input
            type='text'
            className='flex-1 border border-gray-400 py-2 px-4 rounded rounded-r-none'
            placeholder='Envianos tus preguntas'
            name='question'
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
          <button
            type='submit'
            disabled={loading}
            className={
              `px-4 py-2 bg-blue-500 rounded-lg rounded-l-none
              ${loading ? 'bg-blue-300' : 'bg-blue-500'}
            `}
          >
            Enviar
          </button>
        </form>
      </div>
    </main>
  )
}

export default App
