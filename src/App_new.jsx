import { useEffect, useMemo, useState } from 'react'
import './App.css'

// ============================================================================
// CONFIGURATION & UTILITIES
// ============================================================================

const WHATSAPP_NUMBER = '9855033485'
const formatNPR = (value) => `NPR ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`

const generateWhatsAppMessage = (productName, productPrice, productModel = '') => {
  const modelText = productModel ? `, Model ${productModel}` : ''
  const message = `Hello, I am interested in the ${productName}${modelText}. The listed price is NPR ${productPrice.toLocaleString('en-US')}. Could you please provide more details and confirm the price?`
  return encodeURIComponent(message)
}

const openWhatsAppLink = (productName, productPrice, productModel = '') => {
  const message = generateWhatsAppMessage(productName, productPrice, productModel)
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
  window.open(waLink, '_blank')
}

// ============================================================================
// PRODUCT CATEGORIES - ORGANIZED BY TYPE
// ============================================================================

const PRODUCT_CATEGORIES = {
  'Kitchen Appliances': {
    id: 'kitchen',
    name: 'Kitchen Appliances',
    icon: '🍳',
    items: [
      { id: 'rice-cooker', name: 'Electric Rice Cooker' },
      { id: 'induction', name: 'Induction Stove' },
      { id: 'pressure-cooker', name: 'Pressure Cooker' },
      { id: 'mixer-grinder', name: 'Mixer Grinder' },
      { id: 'geyser', name: 'Geyser / Water Heater' },
    ],
  },
  'Home Appliances': {
    id: 'home',
    name: 'Home Appliances',
    icon: '🏠',
    items: [
      { id: 'washing-machine', name: 'Washing Machine' },
      { id: 'refrigerator', name: 'Refrigerator / Fridge' },
      { id: 'tv', name: 'Television' },
    ],
  },
  'Cooling & Temperature': {
    id: 'cooling',
    name: 'Cooling & Temperature',
    icon: '❄️',
    items: [
      { id: 'ac', name: 'Air Conditioner (AC)' },
      { id: 'cooler', name: 'Air Cooler' },
    ],
  },
  'Fans': {
    id: 'fans',
    name: 'Fans',
    icon: '🌀',
    items: [
      { id: 'ceiling-fan', name: 'Ceiling Fan' },
      { id: 'stand-fan', name: 'Stand Fan' },
      { id: 'table-fan', name: 'Table Fan' },
    ],
  },
  'Electrical & Power': {
    id: 'electrical',
    name: 'Electrical & Power',
    icon: '⚡',
    items: [
      { id: 'inverter', name: 'Inverter' },
      { id: 'battery', name: 'Battery' },
      { id: 'motor', name: 'Motor & Pumps' },
    ],
  },
  'Lighting & Decor': {
    id: 'lighting',
    name: 'Lighting & Decor',
    icon: '💡',
    items: [
      { id: 'chandelier', name: 'Chandelier' },
      { id: 'led-bulb', name: 'LED Bulb' },
      { id: 'led-tube', name: 'LED Tube Light' },
      { id: 'socket', name: 'Switch & Socket' },
    ],
  },
}

// Flatten categories for easier access
const defaultCategoryList = Object.values(PRODUCT_CATEGORIES).map(cat => ({
  id: cat.id,
  name: cat.name,
  icon: cat.icon,
}))

// ============================================================================
// BRANDS
// ============================================================================

const BRANDS_DATA = [
  { id: 'better', name: 'Better', logo: '📦' },
  { id: 'baltra', name: 'Baltra', logo: '🔵' },
  { id: 'crompton', name: 'Crompton', logo: '⚙️' },
  { id: 'cg', name: 'CG', logo: '✨' },
  { id: 'lg', name: 'LG', logo: '📺' },
  { id: 'samsung', name: 'Samsung', logo: '🎯' },
]

// ============================================================================
// DEFAULT PRODUCTS (SAMPLE DATA - Ready for replacement)
// ============================================================================

