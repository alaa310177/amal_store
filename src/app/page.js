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
      <header className="relative bg-black shadow-sm py-6 px-8 overflow-hidden">
        <video src="/videos/logo.mp4" autoPlay loop muted playsInline className="h-100 w-auto"/>
        <span className="floating-item absolute top-10 left-5"><img src="/images/عقدة.png" width={300}/></span>
        <span className="floating-item-delay absolute top-40 left-60 text-9xl"><img src="/images/فستان.png" width={250}></img></span>
        <span className="floating-item absolute top-60 left-5"><img src="/images/عطر.png" width={250}/></span>
      </header>

      <div className="relative bg-black">
        <svg className="w-full h-16 -mb-1" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C120,90 240,10 360,50 C480,90 600,10 720,50 C840,90 960,10 1080,50 C1200,90 1320,10 1440,50 L1440,100 L0,100 Z" fill="#9c20b5"/>
        </svg>
      </div>

      {/* القسم الرئيسي Hero */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-20 bg-[#9c20b5]">
        <h2 className="text-4xl font-bold text-white mb-4">
          مرحباً بكم  ..عروضنا الأسبوعية لا تنتهي
        </h2>
        <p className="text-lg text-zinc-300 max-w-md mb-8">
          أناقة وملابس وإكسسوارات مختارة بعناية، خصيصاً لكم
        </p>
      </main>

      {/* قسم المنتجات */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-zinc-900 mb-8 text-center">
          🎁عروض الأسبوع🎁
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  index === 0 ? "h-96" : "h-40"
                }`}
              />
              <div className="p-3">
                <h4 className="font-medium text-zinc-900 text-sm">
                  {product.name}
                </h4>
                <p className="text-zinc-500 text-sm">{product.price} ل.س</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-6 px-8 text-center text-zinc-500">
        © 2026 أمل - جميع الحقوق محفوظة
      </footer>
    </div>
  );
}