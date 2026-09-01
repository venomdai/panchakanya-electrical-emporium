import { useEffect, useMemo, useState } from 'react'
import './App.css'

const formatNPR = (value) => `NPR ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`
const WHATSAPP_NUMBER = '9855033485'

const generateWhatsAppMessage = (productName, productPrice) => {
  const message = `Hello, I am interested in ${productName}. The listed price is NPR ${productPrice.toLocaleString('en-US')}. Could you please provide more information about this item?`
  return encodeURIComponent(message)
}

const openWhatsAppLink = (productName, productPrice) => {
  const message = generateWhatsAppMessage(productName, productPrice)
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
  window.open(waLink, '_blank')
}

const defaultCategories = [
  { id: 'fans', name: 'Fans', icon: '🌀' },
  { id: 'cooling', name: 'Coolers & AC', icon: '❄️' },
  { id: 'kitchen', name: 'Kitchen Appliances', icon: '🍳' },
  { id: 'motors', name: 'Motors & Pumps', icon: '⚙️' },
  { id: 'lighting', name: 'Lights & Chandeliers', icon: '💡' },
  { id: 'electrical', name: 'Electrical Accessories', icon: '🔌' },
  { id: 'small-electrical', name: 'Small Electrical Appliances', icon: '⚡' },
  { id: 'home', name: 'Home Appliances', icon: '🏠' },
]

const defaultBrands = ['CG', 'Himstar', 'Samsung', 'LG', 'Philips', 'Panasonic', 'Midea', 'Haier', 'Baltra', 'Orient', 'Crompton', 'Usha']