const defaultProducts = [
  {
    id: 'prod-1',
    name: 'Samsung 43" Smart TV',
    brand: 'Samsung',
    category: 'Television',
    categoryGroup: 'Home Appliances',
    model: 'UA43T',
    price: 63999,
    originalPrice: 69999,
    stock: 14,
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    newArrival: true,
    featured: true,
    bestSeller: true,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80'],
    description: 'A sleek 43-inch smart TV designed for immersive entertainment.',
    features: ['4K UHD display', 'Smart TV platform', 'Voice assistant ready', 'Ultra slim frame'],
    specs: { Screen: '43 inch', Resolution: '3840x2160', Warranty: '1 Year' },
    warranty: '1 Year Manufacturer Warranty',
    delivery: 'Free delivery within Tandi and nearby areas.',
  },
  {
    id: 'prod-2',
    name: 'LG 7KG Washing Machine',
    brand: 'LG',
    category: 'Washing Machine',
    categoryGroup: 'Home Appliances',
    model: 'F2B7',
    price: 55999,
    originalPrice: 63999,
    stock: 8,
    rating: 4.7,
    reviewCount: 96,
    inStock: true,
    newArrival: false,
    featured: true,
    bestSeller: true,
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80'],
    description: 'High-efficiency 7KG washing machine for modern households.',
    features: ['7 kg capacity', 'Energy efficient', 'Multiple wash programs', 'Turbo drum'],
    specs: { Capacity: '7 KG', Energy: '5 Star', Control: 'Fully Automatic', Warranty: '2 Years' },
    warranty: '2 Year Warranty on Motor',
    delivery: 'Home delivery and installation support available.',
  },
  {
    id: 'prod-4',
    name: 'Baltra Electric Rice Cooker',
    brand: 'Baltra',
    category: 'Electric Rice Cooker',
    categoryGroup: 'Kitchen Appliances',
    model: 'RC-5.5',
    price: 4999,
    originalPrice: 6299,
    stock: 19,
    rating: 4.6,
    reviewCount: 68,
    inStock: true,
    newArrival: false,
    featured: false,
    bestSeller: true,
    images: ['https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80'],
    description: 'Easy-to-use rice cooker with multiple cooking modes.',
    features: ['Multi-cook function', 'Keep warm mode', 'Non-stick inner pot', 'Safe locking lid'],
    specs: { Capacity: '5.5 Cups', Power: '700W', Features: 'Keep Warm', Warranty: '1 Year' },
    warranty: '1 Year Warranty',
    delivery: 'Delivery and demo guidance available at the store.',
  },
  {
    id: 'prod-5',
    name: 'CG Air Cooler',
    brand: 'CG',
    category: 'Air Cooler',
    categoryGroup: 'Cooling & Temperature',
    model: 'Dream Air',
    price: 18999,
    originalPrice: 21999,
    stock: 12,
    rating: 4.4,
    reviewCount: 55,
    inStock: true,
    newArrival: true,
    featured: true,
    bestSeller: false,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80'],
    description: 'Efficient air cooler for warm Nepali summers.',
    features: ['Powerful airflow', 'Low power consumption', 'Remote control', 'Large water tank'],
    specs: { Capacity: '55L', Type: 'Desert Cooler', Motor: 'High Speed', Warranty: '1 Year' },
    warranty: '1 Year Warranty Support',
    delivery: 'Available across Chitwan with installation support.',
  },
  {
    id: 'prod-6',
    name: 'Crompton Premium Ceiling Fan',
    brand: 'Crompton',
    category: 'Ceiling Fan',
    categoryGroup: 'Fans',
    model: 'CF-120',
    price: 3999,
    originalPrice: 4999,
    stock: 49,
    rating: 4.3,
    reviewCount: 73,
    inStock: true,
    newArrival: false,
    featured: false,
    bestSeller: true,
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'],
    description: 'Durable ceiling fan with balanced airflow and quiet operation.',
    features: ['High-speed motor', 'Low-noise operation', 'Energy efficient', 'Modern blade design'],
    specs: { Size: '120 CM', Speed: '3 Speed', Power: '60W', Warranty: '1 Year' },
    warranty: '1 Year Motor Warranty',
    delivery: 'Quick delivery across Chitwan.',
  },
  {
    id: 'prod-9',
    name: 'Baltra Induction Cooker',
    brand: 'Baltra',
    category: 'Induction Stove',
    categoryGroup: 'Kitchen Appliances',
    model: 'IC-1800',
    price: 6599,
    originalPrice: 7999,
    stock: 17,
    rating: 4.5,
    reviewCount: 47,
    inStock: true,
    newArrival: true,
    featured: false,
    bestSeller: true,
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
    description: 'Compact induction cooker for fast, energy-saving cooking.',
    features: ['1800W power', 'Touch panel', 'Energy efficient', 'Safety shutoff'],
    specs: { Power: '1800W', Voltage: '220V', Controls: 'Touch', Warranty: '1 Year' },
    warranty: '1 Year Service Warranty',
    delivery: 'Delivered to your door in Chitwan.',
  },
  {
    id: 'prod-13',
    name: 'CG 1.5 Ton Inverter AC',
    brand: 'CG',
    category: 'Air Conditioner (AC)',
    categoryGroup: 'Cooling & Temperature',
    model: 'AC-INV-18',
    price: 89999,
    originalPrice: 99999,
    stock: 6,
    rating: 4.7,
    reviewCount: 32,
    inStock: true,
    newArrival: true,
    featured: true,
    bestSeller: false,
    images: ['https://images.unsplash.com/photo-1631545806609-9c7f6d90b1e3?auto=format&fit=crop&w=1200&q=80'],
    description: 'Energy-efficient inverter AC for cool, comfortable rooms.',
    features: ['1.5 ton capacity', 'Inverter technology', 'Fast cooling', 'Sleep mode'],
    specs: { Capacity: '1.5 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' },
    warranty: '2 Year Comprehensive Warranty',
    delivery: 'Installation support available across Chitwan.',
  },
  {
    id: 'prod-14',
    name: 'Crompton 1HP Water Pump Motor',
    brand: 'Crompton',
    category: 'Motor & Pumps',
    categoryGroup: 'Electrical & Power',
    model: 'MB-1HP',
    price: 14999,
    originalPrice: 16999,
    stock: 9,
    rating: 4.6,
    reviewCount: 28,
    inStock: true,
    newArrival: true,
    featured: true,
    bestSeller: true,
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'],
    description: 'Reliable water pump motor for homes and small commercial systems.',
    features: ['1HP motor', 'Copper winding', 'Strong build', 'Low maintenance'],
    specs: { Power: '1 HP', Voltage: '220V', Type: 'Water Pump Motor', Warranty: '1 Year' },
    warranty: '1 Year Motor Warranty',
    delivery: 'Delivery and fitting guidance available.',
  },
  {
    id: 'prod-15',
    name: 'LED Chandelier',
    brand: 'Better',
    category: 'Chandelier',
    categoryGroup: 'Lighting & Decor',
    model: 'CH-LED-06',
    price: 12499,
    originalPrice: 14999,
    stock: 7,
    rating: 4.5,
    reviewCount: 19,
    inStock: true,
    newArrival: true,
    featured: true,
    bestSeller: false,
    images: ['https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80'],
    description: 'Statement LED chandelier that brings warm, modern character.',
    features: ['Integrated LED', 'Warm white light', 'Modern design', 'Easy ceiling mount'],
    specs: { Power: '48W', Color: 'Warm White', Type: 'Decorative Chandelier', Warranty: '1 Year' },
    warranty: '1 Year Product Warranty',
    delivery: 'Careful delivery with installation guidance.',
  },
]

