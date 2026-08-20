'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function CheckoutPage() {
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    city: '',
    area: '',
    payment_method: 'cod',
    notes: ''
  })
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.customer_name || !form.customer_phone || !form.city) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    setLoading(true)

    let payment_proof_url = null

    // رفع صورة الإيصال لو شام كاش
    if (form.payment_method === 'sham_cash' && receipt) {
      const fileExt = receipt.name.split('.').pop()
      const fileName = `receipt_${Date.now()}.${fileExt}`
      
      const { data } = await supabase.storage
        .from('receipts')
        .upload(fileName, receipt)
      
      if (data) {
        payment_proof_url = data.path
      }
    }

    // حفظ الطلب بقاعدة البيانات
    const { error } = await supabase
      .from('orders')
      .insert({
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        city: form.city,
        area: form.area,
        total_amount: 0,
        payment_method: form.payment_method,
        payment_status: form.payment_method === 'cod' ? 'pending' : 'waiting_review',
        payment_proof_url,
        notes: form.notes
      })

    setLoading(false)

    if (!error) {
      setSuccess(true)
    } else {
      alert('حدث خطأ، يرجى المحاولة مجدداً')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-white mb-4">تم استلام طلبك!</h2>
          <p className="text-purple-300 mb-8">سنتواصل معك قريباً على رقم هاتفك</p>
          <a href="/" className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors">
            العودة للمتجر
          </a>
        </div>
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

      <div className="max-w-2xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold text-zinc-900 mb-8 text-center">
          إتمام الطلب
        </h1>

        <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-6">

          {/* بيانات التوصيل */}
          <h2 className="text-xl font-semibold text-zinc-800 border-b pb-3">
            بيانات التوصيل
          </h2>

          <input
            name="customer_name"
            placeholder="الاسم الكامل *"
            value={form.customer_name}
            onChange={handleChange}
            className="border border-zinc-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-purple-500 placeholder:text-zinc-500 text-zinc-900"
          />

          <input
            name="customer_phone"
            placeholder="رقم الهاتف *"
            value={form.customer_phone}
            onChange={handleChange}
            className="border border-zinc-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-purple-500 placeholder:text-zinc-500 text-zinc-900"
          />

          <input
            name="city"
            placeholder="المدينة *"
            value={form.city}
            onChange={handleChange}
            className="border border-zinc-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-purple-500 placeholder:text-zinc-500 text-zinc-900"
          />

          <input
            name="area"
            placeholder="المنطقة/الحي"
            value={form.area}
            onChange={handleChange}
            className="border border-zinc-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-purple-500 placeholder:text-zinc-500 text-zinc-900"
          />

          {/* طريقة الدفع */}
          <h2 className="text-xl font-semibold text-zinc-800 border-b pb-3 mt-2">
            طريقة الدفع
          </h2>

          <div className="flex flex-col gap-3">
            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${form.payment_method === 'cod' ? 'border-purple-500 bg-purple-50' : 'border-zinc-200'}`}>
              <input
                type="radio"
                name="payment_method"
                value="cod"
                checked={form.payment_method === 'cod'}
                onChange={handleChange}
                className="accent-purple-600"
              />
              <span className="text-2xl">💵</span>
              <div>
                <p className="font-medium text-zinc-900">نقداً عند الاستلام</p>
                <p className="text-sm text-zinc-500">الدفع عند استلام البضاعة</p>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${form.payment_method === 'sham_cash' ? 'border-purple-500 bg-purple-50' : 'border-zinc-200'}`}>
              <input
                type="radio"
                name="payment_method"
                value="sham_cash"
                checked={form.payment_method === 'sham_cash'}
                onChange={handleChange}
                className="accent-purple-600"
              />
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-medium text-zinc-900">شام كاش</p>
                <p className="text-sm text-zinc-500">حول المبلغ وارفع صورة الإيصال</p>
              </div>
            </label>
          </div>

          {/* رفع الإيصال لو شام كاش */}
          {form.payment_method === 'sham_cash' && (
            <div className="bg-purple-50 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-purple-800 font-medium">
                📱 رقم شام كاش: <span className="font-bold">09XXXXXXXX</span>
              </p>
              <p className="text-sm text-purple-600">
                بعد التحويل، ارفع صورة الإيصال هنا:
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReceipt(e.target.files[0])}
                className="border border-purple-200 rounded-lg p-2 w-full"
              />
            </div>
          )}

          {/* ملاحظات */}
          <textarea
            name="notes"
            placeholder="ملاحظات إضافية (اختياري)"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="border border-zinc-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:border-purple-500 resize-none placeholder:text-zinc-500 text-zinc-900"
          />

          {/* زر التأكيد */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white py-4 rounded-full text-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'جاري إرسال الطلب...' : '✅ تأكيد الطلب'}
          </button>

        </div>
      </div>

      <footer className="bg-white border-t py-6 px-8 text-center text-zinc-500">
        © 2026 أمل - جميع الحقوق محفوظة
      </footer>
    </div>
  )
}