'use client'
import { useState } from 'react'
import Link from 'next/link'

const categories = [
  { id: 0, name: 'الكل' },
  { id: 1, name: 'ملابس' },
  { id: 2, name: 'ملابس داخلية' },
  { id: 3, name: 'مكياجات' },
  { id: 4, name: 'عطورات' },
  { id: 5, name: 'منظفات' },
  { id: 6, name: 'ألعاب' },
  { id: 7, name: 'إكسسوارات' },
  { id: 8, name: 'بفلات وإكسسوارات الجوال' },
]

export default function ProductsSection({ products }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(0)

  const filtered = products?.filter((p) => {
    const matchCategory = activeCategory === 0 || p.category_id === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <section className="px-4 md:px-8 py-10 md:py-16 max-w-6xl mx-auto">
      <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-6 text-center">
        🎁 عروض الأسبوع 🎁
      </h3>

      {/* البحث */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="🔍 ابحثي عن منتج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-zinc-200 rounded-full px-6 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-purple-500 bg-white shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* التصنيفات */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
              activeCategory === cat.id
                ? 'bg-purple-600 text-white'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:border-purple-400'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* المنتجات */}
      {filtered?.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400 text-lg">لا يوجد منتجات مطابقة 😔</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory(0) }}
            className="mt-4 text-purple-600 hover:underline"
          >
            عرض كل المنتجات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {filtered?.map((product, index) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                index === 0 && activeCategory === 0 && !search ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className={`w-full object-cover ${
                  index === 0 && activeCategory === 0 && !search ? "h-48 md:h-96" : "h-28 md:h-40"
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
      )}
    </section>
  )
}