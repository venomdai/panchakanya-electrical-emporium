import { useEffect, useMemo, useRef, useState } from 'react'

const MAX_RESULTS = 8

const normalize = (s) => String(s || '').toLowerCase()

const buildIndex = (products) =>
  products.map((p) => ({
    p,
    hay: normalize(
      [
        p.name,
        p.brand,
        p.model,
        p.category,
        p.categoryGroup,
        p.description,
        ...(p.features || []),
        ...Object.entries(p.specs || {}).map(([k, v]) => `${k} ${v}`),
      ].join(' ')
    ),
    name: normalize(p.name),
    brand: normalize(p.brand),
    category: normalize(p.category),
  }))

export default function SearchBar({ products, getProductImage, formatNPR, onSelect, onShowAll }) {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const [viewH, setViewH] = useState(typeof window !== 'undefined' ? window.innerHeight : 700)
  const wrapRef = useRef(null)
  const inputRef = useRef(null)

  const term = input.trim().toLowerCase()

  const index = useMemo(() => buildIndex(products), [products])

  useEffect(() => {
    const onResize = () => setViewH(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const results = useMemo(() => {
    if (!term) return []
    const tokens = term.split(/\s+/).filter(Boolean)

    let count = MAX_RESULTS
    if (tokens.length >= 2) count = 6
    if (tokens.length >= 3) count = 4

    const scored = []
    for (const { p, hay, name, brand, category } of index) {
      if (!tokens.every((t) => hay.includes(t))) continue

      let score = 0
      if (name.includes(term)) score += 100
      else if (name === term) score += 50
      const allName = tokens.every((t) => name.includes(t))
      const allBrand = tokens.every((t) => brand.includes(t))
      const allCat = tokens.every((t) => category.includes(t))
      if (allName) score += 80
      if (allBrand) score += 45
      if (allCat) score += 25
      if (name.startsWith(term)) score += 30
      if (p.bestSeller) score += 10
      if (p.featured) score += 5
      scored.push({ p, score })
    }
    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, count).map((s) => s.p)
  }, [index, term])

  const panelHeight = Math.min(Number((viewH * 0.45).toFixed(0)), 420)

  const showPanel = open && term.length > 0

  useEffect(() => {
    setHighlight(0)
  }, [input])

  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const choose = (p) => {
    if (!p) return
    onSelect(p)
    setInput('')
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      setHighlight((h) => (results.length ? (h + 1) % results.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => (results.length ? (h - 1 + results.length) % results.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results.length) {
        choose(results[highlight])
      } else if (term) {
        onShowAll(input)
        setOpen(false)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="navbar-search-wrap" ref={wrapRef}>
      <div className="navbar-search-box">
        <svg className="navbar-search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input
          ref={inputRef}
          type="search"
          className="navbar-search"
          placeholder="Search for products..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          style={{ '--search-panel-h': `${panelHeight}px` }}
          aria-label="Search products"
          aria-expanded={showPanel}
          aria-autocomplete="list"
        />
        {input && (
          <button
            className="navbar-search-clear"
            onClick={() => {
              setInput('')
              setOpen(false)
              if (inputRef.current) inputRef.current.focus()
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {showPanel && (
        <div className="search-results-panel" style={{ '--search-panel-h': `${panelHeight}px` }}>
          <div className="search-panel-header">
            <span>
              {results.length
                ? `${results.length} result${results.length === 1 ? '' : 's'} for “${input}”`
                : `No results for “${input}”`}
            </span>
            <button className="search-panel-close" aria-label="Close search results" onClick={() => setOpen(false)}>×</button>
          </div>

          {results.length === 0 ? (
            <div className="search-no-results">
              <span className="search-no-results-icon">🔍</span>
              <strong>No products found</strong>
              <p>Try a different name, brand, or category.</p>
            </div>
          ) : (
            <>
              <ul className="search-results-list">
                {results.map((p, i) => (
                  <li key={p.id} className="search-result-item">
                    <button
                      className={`search-result-btn ${i === highlight ? 'active' : ''}`}
                      onMouseEnter={() => setHighlight(i)}
                      onClick={() => choose(p)}
                    >
                      <span className="search-result-rank">{i + 1}</span>
                      <img className="search-result-img" src={getProductImage(p)} alt={p.name} loading="lazy" />
                      <span className="search-result-body">
                        <span className="search-result-top">
                          <strong className="search-result-name">{p.name}</strong>
                          <span className="search-result-category">{p.category}</span>
                        </span>
                        <span className="search-result-sub">{p.brand}</span>
                        <span className="search-result-price">{formatNPR(p.price)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button className="search-view-all" onClick={() => { onShowAll(input); setOpen(false) }}>
                View all results for “{input}”
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
