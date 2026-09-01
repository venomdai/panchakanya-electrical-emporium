import { useEffect, useMemo, useState } from 'react'
import './App.css'

const formatNPR = (value) => `NPR ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`
const WHATSAPP_NUMBER = '9779800987654'

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
    category: 'Electrical & Accessories',
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
    category: 'Electrical & Accessories',
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
  about: 'Simon Electric is a trusted electrical and appliance shop based in Tandi, Chitwan. We supply fans, coolers, AC units, mixer grinders, motors, chandeliers, lights, and everyday electrical essentials from reliable brands at competitive prices.',
  socialLinks: { facebook: '#', instagram: '#', tiktok: '#', whatsapp: 'https://wa.me/9779800987654' },
}

const defaultWhyChooseUs = [
  'Genuine Products',
  'Competitive Prices',
  'Trusted Local Store',
  'Warranty Support',
  'Customer Service',
  'Delivery Available',
]

const persistedState = (key, fallback) => {
  try {
    const safeKey = key
    const stored = localStorage.getItem(safeKey)
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
  const [orders, setOrders] = useState(() => persistedState('simon-orders', []))
  const [cart, setCart] = useState(() => persistedState('simon-cart', []))
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [priceRange, setPriceRange] = useState(120000)
  const [stockOnly, setStockOnly] = useState(false)
  const [discountOnly, setDiscountOnly] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('featured')
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentView, setCurrentView] = useState('store')
  const [adminTab, setAdminTab] = useState('products')
  const [quickProduct, setQuickProduct] = useState(null)
  const [formMessage, setFormMessage] = useState('')
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Chitwan',
    area: '',
    deliveryAddress: '',
    orderNotes: '',
    paymentMethod: 'Cash on Delivery',
  })
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
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    ],
  })

  useEffect(() => { localStorage.setItem('simon-products-v2', JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem('simon-categories-v2', JSON.stringify(categories)) }, [categories])
  useEffect(() => { localStorage.setItem('simon-brands-v2', JSON.stringify(brands)) }, [brands])
  useEffect(() => { localStorage.setItem('simon-site-content', JSON.stringify(siteContent)) }, [siteContent])
  useEffect(() => { localStorage.setItem('simon-why', JSON.stringify(whyChooseUs)) }, [whyChooseUs])
  useEffect(() => { localStorage.setItem('simon-reviews', JSON.stringify(reviews)) }, [reviews])
  useEffect(() => { localStorage.setItem('simon-orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => { localStorage.setItem('simon-cart', JSON.stringify(cart)) }, [cart])

  const newArrivalProducts = useMemo(() => products.filter((product) => product.newArrival).slice(0, 6), [products])
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
        product.model.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)

      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand
      const matchesPrice = product.price <= priceRange
      const matchesStock = !stockOnly || product.inStock
      const matchesDiscount = !discountOnly || product.discount > 0
      const matchesRating = product.rating >= minRating

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock && matchesDiscount && matchesRating
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
  }, [products, searchTerm, selectedCategory, selectedBrand, priceRange, stockOnly, discountOnly, minRating, sortBy])

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const discountValue = cart.reduce((sum, item) => sum + (item.originalPrice ? (item.originalPrice - item.price) * item.qty : 0), 0)
  const deliveryFee = subtotal > 30000 ? 0 : cart.length ? 450 : 0
  const total = subtotal + deliveryFee

  const handleAddToCart = (product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, qty: Math.min(item.qty + quantity, product.stock) } : item,
        )
      }
      return [...current, { ...product, qty: Math.min(quantity, product.stock) }]
    })
    setCartOpen(true)
  }

  const updateCartQty = (id, delta) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item.id !== id) return item
          const nextQty = item.qty + delta
          return { ...item, qty: Math.max(1, Math.min(nextQty, item.stock)) }
        })
        .filter((item) => item.qty > 0),
    )
  }

  const removeFromCart = (id) => setCart((current) => current.filter((item) => item.id !== id))

  const handleOrderSubmit = (event) => {
    event.preventDefault()
    if (!cart.length) {
      setFormMessage('Your cart is empty. Add a product before checkout.')
      return
    }

    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      customer: checkoutForm,
      items: cart,
      subtotal,
      discount: discountValue,
      delivery: deliveryFee,
      total,
      status: 'Pending',
      paymentMethod: checkoutForm.paymentMethod,
    }

    setOrders((current) => [order, ...current])
    setCart([])
    setCheckoutForm({
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: 'Chitwan',
      area: '',
      deliveryAddress: '',
      orderNotes: '',
      paymentMethod: 'Cash on Delivery',
    })
    setFormMessage('Order placed successfully! We will contact you shortly.')
    setCheckoutOpen(false)
    setCurrentView('store')
  }

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
      description: productForm.description || 'Premium product available at Simon Electric.',
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
    setFormMessage('Product saved successfully and added to the catalog.')
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
    setCategories(defaultCategories)
    setBrands(defaultBrands)
    setFormMessage('Sample catalog restored. You can now edit or replace the products.')
  }

  const submitReview = (event) => {
    event.preventDefault()
    const form = event.target
    const review = {
      id: `rev-${Date.now()}`,
      name: form.name.value,
      rating: Number(form.rating.value),
      review: form.review.value,
      approved: false,
      pending: true,
    }
    setReviews((current) => [review, ...current])
    form.reset()
    setFormMessage('Thank you! Your review is pending approval by the store admin.')
  }

  return (
    <div className="app-shell">
      <div className="announcement-bar">
        <div className="container announcement-inner">
          <span>{siteContent.announcement}</span>
          <a href="#contact" className="announcement-link">Get in touch</a>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <div className="brand-wrap">
            <button type="button" className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Open menu">
              ☰
            </button>
            <div className="logo-block" aria-label="Simon Electric logo">
              <div className="logo-mark">S</div>
              <div>
                <strong>Simon Electric</strong>
                <small>Tandi, Chitwan</small>
              </div>
            </div>
          </div>

          <label className="search-bar" aria-label="Search products">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search products, brands and categories..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <div className="header-actions">
            <button type="button" className="icon-button" aria-label="Account">👤</button>
            <button type="button" className="icon-button" aria-label="Wishlist">♡</button>
            <button type="button" className="cart-button" onClick={() => setCartOpen(true)} aria-label="Open cart">
              🛒
              <span>{cartCount}</span>
            </button>
            <a href={`tel:${siteContent.phone}`} className="call-button">Call Now</a>
            <button type="button" className="admin-trigger" onClick={() => setCurrentView((value) => (value === 'admin' ? 'store' : 'admin'))}>
              {currentView === 'admin' ? 'Store View' : 'Admin'}
            </button>
          </div>
        </div>

        <nav className={`main-nav ${menuOpen ? 'show-menu' : ''}`}>
          <div className="container nav-inner">
            <a href="#home">Home</a>
            <a href="#shop">Shop</a>
            <a href="#categories">Categories</a>
            <a href="#deals">Deals</a>
            <a href="#new-arrivals">New Arrivals</a>
            <a href="#brands">Brands</a>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
      </header>

      {currentView === 'admin' ? (
        <main className="admin-container container">
          <div className="admin-shell">
            <aside className="admin-sidebar">
              <h3>Admin Dashboard</h3>
              <button type="button" className={adminTab === 'products' ? 'active' : ''} onClick={() => setAdminTab('products')}>Products</button>
              <button type="button" className={adminTab === 'categories' ? 'active' : ''} onClick={() => setAdminTab('categories')}>Categories</button>
              <button type="button" className={adminTab === 'orders' ? 'active' : ''} onClick={() => setAdminTab('orders')}>Orders</button>
              <button type="button" className={adminTab === 'reviews' ? 'active' : ''} onClick={() => setAdminTab('reviews')}>Reviews</button>
              <button type="button" className={adminTab === 'content' ? 'active' : ''} onClick={() => setAdminTab('content')}>Website Content</button>
            </aside>
            <section className="admin-panel">
              {formMessage && <div className="form-message">{formMessage}</div>}

              {adminTab === 'products' && (
                <>
                  <div className="admin-heading-row">
                    <div>
                      <span className="eyebrow">Store inventory</span>
                      <h2>Product Management</h2>
                      <p>Add your real products here. Placeholder names, prices, and images can be replaced anytime.</p>
                    </div>
                    <button type="button" className="outline-button" onClick={resetCatalog}>Restore sample catalog</button>
                  </div>
                  <form className="admin-form" onSubmit={handleProductSubmit}>
                    <div className="two-col">
                      <input required value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} placeholder="Product name (e.g. XYZ Ceiling Fan)" />
                      <input list="brand-options" value={productForm.brand} onChange={(event) => setProductForm({ ...productForm, brand: event.target.value })} placeholder="Brand" />
                      <datalist id="brand-options">{brands.map((brand) => <option key={brand} value={brand} />)}</datalist>
                    </div>
                    <div className="two-col">
                      <select required value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}>
                        {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
                      </select>
                      <input value={productForm.model} onChange={(event) => setProductForm({ ...productForm, model: event.target.value })} placeholder="Model" />
                    </div>
                    <div className="two-col">
                      <input value={productForm.sku} onChange={(event) => setProductForm({ ...productForm, sku: event.target.value })} placeholder="SKU" />
                      <input value={productForm.warranty} onChange={(event) => setProductForm({ ...productForm, warranty: event.target.value })} placeholder="Warranty" />
                    </div>
                    <div className="two-col">
                      <input required min="0" type="number" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} placeholder="Selling price (NPR)" />
                      <input min="0" type="number" value={productForm.originalPrice} onChange={(event) => setProductForm({ ...productForm, originalPrice: event.target.value })} placeholder="Regular price (optional)" />
                    </div>
                    <div className="two-col">
                      <input min="0" type="number" value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} placeholder="Stock quantity" />
                      <input value={productForm.images[0]} onChange={(event) => setProductForm({ ...productForm, images: [event.target.value] })} placeholder="Image URL (optional)" />
                    </div>
                    <textarea value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} placeholder="Description" rows="3" />
                    <div className="check-row">
                      <label><input type="checkbox" checked={productForm.newArrival} onChange={(event) => setProductForm({ ...productForm, newArrival: event.target.checked })} /> New arrival</label>
                      <label><input type="checkbox" checked={productForm.featured} onChange={(event) => setProductForm({ ...productForm, featured: event.target.checked })} /> Featured</label>
                      <label><input type="checkbox" checked={productForm.bestSeller} onChange={(event) => setProductForm({ ...productForm, bestSeller: event.target.checked })} /> Best seller</label>
                    </div>
                    <button type="submit" className="primary-button">{productForm.id ? 'Update Product' : 'Add Product'}</button>
                  </form>

                  <div className="admin-list">
                    {products.map((product) => (
                      <div key={product.id} className="admin-product-row">
                        <div>
                          <strong>{product.name}</strong>
                          <small>{product.brand} • {product.category}</small>
                        </div>
                        <div className="admin-actions">
                          <button type="button" onClick={() => handleEditProduct(product)}>Edit</button>
                          <button type="button" className="danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {adminTab === 'categories' && (
                <>
                  <h2>Categories</h2>
                  <div className="admin-list">
                    {categories.map((category, index) => (
                      <div key={category.id} className="admin-product-row">
                        <div>
                          <strong>{category.icon} {category.name}</strong>
                        </div>
                        <div className="admin-actions">
                          <button type="button" onClick={() => setCategories((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: prompt('Enter new category name', item.name) || item.name } : item))}>Edit</button>
                          <button type="button" className="danger" onClick={() => setCategories((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="primary-button" onClick={() => setCategories((current) => [...current, { id: `cat-${Date.now()}`, name: 'New Category', icon: '📦' }])}>Add Category</button>
                </>
              )}

              {adminTab === 'orders' && (
                <>
                  <h2>Orders</h2>
                  <div className="admin-list">
                    {orders.length ? orders.map((order) => (
                      <div key={order.id} className="admin-product-row order-box">
                        <div>
                          <strong>{order.id}</strong>
                          <small>{order.customer.fullName} • {order.items.length} items</small>
                          <small>{order.paymentMethod}</small>
                        </div>
                        <div className="admin-actions">
                          <span className="status-pill">{order.status}</span>
                          <strong>{formatNPR(order.total)}</strong>
                        </div>
                      </div>
                    )) : <p>No orders yet.</p>}
                  </div>
                </>
              )}

              {adminTab === 'reviews' && (
                <>
                  <h2>Review Moderation</h2>
                  <div className="admin-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="admin-product-row review-item">
                        <div>
                          <strong>{review.name}</strong>
                          <small>{'★'.repeat(review.rating)}{review.pending ? ' Pending' : ''}</small>
                          <p>{review.review}</p>
                        </div>
                        <div className="admin-actions">
                          {!review.approved && <button type="button" onClick={() => setReviews((current) => current.map((item) => item.id === review.id ? { ...item, approved: true, pending: false } : item))}>Approve</button>}
                          <button type="button" className="danger" onClick={() => setReviews((current) => current.filter((item) => item.id !== review.id))}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {adminTab === 'content' && (
                <>
                  <h2>Website Content</h2>
                  <form className="admin-form" onSubmit={(event) => { event.preventDefault(); setFormMessage('Store content updated successfully.'); }}>
                    <div className="two-col">
                      <input value={siteContent.phone} onChange={(event) => setSiteContent({ ...siteContent, phone: event.target.value })} placeholder="Phone" />
                      <input value={siteContent.whatsapp} onChange={(event) => setSiteContent({ ...siteContent, whatsapp: event.target.value })} placeholder="WhatsApp" />
                    </div>
                    <div className="two-col">
                      <input value={siteContent.email} onChange={(event) => setSiteContent({ ...siteContent, email: event.target.value })} placeholder="Email" />
                      <input value={siteContent.hours} onChange={(event) => setSiteContent({ ...siteContent, hours: event.target.value })} placeholder="Opening hours" />
                    </div>
                    <textarea value={siteContent.about} onChange={(event) => setSiteContent({ ...siteContent, about: event.target.value })} rows="3" placeholder="About us text" />
                    <button type="submit" className="primary-button">Update Content</button>
                  </form>
                </>
              )}
            </section>
          </div>
        </main>
      ) : (
        <main>
          <section id="home" className="hero-section">
            <div className="container hero-inner">
              <div className="hero-copy">
                <span className="eyebrow">Trusted electrical shop in Chitwan</span>
                <h1>Better Brands for Every Home.</h1>
                <p>Shop fans, coolers, AC, mixer grinders, motors, chandeliers, lights, and more at Simon Electric, Tandi.</p>
                <div className="hero-actions">
                  <a href="#shop" className="primary-button">Shop Now</a>
                  <a href="#categories" className="secondary-button">Explore Categories</a>
                </div>
                <div className="hero-badges">
                  <span>Quality Products</span>
                  <span>Competitive Prices</span>
                  <span>Trusted Local Service</span>
                </div>
              </div>

              <div className="hero-visual">
                <div className="hero-card main-card">
                  <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80" alt="Air cooler and cooling appliances" />
                </div>
                <div className="hero-card small-card one">
                  <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80" alt="Washing machine" />
                </div>
                <div className="hero-card small-card two">
                  <img src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80" alt="Smart TV" />
                </div>
              </div>
            </div>
          </section>

          <section id="categories" className="container section-block">
            <div className="section-header">
              <div>
                <span className="eyebrow">Shop by category</span>
                <h2>Browse Our Popular Categories</h2>
              </div>
            </div>
            <div className="category-grid">
              {categories.map((category) => (
                <button type="button" key={category.id} className="category-card" onClick={() => { setSelectedCategory(category.name); setCurrentView('store'); }}>
                  <span className="category-icon">{category.icon}</span>
                  <strong>{category.name}</strong>
                  <small>Explore products</small>
                </button>
              ))}
            </div>
          </section>

          <section id="shop" className="container section-block shop-section">
            <div className="section-header shop-header">
              <div>
                <span className="eyebrow">Trending now</span>
                <h2>Trending Products</h2>
              </div>
              <div className="shop-tools">
                <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                  <option value="All">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
                <select value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value)}>
                  <option value="All">All brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="low-high">Price Low to High</option>
                  <option value="high-low">Price High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="shop-layout">
              <aside className="filter-panel">
                <h3>Filter Products</h3>
                <label>
                  Price Range
                  <input type="range" min="500" max="120000" step="500" value={priceRange} onChange={(event) => setPriceRange(Number(event.target.value))} />
                  <span>{formatNPR(priceRange)}</span>
                </label>
                <label><input type="checkbox" checked={stockOnly} onChange={() => setStockOnly((value) => !value)} /> In stock only</label>
                <label><input type="checkbox" checked={discountOnly} onChange={() => setDiscountOnly((value) => !value)} /> On discount</label>
                <label>
                  Min rating
                  <select value={minRating} onChange={(event) => setMinRating(Number(event.target.value))}>
                    <option value={0}>All ratings</option>
                    <option value={4}>4.0+</option>
                    <option value={4.3}>4.3+</option>
                    <option value={4.5}>4.5+</option>
                  </select>
                </label>
              </aside>

              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <article key={product.id} className="product-card">
                    <div className="product-image-wrap">
                      <img src={product.images[0]} alt={product.name} />
                      {product.newArrival && <span className="badge">New Arrival</span>}
                      {product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}
                      <button type="button" className="wishlist-btn" aria-label="Add to wishlist">♡</button>
                    </div>
                    <div className="product-info">
                      <div className="product-meta">
                        <span>{product.brand}</span>
                        <span className="rating">★ {product.rating}</span>
                      </div>
                      <h3>{product.name}</h3>
                      <div className="price-row">
                        <strong>{formatNPR(product.price)}</strong>
                        {product.originalPrice > product.price && <span>{formatNPR(product.originalPrice)}</span>}
                      </div>
                      <div className="stock-row">
                        <span className={product.inStock ? 'online' : 'offline'}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      </div>
                      <div className="card-actions">
                        <button type="button" className="primary-button small" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                        <button type="button" className="secondary-button small" onClick={() => setQuickProduct(product)}>Quick View</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="deals" className="container section-block promo-block">
            <div className="section-header">
              <div>
                <span className="eyebrow">Special deals</span>
                <h2>Special Deals & Offers</h2>
              </div>
            </div>
            <div className="promo-grid">
              <div className="promo-card feature">
                <div>
                  <span className="promo-tag">Limited Time</span>
                  <h3>Cool rooms. Smarter kitchens. Brighter spaces.</h3>
                  <p>Get dependable appliances, motors, and lighting from brands you can trust.</p>
                  <div className="promo-actions">
                    <button type="button" className="primary-button">Shop Deals</button>
                    <button type="button" className="secondary-button">View All Offers</button>
                  </div>
                </div>
              </div>
              <div className="promo-card mini">
                <p>Bundle Offer</p>
                <h3>Fan + Cooler Combo</h3>
                <strong>Save on summer essentials</strong>
              </div>
              <div className="promo-card mini">
                <p>Seasonal Promotion</p>
                <h3>Lights & Chandeliers</h3>
                <strong>Style every room</strong>
              </div>
            </div>
          </section>

          <section id="new-arrivals" className="container section-block">
            <div className="section-header">
              <div>
                <span className="eyebrow">Just arrived</span>
                <h2>New Arrivals</h2>
              </div>
            </div>
            <div className="horizontal-cards">
              {newArrivalProducts.map((product) => (
                <div key={product.id} className="mini-product-card">
                  <img src={product.images[0]} alt={product.name} />
                  <div>
                    <span className="badge">New</span>
                    <h3>{product.name}</h3>
                    <strong>{formatNPR(product.price)}</strong>
                  </div>
                  <button type="button" className="primary-button small" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                </div>
              ))}
            </div>
          </section>

          <section className="container section-block">
            <div className="section-header">
              <div>
                <span className="eyebrow">Best sellers</span>
                <h2>Best Sellers</h2>
              </div>
              <div className="filter-chips">
                <button type="button" className="chip active">All</button>
                <button type="button" className="chip">Kitchen</button>
                <button type="button" className="chip">Home</button>
                <button type="button" className="chip">Cooling</button>
                <button type="button" className="chip">Electrical</button>
                <button type="button" className="chip">Accessories</button>
              </div>
            </div>
            <div className="product-grid compact-grid">
              {bestSellerProducts.map((product) => (
                <article key={product.id} className="product-card">
                  <div className="product-image-wrap">
                    <img src={product.images[0]} alt={product.name} />
                    <button type="button" className="wishlist-btn" aria-label="Add to wishlist">♡</button>
                  </div>
                  <div className="product-info">
                    <div className="product-meta">
                      <span>{product.brand}</span>
                      <span className="rating">★ {product.rating}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <div className="price-row">
                      <strong>{formatNPR(product.price)}</strong>
                      {product.originalPrice > product.price && <span>{formatNPR(product.originalPrice)}</span>}
                    </div>
                    <button type="button" className="primary-button small" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="promo-strip container">
            <div>
              <span>Premium quality</span>
              <h3>From motors to chandeliers, find it at Simon Electric.</h3>
            </div>
            <button type="button" className="primary-button">Browse Collections</button>
          </section>

          <section id="brands" className="container section-block brands-section">
            <div className="section-header">
              <div>
                <span className="eyebrow">Brands we deal in</span>
                <h2>Trusted by Homeowners Across Chitwan</h2>
              </div>
            </div>
            <div className="brand-row">
              {brands.map((brand) => (
                <div key={brand} className="brand-pill">{brand}</div>
              ))}
            </div>
          </section>

          <section className="container section-block why-section">
            <div className="section-header">
              <div>
                <span className="eyebrow">Why choose us</span>
                <h2>Why Choose Simon Electric?</h2>
              </div>
            </div>
            <div className="why-grid">
              {whyChooseUs.map((item, index) => (
                <div key={item} className="why-card">
                  <div className="why-icon">✓</div>
                  <h3>{item}</h3>
                  <p>Trusted support and products curated for everyday living in the local market.</p>
                  {index < 2 && <span>Local expertise</span>}
                </div>
              ))}
            </div>
          </section>

          <section id="about" className="container section-block about-section">
            <div className="about-media">
              <img src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80" alt="Inside Simon Electric store" />
            </div>
            <div className="about-copy">
              <span className="eyebrow">About Simon Electric</span>
              <h2>Servicing homes and businesses in Tandi, Chitwan.</h2>
              <p>{siteContent.about}</p>
              <ul>
                <li><strong>Location:</strong> {siteContent.location}</li>
                <li><strong>Experience:</strong> Trusted local service and appliance guidance.</li>
                <li><strong>Customer service:</strong> Friendly support, product consultation, and after-sales guidance.</li>
                <li><strong>Opening hours:</strong> {siteContent.hours}</li>
              </ul>
            </div>
          </section>

          <section className="container section-block reviews-section">
            <div className="section-header">
              <div>
                <span className="eyebrow">Testimonials</span>
                <h2>What Our Customers Say</h2>
              </div>
            </div>
            <div className="review-grid">
              {approvedReviews.map((review) => (
                <article key={review.id} className="review-card">
                  <div className="review-top">
                    <div className="review-avatar">{review.name.charAt(0)}</div>
                    <div>
                      <h3>{review.name}</h3>
                      <span>{'★'.repeat(review.rating)}</span>
                    </div>
                  </div>
                  <p>“{review.review}”</p>
                </article>
              ))}
            </div>

            <form className="review-form" onSubmit={submitReview}>
              <h3>Leave a Review</h3>
              <div className="two-col">
                <input name="name" placeholder="Your name" required />
                <select name="rating" defaultValue="5">
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                </select>
              </div>
              <textarea name="review" placeholder="Tell us about your experience" rows="4" required />
              <button type="submit" className="primary-button">Submit Review</button>
            </form>
          </section>

          <section className="container section-block map-section">
            <div className="map-placeholder">
              <div className="map-box">
                <span>Map Placeholder</span>
                <strong>Tandi, Chitwan, Nepal</strong>
              </div>
            </div>
            <div className="store-details-card">
              <span className="eyebrow">Visit our store</span>
              <h2>Simon Electric</h2>
              <p>Tandi, Chitwan, Nepal</p>
              <ul>
                <li>📞 {siteContent.phone}</li>
                <li>🕒 {siteContent.hours}</li>
                <li>📍 {siteContent.location}</li>
              </ul>
              <a href="https://maps.google.com/?q=Tandi%20Chitwan%20Nepal" target="_blank" rel="noreferrer" className="primary-button">Get Directions</a>
            </div>
          </section>

          <section id="contact" className="container section-block contact-section">
            <div className="contact-card">
              <span className="eyebrow">Contact</span>
              <h2>Let’s help you find the right appliance.</h2>
              <div className="contact-list">
                <p>Simon Electric</p>
                <p>{siteContent.location}</p>
                <p>Phone: {siteContent.phone}</p>
                <p>WhatsApp: {siteContent.whatsapp}</p>
                <p>Email: {siteContent.email}</p>
                <p>Opening Hours: {siteContent.hours}</p>
              </div>
              <div className="contact-actions">
                <a href={`https://wa.me/${siteContent.whatsapp.replace(/\D/g, '')}`} className="primary-button">Order / Enquire on WhatsApp</a>
                <a href={`tel:${siteContent.phone}`} className="secondary-button">Call Simon Electric</a>
              </div>
            </div>

            <form className="contact-form">
              <input type="text" placeholder="Name" />
              <input type="tel" placeholder="Phone" />
              <input type="email" placeholder="Email" />
              <textarea placeholder="Message" rows="5" />
              <button type="submit" className="primary-button">Send Message</button>
            </form>
          </section>
        </main>
      )}

      <aside className={`cart-drawer ${cartOpen ? 'show' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button type="button" className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        {cart.length ? (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.images[0]} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>{formatNPR(item.price)}</p>
                    <div className="qty-controls">
                      <button type="button" onClick={() => updateCartQty(item.id, -1)}>-</button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateCartQty(item.id, 1)}>+</button>
                    </div>
                  </div>
                  <button type="button" className="remove-link" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div><span>Subtotal</span><strong>{formatNPR(subtotal)}</strong></div>
              <div><span>Discount</span><strong>-{formatNPR(discountValue)}</strong></div>
              <div><span>Delivery</span><strong>{formatNPR(deliveryFee)}</strong></div>
              <div className="total-row"><span>Total</span><strong>{formatNPR(total)}</strong></div>
            </div>

            <div className="cart-actions">
              <button type="button" className="secondary-button" onClick={() => setCartOpen(false)}>Continue Shopping</button>
              <button type="button" className="primary-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}>Proceed to Checkout</button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <button type="button" className="primary-button" onClick={() => setCartOpen(false)}>Continue Shopping</button>
          </div>
        )}
      </aside>

      {checkoutOpen && (
        <div className="modal-backdrop" onClick={() => setCheckoutOpen(false)}>
          <div className="checkout-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-btn" onClick={() => setCheckoutOpen(false)}>✕</button>
            <span className="eyebrow">Complete your order</span>
            <h2>Delivery details</h2>
            <p className="modal-intro">We will call to confirm your order before delivery.</p>
            <form className="checkout-form" onSubmit={handleOrderSubmit}>
              <div className="two-col">
                <input required value={checkoutForm.fullName} onChange={(event) => setCheckoutForm({ ...checkoutForm, fullName: event.target.value })} placeholder="Full name" />
                <input required value={checkoutForm.phone} onChange={(event) => setCheckoutForm({ ...checkoutForm, phone: event.target.value })} placeholder="Phone number" />
              </div>
              <input required value={checkoutForm.address} onChange={(event) => setCheckoutForm({ ...checkoutForm, address: event.target.value })} placeholder="Delivery address" />
              <div className="two-col">
                <input value={checkoutForm.area} onChange={(event) => setCheckoutForm({ ...checkoutForm, area: event.target.value })} placeholder="Area / landmark" />
                <select value={checkoutForm.paymentMethod} onChange={(event) => setCheckoutForm({ ...checkoutForm, paymentMethod: event.target.value })}>
                  <option>Cash on Delivery</option>
                  <option>Bank Transfer</option>
                  <option>Pay at Store</option>
                </select>
              </div>
              <textarea value={checkoutForm.orderNotes} onChange={(event) => setCheckoutForm({ ...checkoutForm, orderNotes: event.target.value })} placeholder="Order notes (optional)" rows="3" />
              <div className="checkout-total"><span>Order total</span><strong>{formatNPR(total)}</strong></div>
              <button type="submit" className="primary-button">Place Order</button>
            </form>
          </div>
        </div>
      )}

      {quickProduct && (
        <div className="modal-backdrop" onClick={() => setQuickProduct(null)}>
          <div className="product-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-btn" onClick={() => setQuickProduct(null)}>✕</button>
            <div className="modal-grid">
              <img src={quickProduct.images[0]} alt={quickProduct.name} />
              <div>
                <span className="eyebrow">{quickProduct.brand}</span>
                <h3>{quickProduct.name}</h3>
                <div className="price-row">
                  <strong>{formatNPR(quickProduct.price)}</strong>
                  {quickProduct.originalPrice > quickProduct.price && <span>{formatNPR(quickProduct.originalPrice)}</span>}
                </div>
                <p>{quickProduct.description}</p>
                <div className="modal-actions">
                  <button type="button" className="primary-button" onClick={() => handleAddToCart(quickProduct)}>Add to Cart</button>
                  <a href={`https://wa.me/${siteContent.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello Simon Electric, I am interested in ${quickProduct.name}. Please provide price and availability.`)}`} className="secondary-button">WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="logo-block footer-logo">
              <div className="logo-mark">S</div>
              <div>
                <strong>Simon Electric</strong>
                <small>Powering Your Home</small>
              </div>
            </div>
            <p>Trusted electrical and home-appliance shop in Tandi, Chitwan, Nepal, supplying reliable products and everyday support.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#shop">Shop</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#deals">Deals</a></li>
            </ul>
          </div>
          <div>
            <h4>Categories</h4>
            <ul>
              <li>Home Appliances</li>
              <li>Kitchen Appliances</li>
              <li>Fans & Cooling</li>
              <li>Electrical Accessories</li>
              <li>Lighting</li>
            </ul>
          </div>
          <div>
            <h4>Customer Support</h4>
            <ul>
              <li>Contact Us</li>
              <li>Delivery Information</li>
              <li>Warranty</li>
              <li>Returns</li>
              <li>FAQs</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom container">
          <span>© 2026 Simon Electric. All Rights Reserved.</span>
          <div className="social-links">
            <a href={siteContent.socialLinks.facebook}>Facebook</a>
            <a href={siteContent.socialLinks.instagram}>Instagram</a>
            <a href={siteContent.socialLinks.tiktok}>TikTok</a>
            <a href={siteContent.socialLinks.whatsapp}>WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
