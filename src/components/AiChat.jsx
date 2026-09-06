import { useEffect, useRef, useState } from 'react'

const normalize = (s) => String(s || '').toLowerCase().trim()

const searchProducts = (products, query) => {
  const q = normalize(query)
  if (!q) return []
  const tokens = q.split(/\s+/).filter(Boolean)
  const scored = []
  for (const p of products) {
    const name = normalize(p.name)
    const brand = normalize(p.brand)
    const category = normalize(p.category || '')
    const group = normalize(p.categoryGroup || '')
    const model = normalize(p.model || '')
    const hay = [name, brand, category, group, model].join(' ')
    if (!tokens.every((t) => hay.includes(t))) continue
    let score = 0
    if (name.includes(q)) score += 100
    if (brand.includes(q)) score += 60
    if (category.includes(q)) score += 50
    if (group.includes(q)) score += 40
    if (model.includes(q)) score += 30
    if (p.bestSeller) score += 10
    scored.push({ p, score })
  }
  scored.sort((a, b) => b.score - a.score)
  return scored.map((s) => s.p)
}

const CATEGORY_MAP = {
  fan: 'Fans',
  cooler: 'Cooler',
  ac: 'Air Conditioner',
  'air condition': 'Air Conditioner',
  kitchen: 'Kitchen Appliances',
  home: 'Home Appliances',
  lighting: 'Lighting & Decor',
  power: 'Electrical & Power',
  inverter: 'Electrical & Power',
  motor: 'Electrical & Power',
  battery: 'Electrical & Power',
  tv: 'Television',
  television: 'Television',
  washing: 'Washing Machine',
  fridge: 'Refrigerator',
  refrigerator: 'Refrigerator',
  rice: 'Electric Rice Cooker',
}

