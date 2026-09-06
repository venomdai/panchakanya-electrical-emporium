import {
 useEffect, useMemo, useRef, useState }
 from 'react'
import './App.css'
import { supabase, rowToProduct, productToRow, rowToSiteContent, siteContentToRow } from './lib/supabase.js'
// ============================================================================
// CONFIGURATION & UTILITIES
// ============================================================================
const WHATSAPP_NUMBER = '9855033485'
const formatNPR = (value) => `NPR ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`
const generateWhatsAppMessage = (productName, productPrice, productModel = '') => {
  
const modelText = productModel ? `, Model ${productModel}`
 : ''  
const message = `Hello, I am interested in the ${productName}${modelText}. The listed price is NPR ${productPrice.toLocaleString('en-US')}. Could you please provide more details and confirm the price?`
  
return encodeURIComponent(message)}
const openWhatsAppLink = (productName, productPrice, productModel = '') => {
  
const message = generateWhatsAppMessage(productName, productPrice, productModel)
  
const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
  window.open(waLink, '_blank')}
// ============================================================================
// PRODUCT CATEGORIES - ORGANIZED BY TYPE
// ============================================================================
const PRODUCT_CATEGORIES = {
  'Kitchen Appliances': {
    id: 'kitchen',    name: 'Kitchen Appliances',    icon: '🍳',    items: [      {
 id: 'kitchen-chimney', name: 'Kitchen Chimney' }
,      {
 id: 'micro-oven', name: 'Micro Oven' }
,      {
 id: 'rice-cooker', name: 'Rice Cooker' }
,      {
 id: 'induction-cooktop', name: 'Induction Cooktops' }
,      {
 id: 'refrigerator', name: 'Refrigerator' }
,      {
 id: 'grinder-mixtures', name: 'Grinder and Mixtures' }
,      {
 id: 'toaster', name: 'Toaster' }
,    ],  }
,  'Home Appliances': {
    id: 'home',    name: 'Home Appliances',    icon: '🏠',    items: [      {
 id: 'washing-machine', name: 'Washing Machine' }
,      {
 id: 'refrigerator', name: 'Refrigerator / Fridge' }
,      {
 id: 'tv', name: 'Television' }
,      {
 id: 'vacuum-cleaner', name: 'Vacuum Cleaner' }
,      {
 id: 'iron', name: 'Iron' }
,    ],  }
,  'Air Conditioner': {
    id: 'cooling',    name: 'Air Conditioner',    icon: '❄️',    items: [      {
 id: 'ac-1-ton', name: '1 Ton AC' }
,      {
 id: 'ac-15-ton', name: '1.5 Ton AC' }
,      {
 id: 'ac-2-ton', name: '2 Ton AC' }
,    ],  }
,  'Cooler': {
    id: 'cooler',    name: 'Cooler',    icon: '💨',    items: [      {
 id: 'air-cooler', name: 'Air Cooler' }
,    ],  }
,  'Fans': {
    id: 'fans',    name: 'Fans',    icon: '🌀',    items: [      {
 id: 'ceiling-fan', name: 'Ceiling Fan' }
,      {
 id: 'stand-fan', name: 'Stand Fan' }
,      {
 id: 'table-fan', name: 'Table Fan' }
,      {
 id: 'wall-fan', name: 'Wall Fan' }
,    ],  }
,  'Electrical & Power': {
    id: 'electrical',    name: 'Electrical & Power',    icon: '⚡',    items: [      {
 id: 'inverter', name: 'Inverter' }
,      {
 id: 'battery', name: 'Battery' }
,      {
 id: 'motor', name: 'Motor & Pumps' }
,    ],  }
,  'Lighting & Decor': {
    id: 'lighting',    name: 'Lighting & Decor',    icon: '💡',    items: [      {
 id: 'chandelier', name: 'Chandelier' }
,      {
 id: 'led-bulb', name: 'LED Bulb' }
,      {
 id: 'led-tube', name: 'LED Tube Light' }
,      {
 id: 'socket', name: 'Switch & Socket' }
,    ],  }
,}
const asset = (path) => (path && path.startsWith('/') && !path.startsWith('//') ? import.meta.env.BASE_URL.replace(/\/$/, '') + path : path)
const getProductImage = (product) => asset((product.images && product.images[0]) || '/PPE.jpg')
// ============================================================================
// BRANDS
// ============================================================================
const DEFAULT_BRANDS = [  {
 name: 'Better', logo: '/Better.png' }
,  {
 name: 'Crompton', logo: '/Crompton.png' }
,  {
 name: 'CG', logo: '/CG.jpg' }
,  {
 name: 'LG', logo: '/LG-Logo.jpg' }
,  {
 name: 'Samsung', logo: '/Samsung.jpg' }
,]
// ============================================================================
// DEFAULT PRODUCTS (SAMPLE DATA - Ready for replacement)
// ============================================================================
const defaultProducts = [  {
    id: 'prod-1',    name: 'Samsung 43" Smart TV',    brand: 'Samsung',    category: 'Television',    categoryGroup: 'Home Appliances',    model: 'UA43T',    price: 63999,    originalPrice: 69999,    stock: 14,    rating: 4.8,    reviewCount: 124,    inStock: true,    newArrival: true,    featured: true,    bestSeller: true,    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80'],    description: 'A sleek 43-inch smart TV designed for immersive entertainment.',    features: ['4K UHD display', 'Smart TV platform', 'Voice assistant ready', 'Ultra slim frame'],    specs: {
 Screen: '43 inch', Resolution: '3840x2160', Warranty: '1 Year' }
,    warranty: '1 Year Manufacturer Warranty',    delivery: 'Free delivery within Tandi and nearby areas.',  }
,  {
    id: 'prod-2',    name: 'LG 7KG Washing Machine',    brand: 'LG',    category: 'Washing Machine',    categoryGroup: 'Home Appliances',    model: 'F2B7',    price: 55999,    originalPrice: 63999,    stock: 8,    rating: 4.7,    reviewCount: 96,    inStock: true,    newArrival: false,    featured: true,    bestSeller: true,    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80'],    description: 'High-efficiency 7KG washing machine for modern households.',    features: ['7 kg capacity', 'Energy efficient', 'Multiple wash programs', 'Turbo drum'],    specs: {
 Capacity: '7 KG', Energy: '5 Star', Control: 'Fully Automatic', Warranty: '2 Years' }
