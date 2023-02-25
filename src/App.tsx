import { useEffect, useRef, useState } from 'react'
import { EXAMPLES, API_KEY } from './const'

type Message = {
  id: String;
  type: 'bot' | 'user';
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hola, soy un bot'
    },
    {
      id: '2',
      type: 'user',
      text: 'Hola, soy un user'
    },
  ])
  const [question, setQuestion] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const container = useRef<HTMLDivElement>(null)

  const handleSubmit = async (event: React.FocusEvent) => {
    event.preventDefault()
    if (loading) return

    setLoading(true)

    setMessages(messages =>
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
    }).then(res => res.json())

    setMessages(messages =>
      messages.concat({
        id: String(Date.now()),
        type: 'bot',
        text: classifications[0].prediction
      }),
    )


    setLoading(false)
    console.log(classifications)
  }

  useEffect(() => {
    container.current?.scrollTo(0, container.current.scrollHeight)
  }, [messages])


  return (
    <main className="P-4">
      <div className='flex flex-col gap-4 m-auto max-w-lg border border-gray-400 p-4 rounded-md'>
        <div ref={container} className='flex flex-col gap-4 h-[318px] overflow-y-auto'>
          {
            messages.map(message => (
              <div
                key={message.id}
                className={
                  `max-w-[80%] p-4 rounded-3xl bg-slate-500 text-white 
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
            onChange={event => setQuestion(event.target.value)}
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