// ============================================================================
// DEFAULT STATE & PERSISTENCE
// ============================================================================

const persistedState = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

const defaultSiteContent = {
  phone: '+977-9855-033485',
  whatsapp: '+977-9855-033485',
  email: 'sales@panchakanya.com.np',
  location: 'Tandi, Chitwan, Nepal',
  hours: 'Sun - Fri: 9:00 AM - 7:00 PM',
  about: 'Panchakanya Electric Emporium is a trusted electrical and appliance shop in Tandi, Chitwan. We supply fans, coolers, AC, rice cookers, induction stoves, refrigerators, chandeliers, lights, inverters, batteries, and electrical essentials from trusted brands.',
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  // State - Products & Catalog
  const [products, setProducts] = useState(() => persistedState('panchakanya-products-v3', defaultProducts))
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

  // State - UI & Navigation
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentView, setCurrentView] = useState('store')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [whatsappConfirm, setWhatsappConfirm] = useState(null)

  // State - Site Content
  const [siteContent, setSiteContent] = useState(() => persistedState('panchakanya-content', defaultSiteContent))

  // State - Admin
  const [adminTab, setAdminTab] = useState('products')
  const [formMessage, setFormMessage] = useState('')
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    brand: 'Samsung',
    category: 'Television',
    categoryGroup: 'Home Appliances',
    model: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    description: '',
    warranty: '1 Year',
    inStock: true,
    newArrival: false,
    featured: false,
    bestSeller: false,
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80'],
  })

  // Persist state changes
  useEffect(() => { localStorage.setItem('panchakanya-products-v3', JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem('panchakanya-content', JSON.stringify(siteContent)) }, [siteContent])

  // ============================================================================
  // FILTERING & SORTING LOGIC
  // ============================================================================

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    
    let filtered = products.filter((product) => {
      // Search filter
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.model.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.categoryGroup.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)

      // Brand filter
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand

      // Category filter
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory || product.categoryGroup === selectedCategory

      return matchesSearch && matchesBrand && matchesCategory
    })

    // Sorting
    switch (sortBy) {
      case 'low-high':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'high-low':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => Number(b.newArrival) - Number(a.newArrival))
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        filtered.sort((a, b) => Number(b.featured) - Number(a.featured))
    }

    return filtered
  }, [products, searchTerm, selectedBrand, selectedCategory, sortBy])

  // Get featured products
  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured).slice(0, 6),
    [products]
  )

  const resetFilters = () => {
    setSelectedBrand('All')
    setSelectedCategory('All')
    setSearchTerm('')
    setSortBy('featured')
  }

  // ============================================================================
  // ADMIN HANDLERS
  // ============================================================================

  const handleProductSubmit = (event) => {
    event.preventDefault()
    if (!productForm.name || !productForm.category) {
      setFormMessage('Please fill in the product name and category.')
      return
    }

    const normalized = {
      ...productForm,
      id: productForm.id || `prod-${Date.now()}`,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice || productForm.price),
      stock: Number(productForm.stock),
      inStock: Number(productForm.stock) > 0,
      rating: 4.5,
      reviewCount: 0,
    }

    setProducts((current) => {
      const exists = current.some((item) => item.id === normalized.id)
      if (exists) {
        return current.map((item) => (item.id === normalized.id ? normalized : item))
      }
      return [normalized, ...current]
    })

    setProductForm({
      id: '',
      name: '',
      brand: 'Samsung',
      category: 'Television',
      categoryGroup: 'Home Appliances',
      model: '',
      price: 0,
      originalPrice: 0,
      stock: 0,
      description: '',
      warranty: '1 Year',
      inStock: true,
      newArrival: false,
      featured: false,
      bestSeller: false,
      images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80'],
    })
    setFormMessage('Product saved successfully!')
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Delete this product?')) {
      setProducts((current) => current.filter((item) => item.id !== productId))
    }
  }

  const handleEditProduct = (product) => {
    setProductForm(product)
    setAdminTab('products')
  }

  // ============================================================================
  // RENDER - ADMIN VIEW
  // ============================================================================

  if (currentView === 'admin') {
    return (
      <div className="app-shell">
        <header className="navbar">
          <div className="navbar-container">
            <div className="navbar-brand">
              <div className="logo">
                <span className="logo-icon">⚡</span>
                <div className="logo-text">
                  <strong>Panchakanya Electric Emporium</strong>
                </div>
              </div>
            </div>
            <div className="navbar-actions">
              <button className="admin-btn" onClick={() => setCurrentView('store')}>
                Back to Store
              </button>
            </div>
          </div>
        </header>

        <main className="admin-container">
          <div className="admin-layout">
            <aside className="admin-sidebar">
              <h3>Admin Dashboard</h3>
              <button className={adminTab === 'products' ? 'active' : ''} onClick={() => setAdminTab('products')}>
                Products
              </button>
              <button className={adminTab === 'content' ? 'active' : ''} onClick={() => setAdminTab('content')}>
                Website Content
              </button>
            </aside>

            <section className="admin-panel">
              {formMessage && <div className="alert">{formMessage}</div>}

              {adminTab === 'products' && (
                <>
                  <h2>Product Management</h2>
                  <form className="admin-form" onSubmit={handleProductSubmit}>
                    <input required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="Product name" />
                    <input value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} placeholder="Brand" />
                    <input value={productForm.model} onChange={(e) => setProductForm({ ...productForm, model: e.target.value })} placeholder="Model" />
                    <select required value={productForm.categoryGroup} onChange={(e) => setProductForm({ ...productForm, categoryGroup: e.target.value })}>
                      {Object.values(PRODUCT_CATEGORIES).map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <select required value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                      {productForm.categoryGroup && PRODUCT_CATEGORIES[productForm.categoryGroup]?.items.map((item) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                    <input required type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} placeholder="Price (NPR)" />
                    <input type="number" value={productForm.originalPrice} onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })} placeholder="Original Price" />
                    <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} placeholder="Stock" />
                    <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Description" rows="2" />
                    <div className="form-checkboxes">
                      <label><input type="checkbox" checked={productForm.newArrival} onChange={(e) => setProductForm({ ...productForm, newArrival: e.target.checked })} /> New Arrival</label>
                      <label><input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} /> Featured</label>
                      <label><input type="checkbox" checked={productForm.bestSeller} onChange={(e) => setProductForm({ ...productForm, bestSeller: e.target.checked })} /> Best Seller</label>
                    </div>
                    <button type="submit" className="btn-primary">{productForm.id ? 'Update' : 'Add'} Product</button>
                  </form>

                  <div className="product-list">
                    {products.map((product) => (
                      <div key={product.id} className="product-list-item">
                        <div>
                          <strong>{product.name}</strong>
                          <small>{product.brand} • {product.model} • {product.categoryGroup}</small>
                        </div>
                        <div className="product-list-actions">
                          <button className="btn-small" onClick={() => handleEditProduct(product)}>Edit</button>
                          <button className="btn-small danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {adminTab === 'content' && (
                <>
                  <h2>Website Content</h2>
                  <form className="admin-form" onSubmit={(e) => { e.preventDefault(); setFormMessage('Content updated!'); }}>
                    <input value={siteContent.phone} onChange={(e) => setSiteContent({ ...siteContent, phone: e.target.value })} placeholder="Phone" />
                    <input value={siteContent.email} onChange={(e) => setSiteContent({ ...siteContent, email: e.target.value })} placeholder="Email" />
                    <input value={siteContent.location} onChange={(e) => setSiteContent({ ...siteContent, location: e.target.value })} placeholder="Location" />
                    <textarea value={siteContent.about} onChange={(e) => setSiteContent({ ...siteContent, about: e.target.value })} placeholder="About us" rows="3" />
                    <button type="submit" className="btn-primary">Save Content</button>
                  </form>
                </>
              )}
            </section>
          </div>
        </main>
      </div>
    )
  }

  // ============================================================================
  // RENDER - STORE VIEW
  // ============================================================================

  return (
    <div className="app-shell">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            <div className="logo">
              <span className="logo-icon">⚡</span>
              <div className="logo-text">
                <strong>Panchakanya</strong>
                <small>Electric Emporium</small>
              </div>
            </div>
          </div>

          <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#brands" onClick={() => setMenuOpen(false)}>Brands</a>
            <a href="#categories" onClick={() => setMenuOpen(false)}>Products</a>
            <a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>

          <div className="navbar-actions">
            <input 
              type="search" 
              className="navbar-search" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="navbar-cta" target="_blank" rel="noreferrer">
              💬 WhatsApp
            </a>
            <button className="admin-btn" onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}>
              {currentView === 'admin' ? 'Store' : 'Admin'}
            </button>
          </div>
        </div>
      </header>

      <main className="store-main">
        {/* HERO SECTION */}
        <section id="home" className="hero">
          <div className="hero-content">
            <span className="hero-eyebrow">🏪 Trusted Electrical Emporium</span>
            <h1>Quality Electrical & Home Appliances</h1>
            <p>Explore premium fans, coolers, AC, refrigerators, kitchen appliances, and electrical products from trusted brands at competitive prices in Tandi, Chitwan.</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => { document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }) }}>Explore Products</button>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="btn-secondary" target="_blank" rel="noreferrer">📱 Chat on WhatsApp</a>
            </div>
          </div>
        </section>

        {/* BRANDS SECTION */}
        <section id="brands" className="brands-section">
          <div className="container">
            <div className="section-header">
              <h2>Our Trusted Brands</h2>
              <p>We supply quality products from leading brands</p>
            </div>
            <div className="brands-grid">
              {BRANDS_DATA.map((brand) => (
                <button
                  key={brand.id}
                  className={`brand-card ${selectedBrand === brand.name ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedBrand(selectedBrand === brand.name ? 'All' : brand.name)
                    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })
                  }}
                  title={`Filter by ${brand.name}`}
                >
                  <span className="brand-logo">{brand.logo}</span>
                  <span className="brand-name">{brand.name}</span>
                </button>
              ))}
              <button
                className={`brand-card ${selectedBrand === 'All' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedBrand('All')
                  document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span className="brand-logo">✨</span>
                <span className="brand-name">All Brands</span>
              </button>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="featured-products">
          <div className="container">
            <div className="section-header">
              <h2>Featured Products</h2>
              <p>Our best-selling items</p>
            </div>
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.images[0]} alt={product.name} />
                    {product.originalPrice > product.price && (
                      <span className="discount-badge">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                    {product.newArrival && <span className="new-badge">NEW</span>}
                  </div>
                  <div className="product-info">
                    <span className="product-brand">{product.brand}</span>
                    <h3>{product.name}</h3>
                    {product.model && <p className="product-model">Model: {product.model}</p>}
                    <div className="product-rating">
                      {'★'.repeat(Math.floor(product.rating))} ({product.reviewCount})
                    </div>
                    <div className="product-price">
                      <span className="price">{formatNPR(product.price)}</span>
                      {product.originalPrice > product.price && (
                        <span className="original-price">{formatNPR(product.originalPrice)}</span>
                      )}
                    </div>
                    <div className="product-buttons">
                      <button className="btn-view" onClick={() => setSelectedProduct(product)}>Details</button>
                      <button className="btn-whatsapp" onClick={() => setWhatsappConfirm(product)}>📱 Inquire</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section id="categories" className="categories-section">
          <div className="container">
            <div className="section-header">
              <h2>Shop by Category</h2>
              <p>Browse our organized product categories</p>
            </div>
            <div className="categories-grid">
              {Object.values(PRODUCT_CATEGORIES).map((category) => (
                <button
                  key={category.id}
                  className={`category-card ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === category.name ? 'All' : category.name)
                    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
              <button
                className={`category-card ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory('All')
                  document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span className="category-icon">🔍</span>
                <span className="category-name">All Products</span>
              </button>
            </div>
          </div>
        </section>

        {/* SHOP / PRODUCTS SECTION */}
        <section id="shop" className="shop-section">
          <div className="container">
            <div className="shop-header">
              <h2>Our Complete Catalog</h2>
              <div className="shop-controls">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* ACTIVE FILTERS DISPLAY */}
            <div className="filters-display">
              <div className="active-filters">
                {(selectedBrand !== 'All' || selectedCategory !== 'All' || searchTerm) && (
                  <>
                    <div className="filters-info">
                      <span>Active Filters:</span>
                      {selectedBrand !== 'All' && <span className="filter-tag">{selectedBrand} <button onClick={() => setSelectedBrand('All')}>×</button></span>}
                      {selectedCategory !== 'All' && <span className="filter-tag">{selectedCategory} <button onClick={() => setSelectedCategory('All')}>×</button></span>}
                      {searchTerm && <span className="filter-tag">"{searchTerm}" <button onClick={() => setSearchTerm('')}>×</button></span>}
                    </div>
                    <button className="reset-filters-btn" onClick={resetFilters}>
                      Clear All Filters
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* PRODUCTS GRID */}
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found matching your filters. Try adjusting your search or filters.</p>
                <button className="btn-primary" onClick={resetFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.images[0]} alt={product.name} />
                      {product.originalPrice > product.price && (
                        <span className="discount-badge">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                      {product.newArrival && <span className="new-badge">NEW</span>}
                    </div>
                    <div className="product-info">
                      <span className="product-brand">{product.brand}</span>
                      <h3>{product.name}</h3>
                      {product.model && <p className="product-model">Model: {product.model}</p>}
                      <div className="product-rating">
                        {'★'.repeat(Math.floor(product.rating))} ({product.reviewCount})
                      </div>
                      <div className="product-price">
                        <span className="price">{formatNPR(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="original-price">{formatNPR(product.originalPrice)}</span>
                        )}
                      </div>
                      <div className="product-buttons">
                        <button className="btn-view" onClick={() => setSelectedProduct(product)}>Details</button>
                        <button className="btn-whatsapp" onClick={() => setWhatsappConfirm(product)}>📱 Inquire</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="contact-section">
          <div className="container">
            <div className="contact-content">
              <div className="contact-info">
                <h2>Get in Touch</h2>
                <p>Questions about our products? Contact us today!</p>
                <div className="contact-details">
                  <div className="contact-item">
                    <span>📍</span>
                    <div>
                      <strong>Location</strong>
                      <p>{siteContent.location}</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span>📞</span>
                    <div>
                      <strong>Phone</strong>
                      <a href={`tel:${siteContent.phone}`}>{siteContent.phone}</a>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span>📧</span>
                    <div>
                      <strong>Email</strong>
                      <a href={`mailto:${siteContent.email}`}>{siteContent.email}</a>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span>🕐</span>
                    <div>
                      <strong>Hours</strong>
                      <p>{siteContent.hours}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="contact-cta">
                <h3>WhatsApp Support</h3>
                <p>Get instant replies and product information on WhatsApp.</p>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="btn-primary" target="_blank" rel="noreferrer">
                  💬 Open WhatsApp Chat
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>✕</button>
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedProduct.images[0]} alt={selectedProduct.name} />
              </div>
              <div className="modal-info">
                <span className="product-brand">{selectedProduct.brand}</span>
                <h2>{selectedProduct.name}</h2>
                {selectedProduct.model && <p className="product-model">Model: {selectedProduct.model}</p>}
                <div className="product-rating">
                  {'★'.repeat(Math.floor(selectedProduct.rating))} ({selectedProduct.reviewCount} reviews)
                </div>
                <div className="product-price">
                  <span className="price">{formatNPR(selectedProduct.price)}</span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="original-price">{formatNPR(selectedProduct.originalPrice)}</span>
                  )}
                </div>
                <p className="product-description">{selectedProduct.description}</p>
                <div className="product-specs">
                  <h4>Specifications</h4>
                  <ul>
                    {Object.entries(selectedProduct.specs).map(([key, value]) => (
                      <li key={key}><strong>{key}:</strong> {value}</li>
                    ))}
                  </ul>
                </div>
                <div className="product-features">
                  <h4>Features</h4>
                  <ul>
                    {selectedProduct.features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="product-warranty">
                  <strong>Warranty:</strong> {selectedProduct.warranty}
                </div>
                <div className="modal-buttons">
                  <button className="btn-primary" onClick={() => setWhatsappConfirm(selectedProduct)}>
                    📱 Inquire on WhatsApp
                  </button>
                  <button className="btn-secondary" onClick={() => setSelectedProduct(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP CONFIRMATION MODAL */}
      {whatsappConfirm && (
        <div className="modal-overlay" onClick={() => setWhatsappConfirm(null)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setWhatsappConfirm(null)}>✕</button>
            <div className="confirmation-body">
              <div className="confirmation-icon">💬</div>
              <h3>Send WhatsApp Inquiry</h3>
              <p>Would you like to send an inquiry about this product on WhatsApp?</p>
              <div className="confirmation-product">
                <strong>{whatsappConfirm.name}</strong>
                {whatsappConfirm.model && <span className="model-text">Model: {whatsappConfirm.model}</span>}
                <span className="price">{formatNPR(whatsappConfirm.price)}</span>
              </div>
              <div className="confirmation-buttons">
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    openWhatsAppLink(whatsappConfirm.name, whatsappConfirm.price, whatsappConfirm.model)
                    setWhatsappConfirm(null)
                  }}
                >
                  Continue to WhatsApp
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => setWhatsappConfirm(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
