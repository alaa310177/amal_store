'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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

  useEffect(() => {
    if (isLoggedIn) fetchOrders()
  }, [isLoggedIn])

  const updateStatus = async (id, status) => {
    await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
    fetchOrders()
  }

  // شاشة تسجيل الدخول
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-zinc-900 p-8 rounded-2xl w-96 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-white text-center mb-4">
            🔐 لوحة التحكم
          </h1>
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="bg-zinc-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-zinc-500"
          />
          <button
            onClick={handleLogin}
            className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
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
        <h1 className="text-white font-bold text-xl">🛍️ لوحة تحكم أمل</h1>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="text-purple-400 hover:text-white transition-colors"
        >
          خروج
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-12">

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-4xl font-bold text-purple-600">{orders.length}</p>
            <p className="text-zinc-500 mt-2">إجمالي الطلبات</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-4xl font-bold text-yellow-500">
              {orders.filter(o => o.status === 'pending').length}
            </p>
            <p className="text-zinc-500 mt-2">طلبات جديدة</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-4xl font-bold text-green-500">
              {orders.filter(o => o.status === 'confirmed').length}
            </p>
            <p className="text-zinc-500 mt-2">طلبات مؤكدة</p>
          </div>
        </div>

        {/* قائمة الطلبات */}
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">الطلبات</h2>

        {loading ? (
          <p className="text-center text-zinc-500">جاري التحميل...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-zinc-500">لا يوجد طلبات بعد</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg">{order.customer_name}</h3>
                    <p className="text-zinc-500">📞 {order.customer_phone}</p>
                    <p className="text-zinc-500">📍 {order.city} - {order.area}</p>
                    <p className="text-zinc-500 text-sm mt-1">
                      {new Date(order.created_at).toLocaleString('ar-SY')}
                    </p>
                  </div>
                  <div className="text-left">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-zinc-100 text-zinc-700'
                    }`}>
                      {order.status === 'pending' ? '⏳ جديد' :
                       order.status === 'confirmed' ? '✅ مؤكد' :
                       order.status === 'cancelled' ? '❌ ملغي' : order.status}
                    </span>
                    <p className="text-zinc-500 text-sm mt-2">
                      {order.payment_method === 'cod' ? '💵 نقداً' : '📱 شام كاش'}
                    </p>
                  </div>
                </div>

                {order.notes && (
                  <p className="text-zinc-600 text-sm bg-zinc-50 rounded-lg p-3 mb-4">
                    💬 {order.notes}
                  </p>
                )}

                {/* أزرار التحكم */}
                {order.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStatus(order.id, 'confirmed')}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      ✅ تأكيد الطلب
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, 'cancelled')}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      ❌ إلغاء الطلب
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}