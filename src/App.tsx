import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Olá! Sou seu assistente IA. Como posso ajudar?' }
  ])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: 'user', content: input }])
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: 'Estou processando sua solicitação...' }])
    }, 1000)
    setInput('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Dashboard IA</h1>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
          <div className="h-96 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2 max-w-xs ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'ai' ? <Bot className="w-6 h-6 text-cyan-400" /> : <User className="w-6 h-6 text-pink-400" />}
                  <div className={`px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-pink-600' : 'bg-cyan-600'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 bg-white/20 backdrop-blur rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:scale-105 transition-transform"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
              }
