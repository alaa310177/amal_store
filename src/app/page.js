import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default async function Home() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* الهيدر */}
<header dir="ltr" className="relative bg-black overflow-hidden flex flex-row items-center justify-between px-4 h-50 md:h-60">
  {/* h-64 بدلاً من h-52 للجوال، و h-80 بدلاً من h-64 للتابلت */}
  
  <div className="flex flex-row justify-around items-center h-full py-2 w-2/5">
    <span className="floating-item">
      <img src="/images/عقدة.png" className="w-300 md:w-400"/>
    </span>
    <span className="floating-item-delay mt-6 md:mt-10">
      <img src="/images/فستان.png" className="w-300 md:w-400"/>
    </span>
    <span className="floating-item">
      <img src="/images/عطر.png" className="w-300 md:w-400"/>
    </span>
  </div>

  <video 
    src="/videos/logo.mp4" 
    autoPlay loop muted playsInline 
    className="w-3/5 h-auto"
    style={{ mixBlendMode: 'screen' }}
  />

</header>
      <div className="relative bg-black">
        <svg className="w-full h-12 md:h-16 -mb-1" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C120,90 240,10 360,50 C480,90 600,10 720,50 C840,90 960,10 1080,50 C1200,90 1320,10 1440,50 L1440,100 L0,100 Z" fill="#9c20b5"/>
        </svg>
      </div>

      {/* القسم الرئيسي Hero */}
      <main className="flex flex-col items-center justify-center text-center px-4 md:px-6 py-12 md:py-20 bg-[#9c20b5]">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          مرحباً بكم ..عروضنا الأسبوعية لا تنتهي
        </h2>
        <p className="text-base md:text-lg text-zinc-300 max-w-md mb-8">
          أناقة وملابس وإكسسوارات مختارة بعناية، خصيصاً لكم
        </p>
      </main>

      {/* قسم المنتجات */}
      <section className="px-4 md:px-8 py-10 md:py-16 max-w-6xl mx-auto">
        <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-6 md:mb-8 text-center">
          🎁عروض الأسبوع🎁
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {products?.map((product, index) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                index === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className={`w-full object-cover ${
                  index === 0 ? "h-48 md:h-96" : "h-28 md:h-40"
                }`}
              />
              <div className="p-2 md:p-3">
                <h4 className="font-medium text-zinc-900 text-xs md:text-sm">
                  {product.name}
                </h4>
                <p className="text-zinc-500 text-xs md:text-sm">{product.price} ل.س</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-4 md:py-6 px-4 md:px-8 text-center text-zinc-500 text-sm">
        © 2026 أمل - جميع الحقوق محفوظة
      </footer>
    </div>
  );
}