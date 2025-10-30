import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou seu assistente IA. Como posso ajudar?' }
  ])
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Adiciona loading temporário
    const loadingMessage = { role: 'assistant', content: 'Estou processando sua solicitação...' }
    setMessages(prev => [...prev, loadingMessage])

    try {
      const apiKey = import.meta.env.VITE_GROK_API_KEY
      if (!apiKey) {
        throw new Error('Chave API não encontrada! Verifique VITE_GROK_API_KEY no Netlify.')
      }

      // Prepara mensagens pro API (inclui histórico + system prompt)
      const apiMessages = [
        { role: 'system', content: 'Você é Grok, um assistente IA útil, engraçado e criado pela xAI. Responda em português.' },
        ...messages.map(msg => ({ role: msg.role, content: msg.content })).slice(0, -1), // Exclui loading
        userMessage
      ]

      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          model: 'grok-3',  // Modelo Grok 3 (grátis com limite)
          stream: false,
          temperature: 0.7,  // Pra respostas criativas
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro na API: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      const aiContent = data.choices[0]?.message?.content || 'Resposta vazia da API. Tente novamente.'

      // Substitui o loading pela resposta real
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: aiContent }])
    } catch (error) {
      console.error('Erro completo:', error)  // Pra debug no console
      const errorMessage = { role: 'assistant', content: `Ops! Erro: ${error.message}. Verifique a chave API ou quota no x.ai/api.` }
      setMessages(prev => [...prev.slice(0, -1), errorMessage])
    }
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
                  {msg.role === 'assistant' ? <Bot className="w-6 h-6 text-cyan-400 mt-1" /> : <User className="w-6 h-6 text-pink-400 mt-1" />}
                  <div className={`px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-pink-600' : 'bg-cyan-600'}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
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
              disabled={!input.trim()}  // Desabilita se vazio
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
            }