,    warranty: '2 Year Warranty on Motor',    delivery: 'Home delivery and installation support available.',  }
,  {
    id: 'prod-4',    name: 'Better Electric Rice Cooker',    brand: 'Better',    category: 'Electric Rice Cooker',    categoryGroup: 'Kitchen Appliances',    model: 'RC-5.5',    price: 4999,    originalPrice: 6299,    stock: 19,    rating: 4.6,    reviewCount: 68,    inStock: true,    newArrival: false,    featured: false,    bestSeller: true,    images: ['https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80'],    description: 'Easy-to-use rice cooker with multiple cooking modes.',    features: ['Multi-cook function', 'Keep warm mode', 'Non-stick inner pot', 'Safe locking lid'],    specs: {
 Capacity: '5.5 Cups', Power: '700W', Features: 'Keep Warm', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery and demo guidance available at the store.',  }
,  {
    id: 'prod-5',    name: 'CG Air Cooler',    brand: 'CG',    category: 'Air Cooler',    categoryGroup: 'Cooler',    model: 'Dream Air',    price: 18999,    originalPrice: 21999,    stock: 12,    rating: 4.4,    reviewCount: 55,    inStock: true,    newArrival: true,    featured: true,    bestSeller: false,    images: ['/Cooler.png'],    description: 'Efficient air cooler for warm Nepali summers.',    features: ['Powerful airflow', 'Low power consumption', 'Remote control', 'Large water tank'],    specs: {
 Capacity: '55L', Type: 'Desert Cooler', Motor: 'High Speed', Warranty: '1 Year' }
,    warranty: '1 Year Warranty Support',    delivery: 'Available across Chitwan with installation support.',  }
,  {
    id: 'prod-6',    name: 'Crompton Premium Ceiling Fan',    brand: 'Crompton',    category: 'Ceiling Fan',    categoryGroup: 'Fans',    model: 'CF-120',    price: 3999,    originalPrice: 4999,    stock: 49,    rating: 4.3,    reviewCount: 73,    inStock: true,    newArrival: false,    featured: false,    bestSeller: true,    images: ['/Fan.jpg'],    description: 'Durable ceiling fan with balanced airflow and quiet operation.',    features: ['High-speed motor', 'Low-noise operation', 'Energy efficient', 'Modern blade design'],    specs: {
 Size: '120 CM', Speed: '3 Speed', Power: '60W', Warranty: '1 Year' }
,    warranty: '1 Year Motor Warranty',    delivery: 'Quick delivery across Chitwan.',  }
,  {
    id: 'prod-9',    name: 'Better Induction Cooker',    brand: 'Better',    category: 'Induction Stove',    categoryGroup: 'Kitchen Appliances',    model: 'IC-1800',    price: 6599,    originalPrice: 7999,    stock: 17,    rating: 4.5,    reviewCount: 47,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],    description: 'Compact induction cooker for fast, energy-saving cooking.',    features: ['1800W power', 'Touch panel', 'Energy efficient', 'Safety shutoff'],    specs: {
 Power: '1800W', Voltage: '220V', Controls: 'Touch', Warranty: '1 Year' }
,    warranty: '1 Year Service Warranty',    delivery: 'Delivered to your door in Chitwan.',  }
,  {
    id: 'prod-14',    name: 'Crompton 1HP Water Pump Motor',    brand: 'Crompton',    category: 'Motor & Pumps',    categoryGroup: 'Electrical & Power',    model: 'MB-1HP',    price: 14999,    originalPrice: 16999,    stock: 9,    rating: 4.6,    reviewCount: 28,    inStock: true,    newArrival: true,    featured: true,    bestSeller: true,    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'],    description: 'Reliable water pump motor for homes and small commercial systems.',    features: ['1HP motor', 'Copper winding', 'Strong build', 'Low maintenance'],    specs: {
 Power: '1 HP', Voltage: '220V', Type: 'Water Pump Motor', Warranty: '1 Year' }
,    warranty: '1 Year Motor Warranty',    delivery: 'Delivery and fitting guidance available.',  }
,  {
    id: 'prod-15',    name: 'LED Chandelier',    brand: 'Better',    category: 'Chandelier',    categoryGroup: 'Lighting & Decor',    model: 'CH-LED-06',    price: 12499,    originalPrice: 14999,    stock: 7,    rating: 4.5,    reviewCount: 19,    inStock: true,    newArrival: true,    featured: true,    bestSeller: false,    images: ['/Lights.jpg'],    description: 'Statement LED chandelier that brings warm, modern character.',    features: ['Integrated LED', 'Warm white light', 'Modern design', 'Easy ceiling mount'],    specs: {
 Power: '48W', Color: 'Warm White', Type: 'Decorative Chandelier', Warranty: '1 Year' }
,    warranty: '1 Year Product Warranty',    delivery: 'Careful delivery with installation guidance.',  }
,  {
    id: 'prod-kitchen-chimney',    name: 'Kitchen Chimney',    brand: 'CG',    category: 'Kitchen Chimney',    categoryGroup: 'Kitchen Appliances',    model: 'KC-60',    price: 18999,    originalPrice: 22999,    stock: 10,    rating: 4.5,    reviewCount: 24,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80'],    description: 'Powerful kitchen chimney that keeps your kitchen smoke-free and clean.',    features: ['High suction power', 'Toughened glass', 'Easy to clean filters', 'Sleek design'],    specs: {
 Size: '60 CM', Suction: '1000 m3/h', Type: 'Wall Mounted', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery and installation support available.',  }
,  {
    id: 'prod-micro-oven',    name: 'Micro Oven',    brand: 'LG',    category: 'Micro Oven',    categoryGroup: 'Kitchen Appliances',    model: 'MO-20',    price: 14999,    originalPrice: 17999,    stock: 12,    rating: 4.6,    reviewCount: 31,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1200&q=80'],    description: 'Versatile microwave oven for quick and easy cooking.',    features: ['20L capacity', 'Multiple power levels', 'Defrost function', 'Digital display'],    specs: {
 Capacity: '20L', Power: '800W', Type: 'Microwave Oven', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Home delivery available across Chitwan.',  }
,  {
    id: 'prod-induction-cooktop',    name: 'Induction Cooktop',    brand: 'LG',    category: 'Induction Cooktops',    categoryGroup: 'Kitchen Appliances',    model: 'IC-2000',    price: 6999,    originalPrice: 8499,    stock: 15,    rating: 4.5,    reviewCount: 39,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],    description: 'Fast and energy-efficient induction cooktop for daily cooking.',    features: ['2000W power', 'Touch controls', 'Energy efficient', 'Safety lock'],    specs: {
 Power: '2000W', Type: 'Induction Cooktop', Controls: 'Touch', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivered to your door in Chitwan.',  }
,  {
    id: 'prod-refrigerator',    name: 'Refrigerator',    brand: 'Samsung',    category: 'Refrigerator',    categoryGroup: 'Kitchen Appliances',    model: 'RF-236',    price: 58999,    originalPrice: 64999,    stock: 7,    rating: 4.7,    reviewCount: 45,    inStock: true,    newArrival: true,    featured: true,    bestSeller: true,    images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80'],    description: 'Spacious and energy-efficient refrigerator for your family.',    features: ['236L capacity', 'Energy efficient', 'Digital inverter', 'Digital display'],    specs: {
 Capacity: '236L', Type: 'Single Door', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Delivery and installation support available.',  }
,  {
    id: 'prod-grinder-mixtures',    name: 'Grinder and Mixtures',    brand: 'Crompton',    category: 'Grinder and Mixtures',    categoryGroup: 'Kitchen Appliances',    model: 'GM-750',    price: 4999,    originalPrice: 5999,    stock: 18,    rating: 4.4,    reviewCount: 27,    inStock: true,    newArrival: false,    featured: false,    bestSeller: true,    images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80'],    description: 'Heavy-duty mixer grinder for grinding and blending needs.',    features: ['750W motor', 'Multiple jars', 'Stainless steel blades', 'Compact design'],    specs: {
 Power: '750W', Jars: '3 Jars', Type: 'Mixer Grinder', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Quick delivery across Chitwan.',  }
,  {
    id: 'prod-toaster',    name: 'Toaster',    brand: 'Better',    category: 'Toaster',    categoryGroup: 'Kitchen Appliances',    model: 'TS-2',    price: 1999,    originalPrice: 2499,    stock: 22,    rating: 4.3,    reviewCount: 15,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['https://images.unsplash.com/photo-1594046243098-0fceea7e9e85?auto=format&fit=crop&w=1200&q=80'],    description: 'Simple and efficient toaster for perfect slices every time.',    features: ['2 slice toaster', 'Adjustable browning', 'Crumb tray', 'Compact design'],    specs: {
 Slices: '2', Power: '900W', Controls: 'Mechanical', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Available at the store and Chitwan.',  }
,  {
    id: 'prod-vacuum-cleaner',    name: 'Vacuum Cleaner',    brand: 'Crompton',    category: 'Vacuum Cleaner',    categoryGroup: 'Home Appliances',    model: 'VC-1500',    price: 12999,    originalPrice: 15999,    stock: 8,    rating: 4.5,    reviewCount: 21,    inStock: true,    newArrival: true,    featured: true,    bestSeller: false,    images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=1200&q=80'],    description: 'Powerful vacuum cleaner for thorough home cleaning.',    features: ['1500W suction', 'HEPA filter', 'Bagless design', 'Easy maneuverability'],    specs: {
 Power: '1500W', Type: 'Bagless', Filter: 'HEPA', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'prod-iron',    name: 'Electric Iron',    brand: 'Better',    category: 'Iron',    categoryGroup: 'Home Appliances',    model: 'EI-1000',    price: 1499,    originalPrice: 1899,    stock: 30,    rating: 4.4,    reviewCount: 18,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1200&q=80'],    description: 'Reliable electric iron for wrinkle-free clothes.',    features: ['1000W heating', 'Non-stick soleplate', 'Steam function', 'Thermostat control'],    specs: {
 Power: '1000W', Type: 'Steam Iron', Soleplate: 'Non-stick', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Available at the store in Chitwan.',  }
,  {
    id: 'ac-better-1',    name: 'Better 1 Ton Inverter AC',    brand: 'Better',    category: '1 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'BT-AC-10',    price: 61999,    originalPrice: 69999,    stock: 10,    rating: 4.5,    reviewCount: 22,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/AC.png'],    description: 'Energy-efficient 1 ton inverter AC from Better.',    features: ['1 ton capacity', 'Inverter technology', 'Fast cooling', 'Sleep mode'],    specs: {
 Capacity: '1 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-better-15',    name: 'Better 1.5 Ton Inverter AC',    brand: 'Better',    category: '1.5 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'BT-AC-15',    price: 79999,    originalPrice: 89999,    stock: 8,    rating: 4.6,    reviewCount: 30,    inStock: true,    newArrival: true,    featured: true,    bestSeller: true,    images: ['/AC.png'],    description: 'Powerful 1.5 ton inverter AC for larger rooms.',    features: ['1.5 ton capacity', 'Inverter technology', 'Fast cooling', 'Self clean'],    specs: {
 Capacity: '1.5 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-better-2',    name: 'Better 2 Ton Inverter AC',    brand: 'Better',    category: '2 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'BT-AC-20',    price: 98999,    originalPrice: 109999,    stock: 5,    rating: 4.7,    reviewCount: 18,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/AC.png'],    description: 'High-capacity 2 ton inverter AC for big spaces.',    features: ['2 ton capacity', 'Inverter technology', 'Turbo cooling', 'Smart control'],    specs: {
 Capacity: '2 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-lg-1',    name: 'LG 1 Ton Dual Inverter AC',    brand: 'LG',    category: '1 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'LG-AC-10',    price: 67999,    originalPrice: 75999,    stock: 9,    rating: 4.7,    reviewCount: 34,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['/AC.png'],    description: 'LG 1 ton dual inverter AC with smart cooling.',    features: ['1 ton capacity', 'Dual inverter', 'Fast cooling', 'Low noise'],    specs: {
 Capacity: '1 Ton', Type: 'Dual Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-lg-15',    name: 'LG 1.5 Ton Dual Inverter AC',    brand: 'LG',    category: '1.5 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'LG-AC-15',    price: 85999,    originalPrice: 94999,    stock: 7,    rating: 4.8,    reviewCount: 41,    inStock: true,    newArrival: true,    featured: true,    bestSeller: true,    images: ['/AC.png'],    description: 'LG 1.5 ton dual inverter AC for effortless cooling.',    features: ['1.5 ton capacity', 'Dual inverter', 'AI cooling', 'Self cleaning'],    specs: {
 Capacity: '1.5 Ton', Type: 'Dual Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-lg-2',    name: 'LG 2 Ton Dual Inverter AC',    brand: 'LG',    category: '2 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'LG-AC-20',    price: 104999,    originalPrice: 114999,    stock: 4,    rating: 4.7,    reviewCount: 15,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/AC.png'],    description: 'LG 2 ton dual inverter AC for large living spaces.',    features: ['2 ton capacity', 'Dual inverter', 'Turbo cooling', 'Smart display'],    specs: {
 Capacity: '2 Ton', Type: 'Dual Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-midea-1',    name: 'Midea 1 Ton Inverter AC',    brand: 'Midea',    category: '1 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'MD-AC-10',    price: 57999,    originalPrice: 65999,    stock: 11,    rating: 4.4,    reviewCount: 19,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/AC.png'],    description: 'Affordable 1 ton inverter AC from Midea.',    features: ['1 ton capacity', 'Inverter technology', 'Fast cooling', 'Energy saving'],    specs: {
 Capacity: '1 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-midea-15',    name: 'Midea 1.5 Ton Inverter AC',    brand: 'Midea',    category: '1.5 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'MD-AC-15',    price: 74999,    originalPrice: 83999,    stock: 9,    rating: 4.5,    reviewCount: 26,    inStock: true,    newArrival: true,    featured: true,    bestSeller: true,    images: ['/AC.png'],    description: 'Midea 1.5 ton inverter AC with smart features.',    features: ['1.5 ton capacity', 'Inverter technology', 'Fast cooling', 'Quiet operation'],    specs: {
 Capacity: '1.5 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-midea-2',    name: 'Midea 2 Ton Inverter AC',    brand: 'Midea',    category: '2 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'MD-AC-20',    price: 92999,    originalPrice: 102999,    stock: 6,    rating: 4.6,    reviewCount: 14,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/AC.png'],    description: 'Midea 2 ton inverter AC for spacious rooms.',    features: ['2 ton capacity', 'Inverter technology', 'Turbo cooling', 'Clean filter'],    specs: {
 Capacity: '2 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-samsung-1',    name: 'Samsung 1 Ton WindFree AC',    brand: 'Samsung',    category: '1 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'SS-AC-10',    price: 71999,    originalPrice: 79999,    stock: 8,    rating: 4.6,    reviewCount: 27,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/AC.png'],    description: 'Samsung 1 ton WindFree AC with ambient cooling.',    features: ['1 ton capacity', 'WindFree cooling', 'Inverter technology', 'Digital display'],    specs: {
 Capacity: '1 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-samsung-15',    name: 'Samsung 1.5 Ton WindFree AC',    brand: 'Samsung',    category: '1.5 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'SS-AC-15',    price: 89999,    originalPrice: 98999,    stock: 6,    rating: 4.7,    reviewCount: 36,    inStock: true,    newArrival: true,    featured: true,    bestSeller: true,    images: ['/AC.png'],    description: 'Samsung 1.5 ton WindFree AC for silent comfort.',    features: ['1.5 ton capacity', 'WindFree cooling', 'Inverter technology', 'Smart mode'],    specs: {
 Capacity: '1.5 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-samsung-2',    name: 'Samsung 2 Ton WindFree AC',    brand: 'Samsung',    category: '2 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'SS-AC-20',    price: 109999,    originalPrice: 119999,    stock: 4,    rating: 4.7,    reviewCount: 12,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/AC.png'],    description: 'Samsung 2 ton WindFree AC for large spaces.',    features: ['2 ton capacity', 'WindFree cooling', 'Inverter technology', 'Fast cooling'],    specs: {
 Capacity: '2 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-cg-1',    name: 'CG 1 Ton Inverter AC',    brand: 'CG',    category: '1 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'CG-AC-10',    price: 58999,    originalPrice: 66999,    stock: 12,    rating: 4.4,    reviewCount: 20,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/AC.png'],    description: 'CG 1 ton inverter AC for efficient cooling.',    features: ['1 ton capacity', 'Inverter technology', 'Fast cooling', 'Sleep mode'],    specs: {
 Capacity: '1 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-cg-15',    name: 'CG 1.5 Ton Inverter AC',    brand: 'CG',    category: '1.5 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'CG-AC-15',    price: 75999,    originalPrice: 84999,    stock: 9,    rating: 4.5,    reviewCount: 28,    inStock: true,    newArrival: true,    featured: true,    bestSeller: true,    images: ['/AC.png'],    description: 'CG 1.5 ton inverter AC with powerful cooling.',    features: ['1.5 ton capacity', 'Inverter technology', 'Fast cooling', 'Turbo mode'],    specs: {
 Capacity: '1.5 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'ac-cg-2',    name: 'CG 2 Ton Inverter AC',    brand: 'CG',    category: '2 Ton AC',    categoryGroup: 'Air Conditioner',    model: 'CG-AC-20',    price: 94999,    originalPrice: 104999,    stock: 5,    rating: 4.6,    reviewCount: 16,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/AC.png'],    description: 'CG 2 ton inverter AC for large rooms.',    features: ['2 ton capacity', 'Inverter technology', 'Turbo cooling', 'Smart control'],    specs: {
 Capacity: '2 Ton', Type: 'Inverter Split AC', Energy: '5 Star', Warranty: '2 Years' }
,    warranty: '2 Year Warranty',    delivery: 'Installation support across Chitwan.',  }
,  {
    id: 'cooler-better-1',    name: 'Better Air Cooler Model 1',    brand: 'Better',    category: 'Air Cooler',    categoryGroup: 'Cooler',    model: 'BT-CLR-01',    price: 15999,    originalPrice: 18999,    stock: 10,    rating: 4.4,    reviewCount: 18,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Cooler.png'],    description: 'Better brand air cooler.',    features: ['Powerful airflow', 'Low power consumption', 'Large water tank', 'Portable design'],    specs: {
 Capacity: '50L', Type: 'Air Cooler', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Available across Chitwan.',  }
,  {
    id: 'cooler-better-2',    name: 'Better Air Cooler Model 2',    brand: 'Better',    category: 'Air Cooler',    categoryGroup: 'Cooler',    model: 'BT-CLR-02',    price: 17999,    originalPrice: 20999,    stock: 8,    rating: 4.5,    reviewCount: 22,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['/Cooler.png'],    description: 'Better brand air cooler.',    features: ['High speed motor', 'Remote control', 'Ice chamber', 'Energy efficient'],    specs: {
 Capacity: '60L', Type: 'Desert Cooler', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Available across Chitwan.',  }
,  {
    id: 'cooler-better-3',    name: 'Better Air Cooler Model 3',    brand: 'Better',    category: 'Air Cooler',    categoryGroup: 'Cooler',    model: 'BT-CLR-03',    price: 21999,    originalPrice: 24999,    stock: 6,    rating: 4.6,    reviewCount: 14,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Cooler.png'],    description: 'Better brand air cooler.',    features: ['Premium cooling', 'Smart control', 'Large capacity', 'Quiet operation'],    specs: {
 Capacity: '75L', Type: 'Desert Cooler', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Available across Chitwan.',  }
,  {
    id: 'cooler-cg-1',    name: 'CG Air Cooler Model 1',    brand: 'CG',    category: 'Air Cooler',    categoryGroup: 'Cooler',    model: 'CG-CLR-01',    price: 14500,    originalPrice: 17500,    stock: 12,    rating: 4.3,    reviewCount: 20,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Cooler.png'],    description: 'CG brand air cooler.',    features: ['Powerful airflow', 'Low power consumption', 'Large water tank', 'Portable design'],    specs: {
 Capacity: '45L', Type: 'Air Cooler', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Available across Chitwan.',  }
,  {
    id: 'cooler-cg-2',    name: 'CG Air Cooler Model 2',    brand: 'CG',    category: 'Air Cooler',    categoryGroup: 'Cooler',    model: 'CG-CLR-02',    price: 16999,    originalPrice: 19999,    stock: 9,    rating: 4.4,    reviewCount: 25,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['/Cooler.png'],    description: 'CG brand air cooler.',    features: ['High speed motor', 'Remote control', 'Ice chamber', 'Energy efficient'],    specs: {
 Capacity: '55L', Type: 'Desert Cooler', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Available across Chitwan.',  }
,  {
    id: 'cooler-cg-3',    name: 'CG Air Cooler Model 3',    brand: 'CG',    category: 'Air Cooler',    categoryGroup: 'Cooler',    model: 'CG-CLR-03',    price: 19999,    originalPrice: 22999,    stock: 7,    rating: 4.5,    reviewCount: 16,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Cooler.png'],    description: 'CG brand air cooler.',    features: ['Premium cooling', 'Smart control', 'Large capacity', 'Quiet operation'],    specs: {
 Capacity: '70L', Type: 'Desert Cooler', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Available across Chitwan.',  }
,  {
    id: 'cooler-sensei-1',    name: 'Sensei Air Cooler Model 1',    brand: 'Sensei',    category: 'Air Cooler',    categoryGroup: 'Cooler',    model: 'SN-CLR-01',    price: 15500,    originalPrice: 18500,    stock: 11,    rating: 4.4,    reviewCount: 19,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Cooler.png'],    description: 'Sensei brand air cooler.',    features: ['Powerful airflow', 'Low power consumption', 'Large water tank', 'Portable design'],    specs: {
 Capacity: '50L', Type: 'Air Cooler', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Available across Chitwan.',  }
,  {
    id: 'cooler-sensei-2',    name: 'Sensei Air Cooler Model 2',    brand: 'Sensei',    category: 'Air Cooler',    categoryGroup: 'Cooler',    model: 'SN-CLR-02',    price: 17500,    originalPrice: 20500,    stock: 9,    rating: 4.5,    reviewCount: 23,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['/Cooler.png'],    description: 'Sensei brand air cooler.',    features: ['High speed motor', 'Remote control', 'Ice chamber', 'Energy efficient'],    specs: {
 Capacity: '60L', Type: 'Desert Cooler', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Available across Chitwan.',  }
,  {
    id: 'cooler-sensei-3',    name: 'Sensei Air Cooler Model 3',    brand: 'Sensei',    category: 'Air Cooler',    categoryGroup: 'Cooler',    model: 'SN-CLR-03',    price: 20999,    originalPrice: 23999,    stock: 6,    rating: 4.6,    reviewCount: 15,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Cooler.png'],    description: 'Sensei brand air cooler.',    features: ['Premium cooling', 'Smart control', 'Large capacity', 'Quiet operation'],    specs: {
 Capacity: '75L', Type: 'Desert Cooler', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Available across Chitwan.',  }
,  {
    id: 'cf-usha-stella',    name: 'Usha Stella Ceiling Fan',    brand: 'Usha',    category: 'Ceiling Fan',    categoryGroup: 'Fans',    model: 'US-ST-1200',    price: 3299,    originalPrice: 3999,    stock: 20,    rating: 4.4,    reviewCount: 35,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Fan.jpg'],    description: 'Usha Stella ceiling fan with smooth and powerful airflow.',    features: ['High-speed motor', 'Low noise', 'Energy efficient', 'Modern design'],    specs: {
 Size: '1200 MM', Speed: '3 Speed', Power: '65W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'cf-usha-hs',    name: 'Usha High Speed Ceiling Fan',    brand: 'Usha',    category: 'Ceiling Fan',    categoryGroup: 'Fans',    model: 'US-HS-1400',    price: 3799,    originalPrice: 4499,    stock: 18,    rating: 4.5,    reviewCount: 29,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['/Fan.jpg'],    description: 'Usha high speed ceiling fan for maximum air delivery.',    features: ['High speed', 'Durable motor', 'Quiet operation', 'Sleek blades'],    specs: {
 Size: '1400 MM', Speed: '3 Speed', Power: '70W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'cf-orient-elegance',    name: 'Orient Elegance Ceiling Fan',    brand: 'Orient',    category: 'Ceiling Fan',    categoryGroup: 'Fans',    model: 'OR-EL-1200',    price: 3499,    originalPrice: 4199,    stock: 22,    rating: 4.5,    reviewCount: 31,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Fan.jpg'],    description: 'Orient Elegance ceiling fan with refined look and airflow.',    features: ['High-speed motor', 'Low noise', 'Stylish design', 'Energy efficient'],    specs: {
 Size: '1200 MM', Speed: '3 Speed', Power: '65W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'cf-orient-aero',    name: 'Orient Aero Ceiling Fan',    brand: 'Orient',    category: 'Ceiling Fan',    categoryGroup: 'Fans',    model: 'OR-AE-1400',    price: 3899,    originalPrice: 4599,    stock: 15,    rating: 4.6,    reviewCount: 24,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['/Fan.jpg'],    description: 'Orient Aero ceiling fan delivering powerful air circulation.',    features: ['Powerful airflow', 'Durable build', 'Low noise', 'Modern finish'],    specs: {
 Size: '1400 MM', Speed: '3 Speed', Power: '72W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'cf-cg-royal',    name: 'CG Royal Ceiling Fan',    brand: 'CG',    category: 'Ceiling Fan',    categoryGroup: 'Fans',    model: 'CG-RY-1200',    price: 3199,    originalPrice: 3899,    stock: 25,    rating: 4.3,    reviewCount: 27,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Fan.jpg'],    description: 'CG Royal ceiling fan with balanced performance.',    features: ['High-speed motor', 'Low noise', 'Energy efficient', 'Classic design'],    specs: {
 Size: '1200 MM', Speed: '3 Speed', Power: '65W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'cf-cg-turbo',    name: 'CG Turbo Ceiling Fan',    brand: 'CG',    category: 'Ceiling Fan',    categoryGroup: 'Fans',    model: 'CG-TB-1400',    price: 3699,    originalPrice: 4399,    stock: 19,    rating: 4.4,    reviewCount: 22,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['/Fan.jpg'],    description: 'CG Turbo ceiling fan for strong, consistent airflow.',    features: ['Turbo motor', 'High speed', 'Durable', 'Low maintenance'],    specs: {
 Size: '1400 MM', Speed: '3 Speed', Power: '70W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'cf-cg-breeze',    name: 'CG Breeze Ceiling Fan',    brand: 'CG',    category: 'Ceiling Fan',    categoryGroup: 'Fans',    model: 'CG-BZ-1050',    price: 2899,    originalPrice: 3499,    stock: 27,    rating: 4.2,    reviewCount: 18,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Fan.jpg'],    description: 'CG Breeze ceiling fan, compact size for smaller rooms.',    features: ['Compact design', 'Quiet operation', 'Energy efficient', 'Easy install'],    specs: {
 Size: '1050 MM', Speed: '3 Speed', Power: '55W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'cf-better-classic',    name: 'Better Classic Ceiling Fan',    brand: 'Better',    category: 'Ceiling Fan',    categoryGroup: 'Fans',    model: 'BT-CL-1200',    price: 3399,    originalPrice: 4099,    stock: 21,    rating: 4.4,    reviewCount: 26,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Fan.jpg'],    description: 'Better Classic ceiling fan with timeless design.',    features: ['High-speed motor', 'Low noise', 'Classic blades', 'Energy efficient'],    specs: {
 Size: '1200 MM', Speed: '3 Speed', Power: '65W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'cf-better-super',    name: 'Better Super Ceiling Fan',    brand: 'Better',    category: 'Ceiling Fan',    categoryGroup: 'Fans',    model: 'BT-SP-1400',    price: 3899,    originalPrice: 4599,    stock: 17,    rating: 4.5,    reviewCount: 21,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['/Fan.jpg'],    description: 'Better Super ceiling fan for powerful air delivery.',    features: ['Super airflow', 'Durable motor', 'Quiet', 'Modern design'],    specs: {
 Size: '1400 MM', Speed: '3 Speed', Power: '72W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'cf-better-zen',    name: 'Better Zen Ceiling Fan',    brand: 'Better',    category: 'Ceiling Fan',    categoryGroup: 'Fans',    model: 'BT-ZN-1050',    price: 2999,    originalPrice: 3599,    stock: 23,    rating: 4.3,    reviewCount: 15,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Fan.jpg'],    description: 'Better Zen ceiling fan, sleek and compact.',    features: ['Sleek design', 'Quiet operation', 'Energy efficient', 'Easy install'],    specs: {
 Size: '1050 MM', Speed: '3 Speed', Power: '55W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'cf-crompton-regal',    name: 'Crompton Regal Ceiling Fan',    brand: 'Crompton',    category: 'Ceiling Fan',    categoryGroup: 'Fans',    model: 'CR-RE-1400',    price: 4099,    originalPrice: 4799,    stock: 16,    rating: 4.6,    reviewCount: 30,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['/Fan.jpg'],    description: 'Crompton Regal ceiling fan with premium performance.',    features: ['Premium motor', 'High airflow', 'Low noise', 'Durable finish'],    specs: {
 Size: '1400 MM', Speed: '3 Speed', Power: '72W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'cf-crompton-aura',    name: 'Crompton Aura Ceiling Fan',    brand: 'Crompton',    category: 'Ceiling Fan',    categoryGroup: 'Fans',    model: 'CR-AU-1050',    price: 3099,    originalPrice: 3699,    stock: 20,    rating: 4.3,    reviewCount: 19,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Fan.jpg'],    description: 'Crompton Aura ceiling fan, compact and efficient.',    features: ['Compact design', 'Quiet operation', 'Energy efficient', 'Modern look'],    specs: {
 Size: '1050 MM', Speed: '3 Speed', Power: '55W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'tf-cg-classic',    name: 'CG Classic Table Fan',    brand: 'CG',    category: 'Table Fan',    categoryGroup: 'Fans',    model: 'CG-TF-450',    price: 1899,    originalPrice: 2399,    stock: 30,    rating: 4.2,    reviewCount: 24,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Fan.jpg'],    description: 'CG Classic table fan for everyday cooling.',    features: ['Compact size', 'Quiet operation', 'Oscillation', 'Energy efficient'],    specs: {
 Size: '450 MM', Speed: '3 Speed', Power: '45W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'tf-usha-forte',    name: 'Usha Forte Table Fan',    brand: 'Usha',    category: 'Table Fan',    categoryGroup: 'Fans',    model: 'US-TF-400',    price: 1799,    originalPrice: 2299,    stock: 28,    rating: 4.3,    reviewCount: 20,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['/Fan.jpg'],    description: 'Usha Forte table fan with strong airflow.',    features: ['Powerful airflow', 'Compact', 'Quiet', 'Durable blades'],    specs: {
 Size: '400 MM', Speed: '3 Speed', Power: '40W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'tf-orient-pedestal',    name: 'Orient Desk Table Fan',    brand: 'Orient',    category: 'Table Fan',    categoryGroup: 'Fans',    model: 'OR-TF-450',    price: 1999,    originalPrice: 2499,    stock: 26,    rating: 4.3,    reviewCount: 17,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Fan.jpg'],    description: 'Orient desk table fan with smooth oscillation.',    features: ['Smooth oscillation', 'Quiet operation', 'Compact', 'Energy efficient'],    specs: {
 Size: '450 MM', Speed: '3 Speed', Power: '45W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'wf-cg-comfort',    name: 'CG Comfort Wall Fan',    brand: 'CG',    category: 'Wall Fan',    categoryGroup: 'Fans',    model: 'CG-WF-450',    price: 2199,    originalPrice: 2699,    stock: 24,    rating: 4.2,    reviewCount: 16,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Fan.jpg'],    description: 'CG Comfort wall fan, space-saving and efficient.',    features: ['Space saving', 'Quiet operation', 'Strong airflow', 'Easy mounting'],    specs: {
 Size: '450 MM', Speed: '3 Speed', Power: '45W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'wf-crompton-airflow',    name: 'Crompton Wall Fan',    brand: 'Crompton',    category: 'Wall Fan',    categoryGroup: 'Fans',    model: 'CR-WF-500',    price: 2399,    originalPrice: 2899,    stock: 22,    rating: 4.4,    reviewCount: 19,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['/Fan.jpg'],    description: 'Crompton wall fan with powerful wall-mounted airflow.',    features: ['Powerful airflow', 'Quiet', 'Durable', 'Space saving'],    specs: {
 Size: '500 MM', Speed: '3 Speed', Power: '50W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'wf-usha-pro',    name: 'Usha Pro Wall Fan',    brand: 'Usha',    category: 'Wall Fan',    categoryGroup: 'Fans',    model: 'US-WF-450',    price: 2299,    originalPrice: 2799,    stock: 20,    rating: 4.3,    reviewCount: 14,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Fan.jpg'],    description: 'Usha Pro wall fan with reliable mounted cooling.',    features: ['Reliable motor', 'Quiet', 'Compact', 'Energy efficient'],    specs: {
 Size: '450 MM', Speed: '3 Speed', Power: '45W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'sf-better-royal',    name: 'Better Royal Stand Fan',    brand: 'Better',    category: 'Stand Fan',    categoryGroup: 'Fans',    model: 'BT-SF-500',    price: 3999,    originalPrice: 4799,    stock: 19,    rating: 4.4,    reviewCount: 23,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Fan.jpg'],    description: 'Better Royal stand fan with adjustable height.',    features: ['Adjustable height', 'Strong airflow', 'Quiet', 'Oscillation'],    specs: {
 Size: '500 MM', Speed: '3 Speed', Power: '55W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'sf-orient-turbo',    name: 'Orient Turbo Stand Fan',    brand: 'Orient',    category: 'Stand Fan',    categoryGroup: 'Fans',    model: 'OR-SF-500',    price: 4199,    originalPrice: 4999,    stock: 17,    rating: 4.5,    reviewCount: 21,    inStock: true,    newArrival: true,    featured: false,    bestSeller: true,    images: ['/Fan.jpg'],    description: 'Orient Turbo stand fan with powerful airflow.',    features: ['Turbo airflow', 'Adjustable height', 'Quiet', 'Durable base'],    specs: {
 Size: '500 MM', Speed: '3 Speed', Power: '55W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,  {
    id: 'sf-cg-cruiser',    name: 'CG Cruiser Stand Fan',    brand: 'CG',    category: 'Stand Fan',    categoryGroup: 'Fans',    model: 'CG-SF-450',    price: 3799,    originalPrice: 4499,    stock: 18,    rating: 4.3,    reviewCount: 18,    inStock: true,    newArrival: true,    featured: false,    bestSeller: false,    images: ['/Fan.jpg'],    description: 'CG Cruiser stand fan, balanced and portable.',    features: ['Portable', 'Strong airflow', 'Quiet', 'Adjustable'],    specs: {
 Size: '450 MM', Speed: '3 Speed', Power: '50W', Warranty: '1 Year' }
,    warranty: '1 Year Warranty',    delivery: 'Delivery available across Chitwan.',  }
,]
// ============================================================================
// DEFAULT STATE & PERSISTENCE
// ============================================================================
const persistedState = (key, fallback) => {
  
try {
    
const stored = localStorage.getItem(key)
    
return stored ? JSON.parse(stored) : fallback  }
 
catch {
    
return fallback  }
}
// Clear old cached email if it still contains the old address
const cachedContent = localStorage.getItem('panchakanya-content')
if (cachedContent) {
  const parsed = JSON.parse(cachedContent)
  if (parsed.email && parsed.email !== 'shaan.urs@gmail.com') {
    localStorage.removeItem('panchakanya-content')
  }
}
const defaultSiteContent = {
  phone: '+977-9855-033485',  whatsapp: '+977-9855-033485',  email: 'shaan.urs@gmail.com',  location: 'Tandi, Chitwan, Nepal',  hours: 'Sun - Fri: 9:00 AM - 7:00 PM',  about: 'Panchakanya Electric Emporium is a trusted electrical and appliance shop in Tandi, Chitwan. We supply fans, coolers, AC, rice cookers, induction stoves, refrigerators, chandeliers, lights, inverters, batteries, and electrical essentials from trusted brands.',}
// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
function App() {
  
// State - Products & Catalog
  
const [products, setProducts] = useState(() => {
    const loaded = persistedState('panchakanya-products-v8', defaultProducts)
    return loaded.filter((p) => String(p.brand || '').toLowerCase() !== 'baltra')
  })
  
const [searchTerm, setSearchTerm] = useState('')
  
const [selectedBrand, setSelectedBrand] = useState('All')
  
const [selectedCategory, setSelectedCategory] = useState('All')
  
const [sortBy, setSortBy] = useState('featured')  
// State - UI & Navigation
  
const [menuOpen, setMenuOpen] = useState(false)
  
const [selectedProduct, setSelectedProduct] = useState(null)
  
const [whatsappConfirm, setWhatsappConfirm] = useState(null)  
// State - Scroll to top
const [showScrollTop, setShowScrollTop] = useState(false)  
// State - Site Content
  
const [siteContent, setSiteContent] = useState(() => persistedState('panchakanya-content', defaultSiteContent))  
// State - Brands
const [brands, setBrands] = useState(() => {
    const stored = persistedState('panchakanya-brands', null)
    if (Array.isArray(stored) && stored.length) return stored
    return DEFAULT_BRANDS.map((b, i) => ({ id: i + 1, ...b }))
  })
// Persist state changes
  useEffect(() => {
 localStorage.setItem('panchakanya-products-v8', JSON.stringify(products)) }
, [products])
  useEffect(() => {
 localStorage.setItem('panchakanya-content', JSON.stringify(siteContent)) }
, [siteContent])
  useEffect(() => {
 localStorage.setItem('panchakanya-brands', JSON.stringify(brands)) }
, [brands])  
// Sync catalog with Supabase on load
  const initialProductsRef = useRef(products)
  const initialSiteContentRef = useRef(siteContent)
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        const { data: rows, error } = await supabase.from('products').select('*').limit(5000)
        if (error) throw error
        if (rows && rows.length) {
          setProducts(rows.map(rowToProduct).filter((p) => String(p.brand || '').toLowerCase() !== 'baltra'))
        } else if (initialProductsRef.current.length) {
          const { error: upsertError } = await supabase.from('products').upsert(initialProductsRef.current.map(productToRow))
          if (upsertError) console.warn('Could not seed products to Supabase:', upsertError.message)
        }
        const { data: brandRows, error: brandErr } = await supabase.from('brands').select('*').limit(1000)
        if (!brandErr && brandRows && brandRows.length) {
          const mapped = brandRows.map(rowToBrand).filter((b) => String(b.name || '').toLowerCase() !== 'baltra')
          setBrands(mapped)
        } else if (!brandErr && (!brandRows || !brandRows.length)) {
          const seeds = DEFAULT_BRANDS.map((b) => ({ name: b.name, logo: b.logo }))
          const { error: brandInsErr } = await supabase.from('brands').insert(seeds)
          if (brandInsErr) console.warn('Could not seed brands:', brandInsErr.message)
        }
        const content = await supabase.from('site_content').select('*').eq('id', 'main').maybeSingle()
        if (content.error) throw content.error
        if (content.data) {
          setSiteContent(rowToSiteContent(content.data))
        } else {
          const { error: contentUpsertError } = await supabase.from('site_content').upsert(siteContentToRow(initialSiteContentRef.current))
          if (contentUpsertError) console.warn('Could not seed site content to Supabase:', contentUpsertError.message)
        }
      } catch (err) {
        console.warn('Supabase not reachable, using local catalog:', err.message)
      }
    }
    loadFromSupabase()
  }, [])
// Scroll-to-top visibility + modal handling
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  // Scroll reveal animation
  useEffect(() => {
    const els = document.querySelectorAll('section, .reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('revealed'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' })
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null)
        setWhatsappConfirm(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    const locked = !!(selectedProduct || whatsappConfirm)
    if (locked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedProduct, whatsappConfirm])  
// ============================================================================
  
// FILTERING & SORTING LOGIC
  
// ============================================================================
  
const filteredProducts = useMemo(() => {
    
const term = searchTerm.toLowerCase().trim()
        
let filtered = products.filter((product) => {
      
// Search filter
      
const matchesSearch =        !term ||        String(product.name || '').toLowerCase().includes(term) ||        String(product.brand || '').toLowerCase().includes(term) ||        String(product.model || '').toLowerCase().includes(term) ||        String(product.category || '').toLowerCase().includes(term) ||        String(product.categoryGroup || '').toLowerCase().includes(term) ||        String(product.description || '').toLowerCase().includes(term)      
// Brand filter
      
const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand      
// Category filter
      
const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory || product.categoryGroup === selectedCategory      
return matchesSearch && matchesBrand && matchesCategory    }
)    
// Sorting
    
switch (sortBy) {
      
case 'low-high':        filtered.sort((a, b) => a.price - b.price)
        
break      
case 'high-low':        filtered.sort((a, b) => b.price - a.price)
        
break      
case 'newest':        filtered.sort((a, b) => Number(b.newArrival) - Number(a.newArrival))
        
break      
case 'rating':        filtered.sort((a, b) => b.rating - a.rating)
        
break      
default:        filtered.sort((a, b) => Number(b.featured) - Number(a.featured))    }
    
return filtered  }
, [products, searchTerm, selectedBrand, selectedCategory, sortBy])  
// Get featured products
  
const featuredProducts = useMemo(    () => products.filter((p) => p.featured).slice(0, 6),    [products]  )  // Unique list of brands from products (for brand filter)
  
const brandOptions = useMemo(    () => ['All', ...new Set([...brands.map((b) => b.name), ...products.map((p) => p.brand)].filter(Boolean))].sort(),    [brands, products]  )
  
const resetFilters = () => {
    setSelectedBrand('All')
    setSelectedCategory('All')
    setSearchTerm('')
    setSortBy('featured')  }
  
// ============================================================================
  
// RENDER - STORE VIEW
  
// ============================================================================
  
return (    <div className="app-shell">      {
/* NAVBAR */}
      <header className="navbar">        <div className="navbar-container">          <div className="navbar-brand">            <button className={`navbar-toggle ${menuOpen ? 'open' : ''}`} onClick={
() => setMenuOpen(!menuOpen)}
>              <span className="hamburger hamburger-1"></span>              <span className="hamburger hamburger-2"></span>              <span className="hamburger hamburger-3"></span>            </button>            <div className="logo">              <img className="logo-icon-img" src={asset('/PPE.jpg')} alt="Panchakanya Electric Emporium" />              <div className="logo-text">                <strong>Panchakanya</strong>                <small>Electric Emporium</small>              </div>            </div>          </div>          <div className={
`navbar-menu ${menuOpen ? 'active' : ''}`
}
>            <a href="#home" onClick={
() => setMenuOpen(false)}
>Home</a>            <a href="#brands" onClick={
() => setMenuOpen(false)}
>Brands</a>            <a href="#categories" onClick={
() => setMenuOpen(false)}
>Products</a>            <a href="#shop" onClick={
() => setMenuOpen(false)}
>Shop</a>            <a href="#contact" onClick={
() => setMenuOpen(false)}
>Contact</a>          </div>          <div className="navbar-actions">            <input               type="search"               className="navbar-search"               placeholder="Search products..."               value={
searchTerm}
              onChange={
(e) => setSearchTerm(e.target.value)}
            />            <a href={
`https://wa.me/${WHATSAPP_NUMBER}`
}
 className="navbar-cta" target="_blank" rel="noreferrer">              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.32A10 10 0 1 0 12 2Zm0 18.15a8.15 8.15 0 0 1-4.16-1.14l-.3-.18-3.06.78.81-2.98-.2-.31A8.15 8.15 0 1 1 12 20.15Zm4.47-6.11c-.24-.12-1.44-.71-1.66-.79s-.39-.12-.55.12-.63.79-.77.95-.29.18-.53.06a6.68 6.68 0 0 1-3.37-2.94c-.25-.43.25-.4.72-1.33a.45.45 0 0 0-.02-.43c-.06-.12-.55-1.32-.75-1.81s-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.73 2.73 0 0 0-.86 2.05 4.75 4.75 0 0 0 1 2.52 10.78 10.78 0 0 0 4.13 3.67 14.13 14.13 0 0 0 1.38.51 3.3 3.3 0 0 0 1.52.1 2.47 2.47 0 0 0 1.62-1.15 2 2 0 0 0 .14-1.15c-.06-.11-.23-.18-.47-.3Z"/></svg> WhatsApp            </a>            <a href={asset('/item.html')} className="admin-link" title="Manage products (owner)"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.14 12.94a7.07 7.07 0 0 0 .05-.94 7.07 7.07 0 0 0-.05-.94l2.03-1.58a.49.49 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.3 7.3 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.42h-3.84a.48.48 0 0 0-.48.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22L2.19 8.74a.49.49 0 0 0 .12.64l2.03 1.58a7.07 7.07 0 0 0 0 1.88l-2.03 1.58a.49.49 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .61.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54c.05.23.25.42.48.42h3.84c.23 0 .43-.19.48-.42l.36-2.54a7.3 7.3 0 0 0 1.62-.94l2.39.96c.23.09.5 0 .61-.22l1.92-3.32a.49.49 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"/></svg> Admin</a>          </div>        </div>      </header>      <main className="store-main">        {
/* HERO SECTION */}
        <section id="home" className="hero">          <div className="container hero-container">            <div className="hero-content">              <span className="hero-eyebrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg> Trusted Electrical Emporium</span>              <h1>Power Your Home with <span className="text-gradient">Premium Electronics</span></h1>              <p>Premium fans, coolers, AC, appliances & electrical products from trusted brands — with honest prices and dependable after-sales support in Tandi, Chitwan.</p>              <div className="hero-buttons">                <button className="btn-primary" onClick={
() => {
 document.getElementById('shop').scrollIntoView({
 behavior: 'smooth' }
) }
}
>Explore Products <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>                <a href={
`https://wa.me/${WHATSAPP_NUMBER}`
}
 className="btn-secondary" target="_blank" rel="noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.32A10 10 0 1 0 12 2Zm0 18.15a8.15 8.15 0 0 1-4.16-1.14l-.3-.18-3.06.78.81-2.98-.2-.31A8.15 8.15 0 1 1 12 20.15Zm4.47-6.11c-.24-.12-1.44-.71-1.66-.79s-.39-.12-.55.12-.63.79-.77.95-.29.18-.53.06a6.68 6.68 0 0 1-3.37-2.94c-.25-.43.25-.4.72-1.33a.45.45 0 0 0-.02-.43c-.06-.12-.55-1.32-.75-1.81s-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.73 2.73 0 0 0-.86 2.05 4.75 4.75 0 0 0 1 2.52 10.78 10.78 0 0 0 4.13 3.67 14.13 14.13 0 0 0 1.38.51 3.3 3.3 0 0 0 1.52.1 2.47 2.47 0 0 0 1.62-1.15 2 2 0 0 0 .14-1.15c-.06-.11-.23-.18-.47-.3Z"/></svg> Chat on WhatsApp</a>              </div>              <div className="hero-stats">                <div className="hero-stat"><strong>50+</strong><span>Trusted Brands</span></div>                <div className="hero-stat"><strong>500+</strong><span>Products</span></div>                <div className="hero-stat"><strong>10+</strong><span>Years Experience</span></div>              </div>            </div>            <div className="hero-collage">              <div className="collage-grid">                <div className="collage-item collage-card-1">                  <img src={asset('/AC.png')} alt="AC" />                  <span className="collage-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h4v6h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-6v6H7v-6H4v-4h3V2Z"/></svg> Air Conditioner</span>                </div>                <div className="collage-item collage-card-2">                  <img src={asset('/Cooler.png')} alt="Air Cooler" />                  <span className="collage-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 8c6-2 12-2 18 0"/><path d="M3 12c6-2 12-2 18 0"/><path d="M3 16c6-2 12-2 18 0"/><path d="M9 3l-2 2m8-2 2 2"/></svg> Air Cooler</span>                </div>                <div className="collage-item collage-card-3">                  <img src={asset('/Fan.jpg')} alt="Fans" />                  <span className="collage-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM12 3c4.42 0 8 1.72 8 4s-3.58 4-8 4-8-1.72-8-4 3.58-4 8-4Zm0 9c4.42 0 8 1.72 8 4s-3.58 4-8 4-8-1.72-8-4 3.58-4 8-4Zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></svg> Fans</span>                </div>                <div className="collage-item collage-card-4">                  <img src={asset('/Lights.jpg')} alt="Lights" />                  <span className="collage-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg> Lights</span>                </div>              </div>            </div>          </div>        </section>        {
/* TRUST STRIP */}
        <section className="trust-strip">          <div className="container trust-grid">            <div className="trust-item">              <span className="trust-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg></span>              <div>                <strong>Genuine Brands</strong>                <small>Trusted, original products</small>              </div>            </div>            <div className="trust-item">              <span className="trust-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg></span>              <div>                <strong>Fast Delivery</strong>                <small>Across Chitwan</small>              </div>            </div>            <div className="trust-item">              <span className="trust-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/></svg></span>              <div>                <strong>Installation Support</strong>                <small>Free guidance at the store</small>              </div>            </div>            <div className="trust-item">              <span className="trust-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.32A10 10 0 1 0 12 2Z"/></svg></span>              <div>                <strong>WhatsApp Support</strong>                <small>Instant replies</small>              </div>            </div>          </div>        </section>        {
/* SHOP BY CATEGORY SECTION */}
        <section id="categories" className="shop-by-category">          <div className="container">            <div className="section-header">              <h2>Everything Your Home Needs</h2>              <p>Browse our comprehensive collection by category</p>            </div>            <div className="category-showcase-grid">              <div className="category-showcase-card">                <div className="category-showcase-icon">🍳</div>                <h3>Kitchen Appliances</h3>                <ul>                  <li>Kitchen Chimney</li>                  <li>Rice Cooker</li>                  <li>Induction Cooktops</li>                </ul>                <button className="category-showcase-btn" onClick={
() => {
                   setSelectedCategory('Kitchen Appliances')
                  document.getElementById('shop').scrollIntoView({
 behavior: 'smooth' }
)                }
}
>Shop Now →</button>              </div>              <div className="category-showcase-card">                <div className="category-showcase-icon">🏠</div>                <h3>Home Appliances</h3>                <ul>                  <li>Refrigerator</li>                  <li>Washing Machine</li>                  <li>Cooler & AC</li>                </ul>                <button className="category-showcase-btn" onClick={
() => {
                   setSelectedCategory('Home Appliances')
                  document.getElementById('shop').scrollIntoView({
 behavior: 'smooth' }
)                }
}
>Shop Now →</button>              </div>              <div className="category-showcase-card">                <div className="category-showcase-icon">⚡</div>                <h3>Electrical & Comfort</h3>                <ul>                  <li>Fans</li>                  <li>Chandeliers</li>                  <li>Lighting Solutions</li>                </ul>                <button className="category-showcase-btn" onClick={
() => {
                   setSelectedCategory('Fans')
                  document.getElementById('shop').scrollIntoView({
 behavior: 'smooth' }
)                }
}
>Shop Now →</button>              </div>              <div className="category-showcase-card">                <div className="category-showcase-icon">🔋</div>                <h3>Power Solutions</h3>                <ul>                  <li>Inverter</li>                  <li>Battery</li>                  <li>Motors & Pumps</li>                </ul>                <button className="category-showcase-btn" onClick={
() => {
                   setSelectedCategory('Electrical & Power')
                  document.getElementById('shop').scrollIntoView({
 behavior: 'smooth' }
)                }
}
>Shop Now →</button>              </div>            </div>          </div>        </section>        {
/* BRANDS SECTION */}
        <section id="brands" className="brands-section">          <div className="container">            <div className="section-header">              <h2>Our Trusted Brands</h2>              <p>We supply quality products from leading brands</p>            </div>            <div className="brands-grid">              {
brands.map((brand) => (                <button                  key={brand.id || brand.name}
                  className={ `brand-card ${selectedBrand === brand.name ? 'active' : ''}` }
                  onClick={ () => { setSelectedBrand(selectedBrand === brand.name ? 'All' : brand.name); document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }) } }
                  title={ `Filter by ${brand.name}` }
                >                  { brand.logo && brand.logo !== '✨' ? <img src={asset(brand.logo)} alt={brand.name} className="brand-logo-image" /> : <span className="brand-logo">✨</span> }
                  <span className="brand-name">{brand.name}</span>
                </button>              ))}
              <button                className={ `brand-card ${selectedBrand === 'All' ? 'active' : ''}` }
                onClick={ () => { setSelectedBrand('All'); document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }) } }
              >                <span className="brand-logo">✨</span>                <span className="brand-name">All Brands</span>              </button>            </div>          </div>        </section>        {
/* FEATURED PRODUCTS */}
        <section className="featured-products">          <div className="container">            <div className="section-header">              <h2>Featured Products</h2>              <p>Our best-selling items</p>            </div>            <div className="products-grid">              {
featuredProducts.map((product) => (                <div key={
product.id}
 className="product-card">                  <div className="product-image">                    <img src={
getProductImage(product)}
 alt={
product.name}
 />                    {
product.originalPrice > product.price && (                      <span className="discount-badge">                        {
Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}
% OFF                      </span>                    )}
                    {
product.newArrival && <span className="new-badge">NEW</span>}
                    <button className="quick-view" onClick={() => setSelectedProduct(product)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg> Quick View</button>
                  </div>                  <div className="product-info">                    <span className="product-brand">{
product.brand}
</span>                    <h3>{
product.name}
</h3>                    {
product.model && <p className="product-model">Model: {
product.model}
</p>}
                    <span className="product-category">{
product.category}
</span>                    <div className="product-rating">                      {
'★'.repeat(Math.floor(product.rating || 0))}
 ({
product.reviewCount || 0}
)                    </div>                    <div className="product-price">                      <span className="price">{
formatNPR(product.price)}
</span>                      {
product.originalPrice > product.price && (                        <span className="original-price">{
formatNPR(product.originalPrice)}
</span>                      )}
                    </div>                    <div className="product-buttons">                      <button className="btn-view" onClick={
() => setSelectedProduct(product)}
>Details</button>                      <button className="btn-whatsapp" onClick={
() => setWhatsappConfirm(product)}
><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.32A10 10 0 1 0 12 2Z"/></svg> Inquire</button>                    </div>                  </div>                </div>              ))}
            </div>          </div>        </section>        {
/* CATEGORIES SECTION */}
        <section id="categories" className="categories-section">          <div className="container">            <div className="section-header">              <h2>Shop by Category</h2>              <p>Browse our organized product categories</p>            </div>            <div className="categories-grid">              {
Object.values(PRODUCT_CATEGORIES).map((category) => (                <button                  key={
category.id}
                  className={
`category-card ${selectedCategory === category.name ? 'active' : ''}`
}
                  onClick={
() => {
                    setSelectedCategory(selectedCategory === category.name ? 'All' : category.name)
                    document.getElementById('shop').scrollIntoView({
 behavior: 'smooth' }
)                  }
}
                >                  <span className="category-icon">{
category.icon}
</span>                  <span className="category-name">{
category.name}
</span>                </button>              ))}
              <button                className={
`category-card ${selectedCategory === 'All' ? 'active' : ''}`
}
                onClick={
() => {
                  setSelectedCategory('All')
                  document.getElementById('shop').scrollIntoView({
 behavior: 'smooth' }
)                }
}
              >                <span className="category-icon">🔍</span>                <span className="category-name">All Products</span>              </button>            </div>          </div>        </section>        {
/* SHOP / PRODUCTS SECTION */}
        <section id="shop" className="shop-section">          <div className="container">            <div className="shop-header">              <h2>Our Complete Catalog</h2>              <div className="shop-controls">                <select value={
selectedBrand}
 onChange={
(e) => setSelectedBrand(e.target.value)}
 className="sort-select">                  {
brandOptions.map((brand) => (                    <option key={
brand}
 value={
brand}
>{
brand === 'All' ? 'All Brands' : brand}
</option>                  ))}
                </select>                <select value={
sortBy}
 onChange={
(e) => setSortBy(e.target.value)}
 className="sort-select">                  <option value="featured">Featured</option>                  <option value="newest">Newest</option>                  <option value="rating">Top Rated</option>                  <option value="low-high">Price: Low to High</option>                  <option value="high-low">Price: High to Low</option>                </select>              </div>            </div>            {
/* ACTIVE FILTERS DISPLAY */}
            <div className="filters-display">              <div className="active-filters">                {
(selectedBrand !== 'All' || selectedCategory !== 'All' || searchTerm) && (                  <>                    <div className="filters-info">                      <span>Active Filters:</span>                      {
selectedBrand !== 'All' && <span className="filter-tag">{
selectedBrand}
 <button onClick={
() => setSelectedBrand('All')}
>×</button></span>}
                      {
selectedCategory !== 'All' && <span className="filter-tag">{
selectedCategory}
 <button onClick={
() => setSelectedCategory('All')}
>×</button></span>}
                      {
searchTerm && <span className="filter-tag">"{searchTerm}" <button onClick={
() => setSearchTerm('')}
>×</button></span>}
                    </div>                    <button className="reset-filters-btn" onClick={
resetFilters}
>                      Clear All Filters                    </button>                  </>                )}
              </div>            </div>            {
/* PRODUCTS GRID */}
            {
filteredProducts.length === 0 ? (              <div className="no-products">                <p>No products found matching your filters. Try adjusting your search or filters.</p>                <button className="btn-primary" onClick={
resetFilters}
>Clear Filters</button>              </div>            ) : (              <div className="products-grid">                {
filteredProducts.map((product) => (                  <div key={
product.id}
 className="product-card">                    <div className="product-image">                      <img src={
getProductImage(product)}
 alt={
product.name}
 />                      {
product.originalPrice > product.price && (                        <span className="discount-badge">                          {
Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}
% OFF                        </span>                      )}
                      {
product.newArrival && <span className="new-badge">NEW</span>}
                      <button className="quick-view" onClick={() => setSelectedProduct(product)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg> Quick View</button>
                    </div>                    <div className="product-info">                      <span className="product-brand">{
product.brand}
</span>                      <h3>{
product.name}
</h3>                      {
product.model && <p className="product-model">Model: {
product.model}
</p>}
                      <span className="product-category">{
product.category}
</span>                      <div className="product-rating">                        {
'★'.repeat(Math.floor(product.rating || 0))}
 ({
product.reviewCount || 0}
)                      </div>                      <div className="product-price">                        <span className="price">{
formatNPR(product.price)}
</span>                        {
product.originalPrice > product.price && (                          <span className="original-price">{
formatNPR(product.originalPrice)}
</span>                        )}
                      </div>                      <div className="product-buttons">                        <button className="btn-view" onClick={
() => setSelectedProduct(product)}
>Details</button>                        <button className="btn-whatsapp" onClick={
() => setWhatsappConfirm(product)}
><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.32A10 10 0 1 0 12 2Z"/></svg> Inquire</button>                      </div>                    </div>                  </div>                ))}
              </div>            )}
          </div>        </section>      </main>      {
/* FOOTER */}
      <footer className="site-footer" id="contact">        <div className="container footer-grid">          <div className="footer-col footer-about">            <div className="logo">              <img className="logo-icon-img" src={asset('/PPE.jpg')} alt="Panchakanya Electric Emporium" />              <div className="logo-text">                <strong>Panchakanya</strong>                <small>Electric Emporium</small>              </div>            </div>            <p>Your trusted electrical &amp; appliance shop in Tandi, Chitwan. Quality products, fair prices and dependable after-sales support.</p>          </div>          <div className="footer-col">            <h4>Quick Links</h4>            <ul>              <li><a href="#home">Home</a></li>              <li><a href="#brands">Brands</a></li>              <li><a href="#categories">Products</a></li>              <li><a href="#shop">Shop</a></li>              <li><a href="#contact">Contact</a></li>            </ul>          </div>          <div className="footer-col">            <h4>Popular Categories</h4>            <ul>              <li><a href="#shop" onClick={ () => setSelectedCategory('Air Conditioner') }>Air Conditioners</a></li>              <li><a href="#shop" onClick={ () => setSelectedCategory('Fans') }>Fans</a></li>              <li><a href="#shop" onClick={ () => setSelectedCategory('Kitchen Appliances') }>Kitchen Appliances</a></li>              <li><a href="#shop" onClick={ () => setSelectedCategory('Lighting & Decor') }>Lighting</a></li>              <li><a href="#shop" onClick={ () => setSelectedCategory('Electrical & Power') }>Electrical &amp; Power</a></li>            </ul>          </div>          <div className="footer-col">            <h4>Contact</h4>            <ul className="footer-contact">              <li>📍 {siteContent.location}</li>              <li>📞 <a href={ `tel:${siteContent.phone}` }>{siteContent.phone}</a></li>              <li>📧 <a href={ `mailto:${siteContent.email}` }>{siteContent.email}</a></li>              <li>🕐 {siteContent.hours}</li>            </ul>          </div>        </div>        <div className="footer-bottom">          <span>© {new Date().getFullYear()} Panchakanya Electric Emporium. All rights reserved.</span>        </div>      </footer>      {
/* SCROLL TO TOP */}
      {
showScrollTop && (        <button className="scroll-top" onClick={ () => window.scrollTo({ top: 0, behavior: 'smooth' }) } aria-label="Back to top">↑</button>      )}
      {
/* PRODUCT DETAIL MODAL */}
      {
selectedProduct && (        <div className="modal-overlay" onClick={
() => setSelectedProduct(null)}
>          <div className="modal-content" onClick={
(e) => e.stopPropagation()}
>            <button className="modal-close" onClick={
() => setSelectedProduct(null)}
>✕</button>            <div className="modal-body">              <div className="modal-image">                <img src={
getProductImage(selectedProduct)}
 alt={
selectedProduct.name}
 />              </div>              <div className="modal-info">                <span className="product-brand">{
selectedProduct.brand}
</span>                <h2>{
selectedProduct.name}
</h2>                {
selectedProduct.model && <p className="product-model">Model: {
selectedProduct.model}
</p>}
                <div className="product-rating">                  {
'★'.repeat(Math.floor(selectedProduct.rating || 0))}
 ({
selectedProduct.reviewCount || 0}
 reviews)                </div>                <div className="product-price">                  <span className="price">{
formatNPR(selectedProduct.price)}
</span>                  {
selectedProduct.originalPrice > selectedProduct.price && (                    <span className="original-price">{
formatNPR(selectedProduct.originalPrice)}
</span>                  )}
                </div>                <p className="product-description">{
selectedProduct.description}
</p>                <div className="product-specs">                  <h4>Specifications</h4>                  <ul>                    {
Object.entries(selectedProduct.specs || {}).map(([key, value]) => (                      <li key={
key}
><strong>{
key}
:</strong> {
value}
</li>                    ))}
                  </ul>                </div>                <div className="product-features">                  <h4>Features</h4>                  <ul>                    {
(selectedProduct.features || []).map((feature, idx) => (                      <li key={
idx}
>✓ {
feature}
</li>                    ))}
                  </ul>                </div>                <div className="product-warranty">                  <strong>Warranty:</strong> {
selectedProduct.warranty}
                </div>                <div className="modal-buttons">                  <button className="btn-primary" onClick={
() => setWhatsappConfirm(selectedProduct)}
>                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.32A10 10 0 1 0 12 2Z"/></svg>                    Inquire on WhatsApp                  </button>                  <button className="btn-secondary" onClick={
() => setSelectedProduct(null)}
>                    Close                  </button>                </div>              </div>            </div>          </div>        </div>      )}
      {
/* WHATSAPP CONFIRMATION MODAL */}
      {
whatsappConfirm && (        <div className="modal-overlay" onClick={
() => setWhatsappConfirm(null)}
>          <div className="modal-content small" onClick={
(e) => e.stopPropagation()}
>            <button className="modal-close" onClick={
() => setWhatsappConfirm(null)}
>✕</button>            <div className="confirmation-body">              <div className="confirmation-icon">💬</div>              <h3>Send WhatsApp Inquiry</h3>              <p>Would you like to send an inquiry about this product on WhatsApp?</p>              <div className="confirmation-product">                <strong>{
whatsappConfirm.name}
</strong>                {
whatsappConfirm.model && <span className="model-text">Model: {
whatsappConfirm.model}
</span>}
                <span className="price">{
formatNPR(whatsappConfirm.price)}
</span>              </div>              <div className="confirmation-buttons">                <button                   className="btn-primary"                   onClick={
() => {
                    openWhatsAppLink(whatsappConfirm.name, whatsappConfirm.price, whatsappConfirm.model)
                    setWhatsappConfirm(null)                  }
}
                >                  Continue to WhatsApp                </button>                <button                   className="btn-secondary"                   onClick={
() => setWhatsappConfirm(null)}
                >                  Cancel                </button>              </div>            </div>          </div>        </div>      )}
      </div>  )}
export default App