const defaultProducts = [
  {
    id: 'prod-1',
    name: 'Samsung 43" Smart TV',
    brand: 'Samsung',
    category: 'Home Appliances',
    model: 'UA43T',
    sku: 'TV-43-SAM',
    price: 63999,
    originalPrice: 69999,
    discount: 9,
    stock: 14,
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    newArrival: true,
    featured: true,
    bestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'A sleek 43-inch smart TV designed for immersive entertainment and smart living in Nepalese homes.',
    features: ['4K UHD display', 'Smart TV platform', 'Voice assistant ready', 'Ultra slim frame'],
    specs: { Screen: '43 inch', Resolution: '3840x2160', Connectivity: 'Wi-Fi, HDMI, USB', Warranty: '1 Year' },
    warranty: '1 Year Manufacturer Warranty',
    delivery: 'Free delivery within Tandi and nearby areas.',
  },
  {
    id: 'prod-2',
    name: 'LG 7KG Washing Machine',
    brand: 'LG',
    category: 'Home Appliances',
    model: 'F2B7',
    sku: 'WM-7-LG',
    price: 55999,
    originalPrice: 63999,
    discount: 13,
    stock: 8,
    rating: 4.7,
    reviewCount: 96,
    inStock: true,
    newArrival: false,
    featured: true,
    bestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'High-efficiency 7KG washing machine for modern households seeking dependable performance and low noise.',
    features: ['7 kg capacity', 'Energy efficient', 'Multiple wash programs', 'Turbo drum'],
    specs: { Capacity: '7 KG', Energy: '5 Star', Control: 'Fully Automatic', Warranty: '2 Years' },
    warranty: '2 Year Warranty on Motor',
    delivery: 'Home delivery and installation support available.',
  },
  {
    id: 'prod-3',
    name: 'Philips Electric Kettle',
    brand: 'Philips',
    category: 'Kitchen Appliances',
    model: 'HD9306',
    sku: 'KET-1-PHI',
    price: 3499,
    originalPrice: 4499,
    discount: 22,
    stock: 31,
    rating: 4.5,
    reviewCount: 81,
    inStock: true,
    newArrival: true,
    featured: true,
    bestSeller: false,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Fast heating electric kettle crafted for daily tea and coffee brewing with safety and convenience in mind.',
    features: ['1.5L capacity', 'Auto shut-off', 'Rapid boiling', 'Heat resistant body'],
    specs: { Capacity: '1.5 L', Power: '1500W', Material: 'Stainless Steel', Warranty: '1 Year' },
    warranty: '1 Year Service Warranty',
    delivery: 'Available for same-day delivery in Tandi area.',
  },
  {
    id: 'prod-4',
    name: 'Panasonic Rice Cooker',
    brand: 'Panasonic',
    category: 'Kitchen Appliances',
    model: 'SR-DF101',
    sku: 'RC-10-PAN',
    price: 4999,
    originalPrice: 6299,
    discount: 21,
    stock: 19,
    rating: 4.6,
    reviewCount: 68,
    inStock: true,
    newArrival: false,
    featured: false,
    bestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Easy-to-use rice cooker with multiple cooking modes for everyday family meals and busy schedules.',
    features: ['Multi-cook function', 'Keep warm mode', 'Non-stick inner pot', 'Safe locking lid'],
    specs: { Capacity: '5.5 Cups', Power: '700W', Features: 'Keep Warm', Warranty: '1 Year' },
    warranty: '1 Year Warranty',
    delivery: 'Delivery and demo guidance available at the store.',
  },
  {
    id: 'prod-5',
    name: 'CG Air Cooler',
    brand: 'CG',
    category: 'Coolers & AC',
    model: 'Dream Air',
    sku: 'AC-COOL-CG',
    price: 18999,
    originalPrice: 21999,
    discount: 14,
    stock: 12,
    rating: 4.4,
    reviewCount: 55,
    inStock: true,
    newArrival: true,
    featured: true,
    bestSeller: false,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Efficient air cooler for warm Nepali summers, bringing comfortable airflow and cooling to your room.',
    features: ['Powerful airflow', 'Low power consumption', 'Remote control', 'Large water tank'],
    specs: { Capacity: '55L', Type: 'Desert Cooler', Motor: 'High Speed', Warranty: '1 Year' },
    warranty: '1 Year Warranty Support',
    delivery: 'Available across Chitwan with installation support.',
  },
  {
    id: 'prod-6',
    name: 'Himstar Premium Ceiling Fan',
    brand: 'Himstar',
    category: 'Fans',
    model: 'HF-120',
    sku: 'FAN-HIM-120',
    price: 3999,
    originalPrice: 4999,
    discount: 20,
    stock: 49,
    rating: 4.3,
    reviewCount: 73,
    inStock: true,
    newArrival: false,
    featured: false,
    bestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Durable ceiling fan with balanced airflow and quiet operation for homes, shops, and offices.',
    features: ['High-speed motor', 'Low-noise operation', 'Energy efficient', 'Modern blade design'],
    specs: { Size: '120 CM', Speed: '3 Speed', Power: '60W', Warranty: '1 Year' },
    warranty: '1 Year Motor Warranty',
    delivery: 'Quick delivery across Chitwan.',
  },
  {
    id: 'prod-7',
    name: 'Midea 750W Mixer Grinder',
    brand: 'Midea',
    category: 'Kitchen Appliances',
    model: 'MG-550',
    sku: 'MG-550-MID',
    price: 5999,
    originalPrice: 7499,
    discount: 20,
    stock: 23,
    rating: 4.4,
    reviewCount: 52,
    inStock: true,
    newArrival: true,
    featured: true,
    bestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Strong mixer grinder for efficient chopping, blending, and grinding in daily kitchen tasks.',
    features: ['3 jars included', 'Powerful motor', 'Quick grinding', 'Easy-clean body'],
    specs: { Power: '750W', Jars: '3 Units', Material: 'Stainless Steel', Warranty: '1 Year' },
    warranty: '1 Year Warranty',
    delivery: 'Store pickup and home delivery available.',
  },
  {
    id: 'prod-13',
    name: 'CG 1.5 Ton Inverter AC',
    brand: 'CG',
    category: 'Coolers & AC',
    model: 'AC-INV-18',
    sku: 'AC-18-CG',
    price: 89999,
    originalPrice: 99999,
    discount: 10,
    stock: 6,
    rating: 4.7,
    reviewCount: 32,
    inStock: true,
    newArrival: true,
    featured: true,
    bestSeller: false,
    images: ['https://images.unsplash.com/photo-1631545806609-9c7f6d90b1e3?auto=format&fit=crop&w=1200&q=80'],
    description: 'Energy-efficient inverter AC for cool, comfortable rooms through hot summer days.',
    features: ['1.5 ton capacity', 'Inverter technology', 'Fast cooling', 'Sleep mode'],
    specs: { Capacity: '1.5 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' },
    warranty: '2 Year Comprehensive Warranty',
    delivery: 'Installation support available across Chitwan.',
  },
  {
    id: 'prod-14',
    name: 'Crompton 1HP Water Pump Motor',
    brand: 'Crompton',
    category: 'Motors & Pumps',
    model: 'MB-1HP',
    sku: 'MOTOR-1HP-CRO',
    price: 14999,
    originalPrice: 16999,
    discount: 12,
    stock: 9,
    rating: 4.6,
    reviewCount: 28,
    inStock: true,
    newArrival: true,
    featured: true,
    bestSeller: true,
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'],
    description: 'Reliable water pump motor for homes, shops, and small commercial water systems.',
    features: ['1HP motor', 'Copper winding', 'Strong build', 'Low maintenance'],
    specs: { Power: '1 HP', Voltage: '220V', Type: 'Water Pump Motor', Warranty: '1 Year' },
    warranty: '1 Year Motor Warranty',
    delivery: 'Delivery and fitting guidance available.',
  },
  {
    id: 'prod-15',
    name: 'Decorative LED Chandelier',
    brand: 'Philips',
    category: 'Lights & Chandeliers',
    model: 'CH-LED-06',
    sku: 'CHAN-LED-PHI',
    price: 12499,
    originalPrice: 14999,
    discount: 17,
    stock: 7,
    rating: 4.5,
    reviewCount: 19,
    inStock: true,
    newArrival: true,
    featured: true,
    bestSeller: false,
    images: ['https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80'],
    description: 'Statement LED chandelier that brings warm, modern character to living and dining spaces.',
    features: ['Integrated LED', 'Warm white light', 'Modern design', 'Easy ceiling mount'],
    specs: { Power: '48W', Color: 'Warm White', Type: 'Decorative Chandelier', Warranty: '1 Year' },
    warranty: '1 Year Product Warranty',
    delivery: 'Careful delivery with installation guidance.',
  },
  {
    id: 'prod-16',
    name: 'Philips LED Tube Light Pack',
    brand: 'Philips',
    category: 'Lights & Chandeliers',
    model: 'TUBE-20W',
    sku: 'TUBE-20-PHI',
    price: 999,
    originalPrice: 1299,
    discount: 23,
    stock: 84,
    rating: 4.8,
    reviewCount: 74,
    inStock: true,
    newArrival: false,
    featured: false,
    bestSeller: true,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80'],
    description: 'Bright, efficient LED tube lights for homes, offices, shops, and workspaces.',
    features: ['Low power use', 'Bright daylight', 'Long lifespan', 'Flicker-free light'],
    specs: { Power: '20W', Color: 'Daylight', Life: '15,000 Hours', Warranty: '1 Year' },
    warranty: '1 Year Product Warranty',
    delivery: 'Retail and bulk supply available.',
  },
  {
    id: 'prod-8',
    name: 'Geyser / Water Heater',
    brand: 'Haier',
    category: 'Home Appliances',
    model: 'GW-25',
    sku: 'GEY-25-HAI',
    price: 11999,
    originalPrice: 13999,
    discount: 14,
    stock: 10,
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    newArrival: false,
    featured: true,
    bestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1620626011761-e2e69d6f0d8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Reliable water heater with durable insulation and efficient heating for household comfort.',
    features: ['Quick heat-up', 'Safety valve', 'Thermostat control', 'Corrosion resistant tank'],
    specs: { Capacity: '25L', Power: '2000W', Type: 'Storage Geyser', Warranty: '2 Years' },
    warranty: '2 Year Warranty',
    delivery: 'Installation available on request.',
  },
  {
    id: 'prod-9',
    name: 'Induction Cooker',
    brand: 'Baltra',
    category: 'Kitchen Appliances',
    model: 'IC-1800',
    sku: 'IND-1800-BAL',
    price: 6599,
    originalPrice: 7999,
    discount: 18,
    stock: 17,
    rating: 4.5,
    reviewCount: 47,
    inStock: true,
    newArrival: true,
    featured: false,
    bestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Compact induction cooker for fast, energy-saving cooking in homes and small kitchens.',
    features: ['1800W power', 'Touch panel', 'Energy efficient', 'Safety shutoff'],
    specs: { Power: '1800W', Voltage: '220V', Controls: 'Touch', Warranty: '1 Year' },
    warranty: '1 Year Service Warranty',
    delivery: 'Delivered to your door in Chitwan.',
  },
  {
    id: 'prod-10',
    name: 'Electric Iron',
    brand: 'WAI WAI',
    category: 'Small Electrical Appliances',
    model: 'Iron-240',
    sku: 'IRON-240-WAI',
    price: 2699,
    originalPrice: 3299,
    discount: 18,
    stock: 28,
    rating: 4.2,
    reviewCount: 37,
    inStock: true,
    newArrival: false,
    featured: false,
    bestSeller: false,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Everyday electric iron with smooth glide performance and safe temperature control.',
    features: ['Non-stick soleplate', 'Temperature control', 'Quick heating', 'Lightweight'],
    specs: { Power: '1000W', Weight: '1.2 kg', Safety: 'Auto cut-off', Warranty: '1 Year' },
    warranty: '1 Year Warranty',
    delivery: 'Quick supply across the local market.',
  },
  {
    id: 'prod-11',
    name: 'LED Bulb Pack',
    brand: 'Philips',
    category: 'Electrical Accessories',
    model: 'LED-12W',
    sku: 'LED-12-PHI',
    price: 699,
    originalPrice: 899,
    discount: 22,
    stock: 120,
    rating: 4.7,
    reviewCount: 66,
    inStock: true,
    newArrival: true,
    featured: false,
    bestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Energy-saving LED bulbs ideal for homes, shops, offices, and general lighting needs.',
    features: ['Low energy consumption', 'Long lifespan', 'Bright daylight', 'Eco-friendly'],
    specs: { Power: '12W', Color: 'Warm White', Life: '10,000 Hours', Warranty: '1 Year' },
    warranty: '1 Year Product Warranty',
    delivery: 'Wholesale and retail supply available.',
  },
  {
    id: 'prod-12',
    name: 'Switch & Socket Combo',
    brand: 'CG',
    category: 'Electrical Accessories',
    model: 'SW-350',
    sku: 'SWB-350-CG',
    price: 1299,
    originalPrice: 1599,
    discount: 19,
    stock: 86,
    rating: 4.4,
    reviewCount: 41,
    inStock: true,
    newArrival: false,
    featured: false,
    bestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Premium quality electrical fittings for safe and reliable residential wiring solutions.',
    features: ['Safe insulation', 'Easy installation', 'Elegant finish', 'Durable design'],
    specs: { Type: 'Switch & Socket', Material: 'Polycarbonate', Pack: '1 Unit', Warranty: '1 Year' },
    warranty: '1 Year Electrical Warranty',
    delivery: 'Available for both retail and project orders.',
  },
]

