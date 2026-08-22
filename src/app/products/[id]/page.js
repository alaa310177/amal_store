export const dynamic = 'force-dynamic'
import { supabase } from '../../../lib/supabase'
export async function generateStaticParams() {
  const { data: products } = await supabase
    .from('products')
    .select('id')
  
  return (products || []).map((product) => ({
    id: product.id.toString(),
  }))
}
export default async function ProductPage({ params }) {
  const { id } = await params
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white text-2xl">المنتج غير موجود</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* الهيدر */}
      <header className="bg-black py-4 px-8">
        <a href="/" className="text-purple-400 hover:text-white transition-colors">
          → رجوع للمتجر
        </a>
      </header>

      {/* تفاصيل المنتج */}
      <div className="max-w-4xl mx-auto px-8 py-16 flex flex-col md:flex-row gap-12">
        
        {/* الصورة */}
        <div className="flex-1">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-2xl shadow-lg object-cover"
          />
        </div>

        {/* التفاصيل */}
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-zinc-900">
            {product.name}
          </h1>
          
          <p className="text-2xl font-semibold text-purple-600">
            {product.price.toLocaleString()} ل.س
          </p>

          {product.description && (
            <p className="text-zinc-600 leading-relaxed">
              {product.description}
            </p>
          )}

          <p className="text-sm text-zinc-500">
            المتوفر: {product.stock_quantity} قطعة
          </p>

          <a
            href={`/checkout?product=${product.id}&name=${product.name}&price=${product.price}`}
            className="bg-black text-white py-4 px-8 rounded-full text-lg
            hover:bg-purple-700 transition-colors duration-300 text-center block"
>
                🛒 اطلب الآن
          </a>        </div>
      </div>
    </div>
  )
}