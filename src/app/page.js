import { supabase } from '../lib/supabase'
import Link from 'next/link'
import ProductsSection from './components/ProductsSection'

export const revalidate = 0

export default async function Home() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* الهيدر */}
      <header dir="ltr" className="relative bg-black overflow-hidden flex flex-col items-center px-4 py-1">
        <video 
          src="/videos/logo.mp4" 
          autoPlay loop muted playsInline 
          className="w-full h-auto max-h-120 md:max-h-100"
          style={{ mixBlendMode: 'screen' }}
          aria-label="شعار المتجر"
        />
        <div className="flex flex-row justify-around items-center w-full -mt-2 md:-mt-3">
          <span className="floating-item hover:scale-110 transition-transform duration-300 cursor-pointer drop-shadow-lg">
            <img src="/images/عقدة.png" className="w-90 md:w-100 h-auto" alt="عقدة" loading="lazy"/>
          </span>
          <span className="floating-item-delay mt-2 md:mt-3 hover:scale-110 transition-transform duration-300 cursor-pointer drop-shadow-lg">
            <img src="/images/فستان.png" className="w-120 md:w-100 h-auto" alt="فستان" loading="lazy"/>
          </span>
          <span className="floating-item hover:scale-110 transition-transform duration-300 cursor-pointer drop-shadow-lg">
            <img src="/images/عطر.png" className="w-75 md:w-44 h-auto" alt="عطر" loading="lazy"/>
          </span>
        </div>
      </header>

      <div className="relative bg-black">
        <svg className="w-full h-12 md:h-16 -mb-1" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C120,90 240,10 360,50 C480,90 600,10 720,50 C840,90 960,10 1080,50 C1200,90 1320,10 1440,50 L1440,100 L0,100 Z" fill="#9c20b5"/>
        </svg>
      </div>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center text-center px-4 md:px-6 py-12 md:py-20 bg-[#9c20b5]">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          مرحباً بكم ..عروضنا الأسبوعية لا تنتهي
        </h2>
        <p className="text-base md:text-lg text-zinc-300 max-w-md mb-8">
          أناقة وملابس وإكسسوارات مختارة بعناية، خصيصاً لكم
        </p>
      </main>

      {/* المنتجات مع البحث والتصنيفات */}
      <ProductsSection products={products} />

      {/* Footer */}
      <footer className="bg-white border-t py-4 md:py-6 px-4 md:px-8 text-center text-zinc-500 text-sm">
        © 2026 أم رباح - جميع الحقوق محفوظة
        <a href="/admin" className="text-white mr-2 select-none">•</a>
      </footer>
    </div>
  )
}