const defaultReviews = [
  { id: 'rev-1', name: 'Ramesh K.C.', rating: 5, review: 'Excellent service and quick delivery. The TV looks amazing in our home.', approved: true },
  { id: 'rev-2', name: 'Sapana Poudel', rating: 5, review: 'Very helpful staff and fair pricing on our washing machine. Highly recommended.', approved: true },
  { id: 'rev-3', name: 'Bikash Shrestha', rating: 4, review: 'The rice cooker works very well and the store team was polite and professional.', approved: true },
  { id: 'rev-4', name: 'Anita Giri', rating: 5, review: 'Good quality electrical products and a trusted local shop in Chitwan.', approved: false, pending: true },
]

const defaultSiteContent = {
  announcement: 'Fans, coolers, AC, motors, lights and appliances from trusted brands.',
  location: 'Tandi, Chitwan, Nepal',
  phone: '+977-9845-123456',
  whatsapp: '+977-9800-987654',
  email: 'sales@simonelectric.com.np',
  hours: 'Sun - Fri: 9:00 AM - 7:00 PM',
  tagline: 'Powering Your Home, One Better Product at a Time.',
  slogan: 'Better Brands. Better Choices. Better Everyday Living.',
  about: 'Panchakanya Electric Emporium is a trusted electrical and appliance shop based in Tandi, Chitwan. We supply fans, coolers, AC units, mixer grinders, motors, chandeliers, lights, and everyday electrical essentials from reliable brands at competitive prices.',
  socialLinks: { facebook: '#', instagram: '#', tiktok: '#', whatsapp: 'https://wa.me/9779800987654' },
}

