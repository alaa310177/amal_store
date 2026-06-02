'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    description: '',
    category_id: 1
  })
  const [addingProduct, setAddingProduct] = useState(false)

  const ADMIN_PASSWORD = 'amal2026'

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
    } else {
      alert('كلمة المرور غلط!')
    }
  }

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(data || [])
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders()
      fetchProducts()
    }
  }, [isLoggedIn])

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    fetchOrders()
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert('يرجى ملء الاسم والسعر على الأقل')
      return
    }
    setAddingProduct(true)
    const { error } = await supabase.from('products').insert({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock_quantity: parseInt(newProduct.stock_quantity) || 0,
      image_url: newProduct.image_url,
      description: newProduct.description,
      category_id: newProduct.category_id,
      is_active: true
    })
    setAddingProduct(false)
    if (!error) {
      alert('✅ تم إضافة المنتج بنجاح!')
      setNewProduct({ name: '', price: '', stock_quantity: '', image_url: '', description: '', category_id: 1 })
      fetchProducts()
    } else {
      alert('حدث خطأ، حاولي مرة ثانية')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('هل أنتِ متأكدة من حذف هذا المنتج؟')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  const handleToggleActive = async (id, currentStatus) => {
    await supabase.from('products').update({ is_active: !currentStatus }).eq('id', id)
    fetchProducts()
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-zinc-900 p-8 rounded-2xl w-96 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-white text-center mb-4">🔐 لوحة التحكم</h1>
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="bg-zinc-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-zinc-500"
          />
          <button onClick={handleLogin} className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
            دخول
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* الهيدر */}
      <header className="bg-black py-4 px-8 flex justify-between items-center">
        <h1 className="text-white font-bold text-xl">🛍️ لوحة تحكم أم رباح</h1>
        <button onClick={() => setIsLoggedIn(false)} className="text-purple-400 hover:text-white transition-colors">
          خروج
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-12">

        {/* إحصائيات */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-4xl font-bold text-purple-600">{orders.length}</p>
            <p className="text-zinc-500 mt-2">إجمالي الطلبات</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-4xl font-bold text-yellow-500">{orders.filter(o => o.status === 'pending').length}</p>
            <p className="text-zinc-500 mt-2">طلبات جديدة</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-4xl font-bold text-green-500">{products.length}</p>
            <p className="text-zinc-500 mt-2">عدد المنتجات</p>
          </div>
        </div>

        {/* التبويبات */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              activeTab === 'orders' ? 'bg-black text-white' : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            📋 الطلبات
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              activeTab === 'products' ? 'bg-black text-white' : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            🛍️ المنتجات
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              activeTab === 'add' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            ➕ إضافة منتج
          </button>
        </div>

        {/* تبويب الطلبات */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4">
            {loading ? (
              <p className="text-center text-zinc-500">جاري التحميل...</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-zinc-500">لا يوجد طلبات بعد</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-zinc-900 text-lg">{order.customer_name}</h3>
                      <p className="text-zinc-500">📞 {order.customer_phone}</p>
                      <p className="text-zinc-500">📍 {order.city} - {order.area}</p>
                      <p className="text-zinc-500 text-sm mt-1">{new Date(order.created_at).toLocaleString('ar-SY')}</p>
                    </div>
                    <div className="text-left">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status === 'pending' ? '⏳ جديد' :
                         order.status === 'confirmed' ? '✅ مؤكد' : '❌ ملغي'}
                      </span>
                      <p className="text-zinc-500 text-sm mt-2">
                        {order.payment_method === 'cod' ? '💵 نقداً' : '📱 شام كاش'}
                      </p>
                    </div>
                  </div>
                  {order.notes && (
                    <p className="text-zinc-600 text-sm bg-zinc-50 rounded-lg p-3 mb-4">💬 {order.notes}</p>
                  )}
                  {order.status === 'pending' && (
                    <div className="flex gap-3">
                      <button onClick={() => updateStatus(order.id, 'confirmed')} className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium">
                        ✅ تأكيد الطلب
                      </button>
                      <button onClick={() => updateStatus(order.id, 'cancelled')} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-medium">
                        ❌ إلغاء الطلب
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* تبويب المنتجات */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover"/>
                <div className="p-4">
                  <h3 className="font-bold text-zinc-900 text-sm mb-1">{product.name}</h3>
                  <p className="text-purple-600 font-medium text-sm mb-3">{product.price} ل.س</p>
                  <p className="text-zinc-500 text-xs mb-3">المخزون: {product.stock_quantity}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(product.id, product.is_active)}
                      className={`flex-1 py-1 rounded-lg text-xs font-medium ${
                        product.is_active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      {product.is_active ? '✅ نشط' : '⏸️ مخفي'}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* تبويب إضافة منتج */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">➕ إضافة منتج جديد</h2>
            <div className="flex flex-col gap-4">
              <input
                placeholder="اسم المنتج *"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="border border-zinc-200 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-zinc-900 placeholder:text-zinc-400"
              />
              <input
                placeholder="السعر (بالليرة السورية) *"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                className="border border-zinc-200 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-zinc-900 placeholder:text-zinc-400"
              />
              <input
                placeholder="الكمية المتوفرة"
                type="number"
                value={newProduct.stock_quantity}
                onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                className="border border-zinc-200 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-zinc-900 placeholder:text-zinc-400"
              />
              <input
                placeholder="رابط الصورة"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                className="border border-zinc-200 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-zinc-900 placeholder:text-zinc-400"
              />
              <textarea
                placeholder="وصف المنتج (اختياري)"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                rows={3}
                className="border border-zinc-200 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-zinc-900 placeholder:text-zinc-400 resize-none"
              />
              <select
                value={newProduct.category_id}
                onChange={(e) => setNewProduct({...newProduct, category_id: parseInt(e.target.value)})}
                className="border border-zinc-200 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-zinc-900"
              >
                <option value={1}>ملابس</option>
                <option value={2}>ملابس داخلية</option>
                <option value={3}>مكياجات</option>
                <option value={4}>عطورات</option>
                <option value={5}>منظفات</option>
                <option value={6}>ألعاب</option>
                <option value={7}>إكسسوارات</option>
                <option value={8}>بفلات وإكسسوارات الجوال</option>
              </select>
              <button
                onClick={handleAddProduct}
                disabled={addingProduct}
                className="bg-purple-600 text-white py-4 rounded-full font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {addingProduct ? 'جاري الإضافة...' : '➕ إضافة المنتج'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}