export default function AiChat({ open, onOpenChange, products, getProductImage, formatNPR, onSelectProduct }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Namaste! 👋 I am the Panchakanya Emporium AI shopping assistant.\nAsk me about any product, price, or brand — or try "best sellers", "fans", "AC" or "contact".',
    },
  ])
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
      if (inputRef.current) inputRef.current.focus()
    }, 60)
    return () => clearTimeout(t)
  }, [open, messages])

  const replyFor = (raw) => {
    const q = normalize(raw)

    if (/^(hi|hello|hey|namaste|namaskar|salam)\b/.test(q) || q === 'hi' || q === 'hello' || q === 'hey') {
      return {
        role: 'bot',
        text: 'Hello again! 😊 What would you like to explore today? You can ask about products like "ceiling fans", "1.5 ton AC", or brands like "Crompton" and "LG".',
      }
    }

    if (/best ?seller|popular|top ?rated|trending|featured/.test(q)) {
      const items = products.filter((p) => p.bestSeller || p.newArrival).slice(0, 4)
      if (items.length) {
        return {
          role: 'bot',
          text: 'Here are our top sellers:',
          items,
        }
      }
    }

    if (/whatsapp|contact|phone|call|location|address|open (?:hours?|timing)|where/.test(q)) {
      return {
        role: 'bot',
        text: '📍 Panchakanya Electric Emporium\nTandi, Chitwan (10+ years serving you).\n📞 WhatsApp: 9855033485.\n\nYou can also press the WhatsApp button on any product to inquire instantly!',
      }
    }

    if (/price|cost|rate|how much|discount/.test(q)) {
      const items = searchProducts(products, q.replace(/price|cost|rate|how much|discount/g, ' '))
      if (items.length) {
        return {
          role: 'bot',
          text: `The price of "${raw}"`,
          items: items.slice(0, 4),
        }
      }
      return {
        role: 'bot',
        text: 'Great question! Which product or category would you like the price for? Try "ceiling fan price" or "LG TV".',
      }
    }

    const direct = searchProducts(products, q)
    if (direct.length) {
      return {
        role: 'bot',
        text: `I found ${direct.length} matching product${direct.length === 1 ? '' : 's'} for "${raw}"`,
        items: direct.slice(0, 4),
      }
    }

    for (const key of Object.keys(CATEGORY_MAP)) {
      if (q.includes(key)) {
        const group = CATEGORY_MAP[key]
        const items = products
          .filter((p) => normalize(p.categoryGroup) === normalize(group) || normalize(p.category) === normalize(group))
          .slice(0, 4)
        if (items.length) {
          return {
            role: 'bot',
            text: `Here are the ${group} we have in store:`,
            items,
          }
        }
      }
    }

    if (/help|what can you|commands/.test(q)) {
      return {
        role: 'bot',
        text: 'You can ask me things like:\n• "best sellers"\n• "ceiling fan" or "1.5 ton AC"\n• "Samsung" or any brand\n• "washing machine price"\n• "contact"\n\nTap any product card to open its details!',
      }
    }

    return {
      role: 'bot',
      text: `I couldn't find anything matching "${raw}". Try a product name, brand, category, or ask "help" to see what I can do.`,
    }
  }

  const send = (raw) => {
    const text = (raw ?? input).trim()
    if (!text) return
    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    const reply = replyFor(text)
    setTimeout(() => {
      setMessages((prev) => [...prev, reply])
    }, 450)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      send()
    }
  }

  const openProduct = (p) => {
    onSelectProduct(p)
    onOpenChange(false)
  }

  const quickReplies = ['Best sellers', 'Ceiling fan', '1.5 ton AC', 'Price', 'Contact']

  return (
    <>
      <button
        type="button"
        className={`ai-chat-fab ${open ? 'active' : ''}`}
        onClick={() => onOpenChange(!open)}
        aria-label="Chat with Panchakanya Emporium"
        aria-expanded={open}
      >
        <span className="ai-chat-fab-shine" aria-hidden="true"></span>
        <span className="ai-chat-fab-icon-wrap">
          <img className="ai-chat-fab-icon" src="/shining.png" alt="" aria-hidden="true" />
        </span>
        <span className="ai-chat-fab-text">Chat with Panchakanya Emporium</span>
      </button>

      {open && (
        <div className="ai-chat-panel" role="dialog" aria-label="AI Shopping Assistant">
          <div className="ai-chat-head">
            <span className="ai-chat-head-avatar">
              <img src="/shining.png" alt="" aria-hidden="true" />
            </span>
            <div className="ai-chat-head-info">
              <strong>AI Shopping Assistant</strong>
              <small>Panchakanya Emporium</small>
            </div>
            <button
              type="button"
              className="ai-chat-head-close"
              onClick={() => onOpenChange(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="ai-chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`ai-chat-msg ${m.role}`}>
                <div className="ai-chat-bubble">
                  <span className="ai-chat-msg-text">{m.text}</span>
                  {Array.isArray(m.items) && m.items.length > 0 && (
                    <div className="ai-chat-items">
                      {m.items.map((p) => (
                        <button key={p.id} type="button" className="ai-chat-item" onClick={() => openProduct(p)}>
                          <img className="ai-chat-item-img" src={getProductImage(p)} alt={p.name} loading="lazy" />
                          <span className="ai-chat-item-body">
                            <span className="ai-chat-item-name">{p.name}</span>
                            <span className="ai-chat-item-meta">{p.brand} • {p.category}</span>
                            <span className="ai-chat-item-price">{formatNPR(p.price)}</span>
                          </span>
                          <span className="ai-chat-item-view">View</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="ai-chat-footer">
            <div className="ai-chat-quick">
              {quickReplies.map((qr) => (
                <button key={qr} type="button" onClick={() => send(qr)}>{qr}</button>
              ))}
            </div>
            <div className="ai-chat-input-row">
              <input
                ref={inputRef}
                className="ai-chat-input"
                placeholder="Ask anything about our products..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                aria-label="Type your question"
              />
              <button type="button" className="ai-chat-send" onClick={() => send()} aria-label="Send message">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}