const defaultWhyChooseUs = [
  'Quality Products',
  'Competitive Prices',
  'Trusted Local Store',
  'Warranty Support',
  'Customer Service',
  'Delivery Available',
]

const persistedState = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [products, setProducts] = useState(() => persistedState('simon-products-v2', defaultProducts))
  const [categories, setCategories] = useState(() => persistedState('simon-categories-v2', defaultCategories))
  const [brands, setBrands] = useState(() => persistedState('simon-brands-v2', defaultBrands))
  const [siteContent, setSiteContent] = useState(() => persistedState('simon-site-content', defaultSiteContent))
  const [whyChooseUs] = useState(() => persistedState('simon-why', defaultWhyChooseUs))
  const [reviews, setReviews] = useState(() => persistedState('simon-reviews', defaultReviews))
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [whatsappConfirm, setWhatsappConfirm] = useState(null)
  const [currentView, setCurrentView] = useState('store')
  const [adminTab, setAdminTab] = useState('products')
  const [formMessage, setFormMessage] = useState('')
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    brand: 'Samsung',
    category: 'Home Appliances',
    model: '',
    sku: '',
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

  useEffect(() => { localStorage.setItem('simon-products-v2', JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem('simon-categories-v2', JSON.stringify(categories)) }, [categories])
  useEffect(() => { localStorage.setItem('simon-brands-v2', JSON.stringify(brands)) }, [brands])
  useEffect(() => { localStorage.setItem('simon-site-content', JSON.stringify(siteContent)) }, [siteContent])
  useEffect(() => { localStorage.setItem('simon-why', JSON.stringify(whyChooseUs)) }, [whyChooseUs])
  useEffect(() => { localStorage.setItem('simon-reviews', JSON.stringify(reviews)) }, [reviews])

  const newArrivalProducts = useMemo(() => products.filter((product) => product.newArrival).slice(0, 8), [products])
  const bestSellerProducts = useMemo(() => products.filter((product) => product.bestSeller).slice(0, 8), [products])
  const approvedReviews = useMemo(() => reviews.filter((review) => review.approved), [reviews])

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    const filtered = products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)

      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })

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
  }, [products, searchTerm, selectedCategory, sortBy])

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
      discount: productForm.originalPrice
        ? Math.round(((Number(productForm.originalPrice) - Number(productForm.price)) / Number(productForm.originalPrice)) * 100)
        : 0,
      rating: 4.5,
      reviewCount: 0,
      inStock: Number(productForm.stock) > 0,
      newArrival: Boolean(productForm.newArrival),
      featured: Boolean(productForm.featured),
      bestSeller: Boolean(productForm.bestSeller),
      description: productForm.description || 'Premium product available at Panchakanya Electric Emporium.',
      features: ['Quality Construction', 'Trusted Brand', 'Reliable Performance'],
      specs: { Warranty: productForm.warranty || '1 Year' },
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
      category: 'Home Appliances',
      model: '',
      sku: '',
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

  const handleEditProduct = (product) => {
    setProductForm(product)
    setAdminTab('products')
  }

  const handleDeleteProduct = (productId) => {
    setProducts((current) => current.filter((item) => item.id !== productId))
  }

  const resetCatalog = () => {
    if (!window.confirm('Replace the current catalog with the sample products?')) return
    setProducts(defaultProducts)
    setFormMessage('Sample catalog restored.')
  }

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
                <strong>Panchakanya Electric Emporium</strong>
                <small>Tandi, Chitwan</small>
              </div>
            </div>
          </div>

          <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a>
            <a href="#categories" onClick={() => setMenuOpen(false)}>Categories</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="navbar-wa-btn" target="_blank" rel="noreferrer">
              📞 WhatsApp
            </a>
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
              💬 Chat
            </a>
            <button className="admin-btn" onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}>
              {currentView === 'admin' ? 'Store' : 'Admin'}
            </button>
          </div>
        </div>
      </header>

      {currentView === 'admin' ? (
        <main className="admin-container">
          <div className="admin-layout">
            <aside className="admin-sidebar">
              <h3>Admin Dashboard</h3>
              <button className={adminTab === 'products' ? 'active' : ''} onClick={() => setAdminTab('products')}>Products</button>
              <button className={adminTab === 'categories' ? 'active' : ''} onClick={() => setAdminTab('categories')}>Categories</button>
              <button className={adminTab === 'content' ? 'active' : ''} onClick={() => setAdminTab('content')}>Website Content</button>
            </aside>

            <section className="admin-panel">
              {formMessage && <div className="alert">{formMessage}</div>}

              {adminTab === 'products' && (
                <>
                  <div className="admin-header">
                    <h2>Product Management</h2>
                    <button className="btn-secondary" onClick={resetCatalog}>Restore Sample</button>
                  </div>

                  <form className="admin-form" onSubmit={handleProductSubmit}>
                    <input required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="Product name" />
                    <input value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} placeholder="Brand" />
                    <select required value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                      {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                    <input value={productForm.model} onChange={(e) => setProductForm({ ...productForm, model: e.target.value })} placeholder="Model" />
                    <input required type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} placeholder="Price (NPR)" />
                    <input type="number" value={productForm.originalPrice} onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })} placeholder="Original Price" />
                    <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} placeholder="Stock" />
                    <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Description" rows="2" />
                    <input value={productForm.images[0]} onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })} placeholder="Image URL" />
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
                          <small>{product.brand} • {product.category}</small>
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

              {adminTab === 'categories' && (
                <>
                  <h2>Categories</h2>
                  <div className="product-list">
                    {categories.map((cat, idx) => (
                      <div key={cat.id} className="product-list-item">
                        <div>
                          <strong>{cat.icon} {cat.name}</strong>
                        </div>
                        <button className="btn-small danger" onClick={() => setCategories(categories.filter((_, i) => i !== idx))}>Delete</button>
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary" onClick={() => setCategories([...categories, { id: `cat-${Date.now()}`, name: 'New Category', icon: '📦' }])}>Add Category</button>
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
      ) : (
        <main className="store-main">
          {/* HERO SECTION */}
          <section className="hero">
            <div className="hero-content">
              <span className="hero-eyebrow">🏪 Trusted Electrical Shop</span>
              <h1>Quality Products for Modern Homes</h1>
              <p>Shop fans, coolers, AC, kitchen appliances, motors, lights, and more from trusted brands at competitive prices in Tandi, Chitwan.</p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => { document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }) }}>Shop Now</button>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="btn-secondary" target="_blank" rel="noreferrer">📱 Chat on WhatsApp</a>
              </div>
            </div>
          </section>

          {/* WHY CHOOSE US */}
          <section className="why-choose">
            <div className="container">
              <h2>Why Choose Panchakanya Electric Emporium?</h2>
              <div className="why-grid">
                <div className="why-card">
                  <span>✅</span>
                  <h3>Quality Products</h3>
                  <p>Genuine products from trusted brands</p>
                </div>
                <div className="why-card">
                  <span>💰</span>
                  <h3>Competitive Prices</h3>
                  <p>Best prices in the market</p>
                </div>
                <div className="why-card">
                  <span>🏪</span>
                  <h3>Local Trusted Store</h3>
                  <p>Serving Tandi, Chitwan for years</p>
                </div>
                <div className="why-card">
                  <span>🔧</span>
                  <h3>Warranty Support</h3>
                  <p>Full warranty and after-sales service</p>
                </div>
                <div className="why-card">
                  <span>🚚</span>
                  <h3>Delivery Available</h3>
                  <p>Free delivery in local areas</p>
                </div>
                <div className="why-card">
                  <span>📞</span>
                  <h3>Customer Support</h3>
                  <p>Friendly and helpful team</p>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURED PRODUCTS */}
          <section className="featured-products">
            <div className="container">
              <div className="section-header">
                <h2>Featured Products</h2>
                <p>Best selling items from our catalog</p>
              </div>
              <div className="products-grid">
                {bestSellerProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.images[0]} alt={product.name} />
                      {product.discount > 0 && <span className="discount-badge">{product.discount}% OFF</span>}
                      {product.newArrival && <span className="new-badge">NEW</span>}
                    </div>
                    <div className="product-info">
                      <span className="product-category">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p className="product-brand">{product.brand}</p>
                      <div className="product-rating">
                        {'★'.repeat(Math.floor(product.rating))} ({product.reviewCount})
                      </div>
                      <div className="product-price">
                        <span className="price">{formatNPR(product.price)}</span>
                        {product.originalPrice > product.price && <span className="original-price">{formatNPR(product.originalPrice)}</span>}
                      </div>
                      <div className="product-buttons">
                        <button className="btn-view" onClick={() => setSelectedProduct(product)}>View Details</button>
                        <button className="btn-whatsapp" onClick={() => setWhatsappConfirm(product)}>📱 Inquire</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CATEGORIES */}
          <section id="categories" className="categories-section">
            <div className="container">
              <div className="section-header">
                <h2>Shop by Category</h2>
                <p>Browse our wide range of products</p>
              </div>
              <div className="categories-grid">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-card ${selectedCategory === category.name ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(category.name)
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

          {/* SHOP / PRODUCTS */}
          <section id="shop" className="shop-section">
            <div className="container">
              <div className="shop-header">
                <h2>Our Products</h2>
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

              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <p>No products found. Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        <img src={product.images[0]} alt={product.name} />
                        {product.discount > 0 && <span className="discount-badge">{product.discount}% OFF</span>}
                        {product.newArrival && <span className="new-badge">NEW</span>}
                      </div>
                      <div className="product-info">
                        <span className="product-category">{product.category}</span>
                        <h3>{product.name}</h3>
                        <p className="product-brand">{product.brand}</p>
                        <div className="product-rating">
                          {'★'.repeat(Math.floor(product.rating))} ({product.reviewCount})
                        </div>
                        <div className="product-price">
                          <span className="price">{formatNPR(product.price)}</span>
                          {product.originalPrice > product.price && <span className="original-price">{formatNPR(product.originalPrice)}</span>}
                        </div>
                        <div className="product-buttons">
                          <button className="btn-view" onClick={() => setSelectedProduct(product)}>View Details</button>
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
                  <p>Have questions? Reach out to us!</p>
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
                  <h3>Quick Support</h3>
                  <p>Chat with us on WhatsApp for instant replies and product inquiries.</p>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="btn-primary" target="_blank" rel="noreferrer">
                    💬 Open WhatsApp Chat
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* REVIEWS */}
          <section className="reviews-section">
            <div className="container">
              <div className="section-header">
                <h2>Customer Reviews</h2>
                <p>What our customers say about us</p>
              </div>
              <div className="reviews-grid">
                {approvedReviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <strong>{review.name}</strong>
                      <span className="review-rating">{'★'.repeat(review.rating)}</span>
                    </div>
                    <p>{review.review}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

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
                <span className="product-category">{selectedProduct.category}</span>
                <h2>{selectedProduct.name}</h2>
                <p className="product-brand">{selectedProduct.brand}</p>
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
                    📱 Ask About This Item on WhatsApp
                  </button>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="btn-secondary" target="_blank" rel="noreferrer">
                    💬 General Inquiry
                  </a>
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
              <h3>Confirm WhatsApp Inquiry</h3>
              <p>Would you like to continue to WhatsApp to inquire about this item?</p>
              <div className="confirmation-product">
                <strong>{whatsappConfirm.name}</strong>
                <span className="price">{formatNPR(whatsappConfirm.price)}</span>
              </div>
              <p className="confirmation-text">
                A message will be pre-filled with the product name and price.
              </p>
              <div className="confirmation-buttons">
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    openWhatsAppLink(whatsappConfirm.name, whatsappConfirm.price)
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
