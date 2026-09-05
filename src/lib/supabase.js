import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fdcqcxmwzpkffpqobyep.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OKE0fOg2z2d24DskVnTcVA_Z2ilC3mm'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const rowToProduct = (r) => ({
  id: r.id,
  name: r.name,
  brand: r.brand,
  category: r.category,
  categoryGroup: r.category_group,
  model: r.model,
  price: Number(r.price),
  originalPrice: Number(r.original_price),
  stock: r.stock,
  rating: Number(r.rating),
  reviewCount: r.review_count,
  inStock: r.in_stock,
  newArrival: r.new_arrival,
  featured: r.featured,
  bestSeller: r.best_seller,
  images: r.images || [],
  description: r.description,
  features: r.features || [],
  specs: r.specs || {},
  warranty: r.warranty,
  delivery: r.delivery,
})

export const productToRow = (p) => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  category: p.category,
  category_group: p.categoryGroup,
  model: p.model,
  price: p.price,
  original_price: p.originalPrice,
  stock: p.stock,
  rating: p.rating,
  review_count: p.reviewCount,
  in_stock: p.inStock,
  new_arrival: p.newArrival,
  featured: p.featured,
  best_seller: p.bestSeller,
  images: p.images || [],
  features: p.features || [],
  specs: p.specs || {},
  warranty: p.warranty,
  delivery: p.delivery,
})

export const rowToSiteContent = (r) => ({
  phone: r.phone,
  whatsapp: r.whatsapp,
  email: r.email,
  location: r.location,
  hours: r.hours,
  about: r.about,
})

export const siteContentToRow = (s) => ({
  id: 'main',
  phone: s.phone,
  whatsapp: s.whatsapp,
  email: s.email,
  location: s.location,
  hours: s.hours,
  about: s.about,
})