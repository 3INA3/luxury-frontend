'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Search, Lock, Package, RefreshCw, Plus, Trash2, X, Upload,
  Percent, Star, Sparkles, ImagePlus, Minus
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const ADMIN_PASS_KEY = 'luxery_admin_pass';

const CATEGORIES = [
  { id: 'men', name: 'آقایان' },
  { id: 'women', name: 'خانم‌ها' },
  { id: 'kids', name: 'بچه‌گانه' },
  { id: 'watches', name: 'ساعت' },
  { id: 'perfumes', name: 'عطر' },
  { id: 'accessories', name: 'اکسسوری' },
];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'discounts' | 'new' | 'featured' | 'categories'>('all');
  const [editData, setEditData] = useState<Record<number, any>>({});
  const [uploadingId, setUploadingId] = useState<number | string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nameFa: '',
    nameEn: '',
    category: 'men',
    price: 0,
    discount: 0,
    stock: 10,
  });

  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_PASS_KEY);
    if (saved) {
      setPassword(saved);
      setIsAuth(true);
    }
  }, []);

  useEffect(() => {
    if (isAuth) loadData();
  }, [isAuth]);

  useEffect(() => {
    let list = [...products];
    if (activeTab === 'discounts') list = list.filter((p) => p.weeklyDiscount || p.discount > 0);
    if (activeTab === 'new') list = list.filter((p) => p.newArrival);
    if (activeTab === 'featured') list = list.filter((p) => p.featured);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.nameFa?.includes(search) ||
          p.nameEn?.toLowerCase().includes(q) ||
          String(p.id).includes(q) ||
          p.categoryName?.includes(search)
      );
    }
    setFiltered(list);
  }, [search, products, activeTab]);

  const getPass = () => password || localStorage.getItem(ADMIN_PASS_KEY) || '';

  const login = () => {
    if (password === 'admin123') {
      localStorage.setItem(ADMIN_PASS_KEY, password);
      setIsAuth(true);
      setMessage('');
    } else {
      setMessage('رمز اشتباه است');
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_PASS_KEY);
    setIsAuth(false);
    setPassword('');
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API}/api/admin/products`, {
          headers: { 'x-admin-password': getPass() },
        }).then((r) => r.json()),
        fetch(`${API}/api/categories`).then((r) => r.json()),
      ]);
      setProducts(Array.isArray(prodRes) ? prodRes : []);
      setCategories(Array.isArray(catRes) ? catRes : []);

      const map: Record<number, any> = {};
      (Array.isArray(prodRes) ? prodRes : []).forEach((p: any) => {
        map[p.id] = {
          nameFa: p.nameFa,
          price: p.price,
          discount: p.discount || 0,
          stock: p.stock,
        };
      });
      setEditData(map);
    } catch {
      setMessage('خطا در اتصال به سرور. بک‌اند را چک کن.');
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2500);
  };

  // تغییر وضعیت محصول (تخفیف / جدید / ویژه)
  const toggleFlag = async (id: number, field: 'weeklyDiscount' | 'newArrival' | 'featured', value: boolean) => {
    try {
      const body: any = { [field]: value };
      // اگر وارد تخفیف می‌شود و درصد صفر است، یک درصد پیش‌فرض بگذار
      if (field === 'weeklyDiscount' && value) {
        const p = products.find((x) => x.id === id);
        if (p && (!p.discount || p.discount === 0)) body.discount = 20;
      }
      if (field === 'weeklyDiscount' && !value) {
        body.discount = 0;
      }

      await fetch(`${API}/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': getPass(),
        },
        body: JSON.stringify(body),
      });
      await loadData();
      showMsg(value ? 'اضافه شد ✓' : 'حذف شد');
    } catch {
      showMsg('خطا در تغییر وضعیت');
    }
  };

  const saveProduct = async (id: number) => {
    try {
      await fetch(`${API}/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': getPass(),
        },
        body: JSON.stringify(editData[id]),
      });
      await loadData();
      showMsg(`محصول #${id} ذخیره شد`);
    } catch {
      showMsg('خطا در ذخیره');
    }
  };

  const deleteProduct = async (id: number, name: string) => {
    if (!confirm(`حذف «${name}»؟`)) return;
    try {
      await fetch(`${API}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': getPass() },
      });
      await loadData();
      showMsg('محصول حذف شد');
    } catch {
      showMsg('خطا در حذف');
    }
  };

  const uploadImage = async (id: number | string, file: File, type: 'product' | 'category' = 'product') => {
    if (!file || !file.type.startsWith('image/')) {
      showMsg('فقط فایل تصویری مجاز است');
      return;
    }
    setUploadingId(id);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'main');

      const url =
        type === 'product'
          ? `${API}/api/admin/products/${id}/image`
          : `${API}/api/admin/categories/${id}/image`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'x-admin-password': getPass() },
        body: formData,
      });
      if (!res.ok) throw new Error('upload failed');
      await loadData();
      showMsg('عکس با موفقیت آپلود شد ✓');
    } catch {
      showMsg('خطا در آپلود عکس (ممکن است API مربوطه در بک‌اند نباشد)');
    } finally {
      setUploadingId(null);
    }
  };

  const addProduct = async () => {
    if (!newProduct.nameFa.trim()) {
      showMsg('نام محصول را وارد کنید');
      return;
    }
    try {
      const cat = CATEGORIES.find((c) => c.id === newProduct.category);
      await fetch(`${API}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': getPass(),
        },
        body: JSON.stringify({
          ...newProduct,
          categoryName: cat?.name || 'آقایان',
          newArrival: true,
        }),
      });
      setShowAddForm(false);
      setNewProduct({ nameFa: '', nameEn: '', category: 'men', price: 0, discount: 0, stock: 10 });
      await loadData();
      showMsg('محصول جدید اضافه شد');
    } catch {
      showMsg('خطا در افزودن محصول');
    }
  };

  const updateField = (id: number, field: string, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // ========== صفحه ورود ==========
  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-luxury-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-8 w-full max-w-md border border-gold/20"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center">
              <Lock className="text-black" size={28} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gold mb-2">پنل مدیریت لوکسری</h1>
          <p className="text-center text-gray-400 text-sm mb-6">رمز عبور ادمین را وارد کنید</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            placeholder="رمز عبور"
            className="w-full input-glass px-4 py-3 mb-4 text-center"
            autoFocus
          />
          {message && <p className="text-red-400 text-sm text-center mb-3">{message}</p>}
          <button onClick={login} className="w-full py-3 bg-gold-gradient text-black font-semibold rounded-xl">
            ورود به پنل
          </button>
          <p className="text-center text-xs text-gray-500 mt-4">
            رمز پیش‌فرض: <code className="text-gold">admin123</code>
          </p>
        </motion.div>
      </div>
    );
  }

  // ========== پنل اصلی ==========
  return (
    <div className="min-h-screen bg-luxury-black text-gray-100 pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* هدر */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gold flex items-center gap-2">
              <Package size={26} />
              پنل مدیریت لوکسری
            </h1>
            <p className="text-gray-400 text-sm mt-1">{products.length} محصول</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gold-gradient text-black font-semibold rounded-xl text-sm"
            >
              <Plus size={16} /> افزودن محصول
            </button>
            <button onClick={loadData} className="px-4 py-2 glass rounded-xl text-sm flex items-center gap-2">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> بروزرسانی
            </button>
            <button onClick={logout} className="px-4 py-2 border border-white/20 rounded-xl text-sm">
              خروج
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/20 text-green-300 text-sm text-center">
            {message}
          </div>
        )}

        {/* تب‌ها */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'all', label: 'همه محصولات', icon: Package },
            { id: 'discounts', label: 'تخفیف‌های هفته', icon: Percent },
            { id: 'new', label: 'محصولات جدید', icon: Sparkles },
            { id: 'featured', label: 'ویژه', icon: Star },
            { id: 'categories', label: 'دسته‌بندی‌ها', icon: ImagePlus },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === tab.id ? 'bg-gold text-black' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* فرم افزودن محصول */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass-strong rounded-2xl p-6 border border-gold/20">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-gold">افزودن محصول جدید</h2>
                  <button onClick={() => setShowAddForm(false)}><X size={20} /></button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    value={newProduct.nameFa}
                    onChange={(e) => setNewProduct({ ...newProduct, nameFa: e.target.value })}
                    placeholder="نام فارسی *"
                    className="input-glass px-3 py-2 text-sm"
                  />
                  <input
                    value={newProduct.nameEn}
                    onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })}
                    placeholder="نام انگلیسی"
                    className="input-glass px-3 py-2 text-sm"
                    dir="ltr"
                  />
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="input-glass px-3 py-2 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    placeholder="قیمت"
                    className="input-glass px-3 py-2 text-sm"
                    dir="ltr"
                  />
                  <input
                    type="number"
                    value={newProduct.discount}
                    onChange={(e) => setNewProduct({ ...newProduct, discount: Number(e.target.value) })}
                    placeholder="تخفیف ٪"
                    className="input-glass px-3 py-2 text-sm"
                    dir="ltr"
                  />
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    placeholder="موجودی"
                    className="input-glass px-3 py-2 text-sm"
                    dir="ltr"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={addProduct} className="px-6 py-2.5 bg-gold-gradient text-black font-semibold rounded-xl text-sm">
                    افزودن
                  </button>
                  <button onClick={() => setShowAddForm(false)} className="px-4 py-2.5 border border-white/20 rounded-xl text-sm">
                    انصراف
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* جستجو (اختیاری) */}
        {activeTab !== 'categories' && (
          <div className="relative mb-6">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو بین محصولات نمایش‌داده‌شده (اختیاری)..."
              className="w-full input-glass px-5 py-3 pr-12 text-sm"
            />
          </div>
        )}

        {/* راهنما */}
        {activeTab !== 'categories' && (
          <div className="glass rounded-xl p-4 mb-6 text-sm text-gray-300">
            <p className="font-medium text-gold mb-1">چطور کار می‌کند؟</p>
            <p>
              • دکمه <span className="text-green-400 font-bold">＋</span> → اضافه کردن به این بخش<br />
              • دکمه <span className="text-red-400 font-bold">−</span> → حذف از این بخش<br />
              • روی عکس کلیک کن یا فایل را بکش و رها کن تا عکس آپلود شود
            </p>
          </div>
        )}

        {/* لیست محصولات */}
        {activeTab !== 'categories' && (
          loading ? (
            <p className="text-center text-gray-400 py-16">در حال بارگذاری...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-16">محصولی در این بخش نیست</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((p) => {
                const inDiscount = p.weeklyDiscount || (p.discount > 0 && activeTab === 'discounts');
                const inNew = !!p.newArrival;
                const inFeatured = !!p.featured;

                return (
                  <div key={p.id} className="glass-strong rounded-2xl p-4 border border-white/5">
                    <div className="flex flex-wrap items-center gap-4">
                      {/* عکس + آپلود */}
                      <div className="relative group shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10">
                          {p.mainImage ? (
                            <img
                              src={p.mainImage.startsWith('http') ? p.mainImage : `http://localhost:3000${p.mainImage.split('?')[0]}`}
                              alt={p.nameFa}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholders/product.jpg'; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <ImagePlus size={22} />
                            </div>
                          )}
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center rounded-xl cursor-pointer bg-black/0 group-hover:bg-black/55 transition">
                          {uploadingId === p.id ? (
                            <RefreshCw size={18} className="text-gold animate-spin" />
                          ) : (
                            <Upload size={18} className="text-white opacity-0 group-hover:opacity-100" />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && uploadImage(p.id, e.target.files[0], 'product')}
                          />
                        </label>
                      </div>

                      {/* اطلاعات */}
                      <div className="min-w-[140px] flex-1">
                        <span className="text-xs text-gray-500">#{p.id}</span>
                        <p className="font-medium text-sm line-clamp-1">{p.nameFa}</p>
                        <p className="text-xs text-gray-500">{p.categoryName}</p>
                      </div>

                      {/* فیلدهای ویرایش */}
                      <div className="flex flex-wrap gap-2 items-center">
                        <input
                          type="number"
                          value={editData[p.id]?.price ?? p.price}
                          onChange={(e) => updateField(p.id, 'price', Number(e.target.value))}
                          className="w-24 input-glass px-2 py-1.5 text-sm"
                          dir="ltr"
                          title="قیمت"
                        />
                        <input
                          type="number"
                          value={editData[p.id]?.discount ?? p.discount}
                          onChange={(e) => updateField(p.id, 'discount', Number(e.target.value))}
                          className="w-16 input-glass px-2 py-1.5 text-sm"
                          dir="ltr"
                          title="تخفیف ٪"
                        />
                        <input
                          type="number"
                          value={editData[p.id]?.stock ?? p.stock}
                          onChange={(e) => updateField(p.id, 'stock', Number(e.target.value))}
                          className="w-16 input-glass px-2 py-1.5 text-sm"
                          dir="ltr"
                          title="موجودی"
                        />
                        <button
                          onClick={() => saveProduct(p.id)}
                          className="px-3 py-1.5 bg-gold-gradient text-black text-xs font-semibold rounded-lg"
                        >
                          <Save size={14} />
                        </button>
                      </div>

                      {/* دکمه‌های ＋ / − */}
                      <div className="flex flex-wrap gap-1.5">
                        {/* تخفیف هفته */}
                        <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5">
                          <button
                            onClick={() => toggleFlag(p.id, 'weeklyDiscount', true)}
                            className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${inDiscount ? 'bg-green-500/30 text-green-400' : 'hover:bg-white/10 text-gray-400'}`}
                            title="اضافه به تخفیف هفته"
                          >
                            <Plus size={16} />
                          </button>
                          <span className="text-[10px] text-gray-500 px-1">تخفیف</span>
                          <button
                            onClick={() => toggleFlag(p.id, 'weeklyDiscount', false)}
                            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                            title="حذف از تخفیف هفته"
                          >
                            <Minus size={16} />
                          </button>
                        </div>

                        {/* جدید */}
                        <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5">
                          <button
                            onClick={() => toggleFlag(p.id, 'newArrival', true)}
                            className={`w-8 h-8 rounded-md flex items-center justify-center ${inNew ? 'bg-blue-500/30 text-blue-400' : 'hover:bg-white/10 text-gray-400'}`}
                            title="اضافه به جدیدها"
                          >
                            <Plus size={16} />
                          </button>
                          <span className="text-[10px] text-gray-500 px-1">جدید</span>
                          <button
                            onClick={() => toggleFlag(p.id, 'newArrival', false)}
                            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                            title="حذف از جدیدها"
                          >
                            <Minus size={16} />
                          </button>
                        </div>

                        {/* ویژه */}
                        <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5">
                          <button
                            onClick={() => toggleFlag(p.id, 'featured', true)}
                            className={`w-8 h-8 rounded-md flex items-center justify-center ${inFeatured ? 'bg-yellow-500/30 text-yellow-400' : 'hover:bg-white/10 text-gray-400'}`}
                            title="اضافه به ویژه"
                          >
                            <Plus size={16} />
                          </button>
                          <span className="text-[10px] text-gray-500 px-1">ویژه</span>
                          <button
                            onClick={() => toggleFlag(p.id, 'featured', false)}
                            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                            title="حذف از ویژه"
                          >
                            <Minus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => deleteProduct(p.id, p.nameFa)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/15 text-red-400 hover:bg-red-500/30"
                          title="حذف کامل محصول"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* تب دسته‌بندی‌ها */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 mb-2">روی عکس هر دسته کلیک کن تا عکس جدید آپلود شود</p>
            {categories.map((cat) => (
              <div key={cat.id || cat.slug} className="glass-strong rounded-2xl p-5 flex flex-wrap items-center gap-4">
                <div className="relative group w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                  {cat.cardImage || cat.heroImage ? (
                    <img
                      src={`http://localhost:3000${(cat.cardImage || cat.heroImage).split('?')[0]}`}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <ImagePlus size={24} />
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/0 group-hover:bg-black/55 transition">
                    {uploadingId === (cat.id || cat.slug) ? (
                      <RefreshCw size={18} className="text-gold animate-spin" />
                    ) : (
                      <Upload size={18} className="text-white opacity-0 group-hover:opacity-100" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        uploadImage(cat.id || cat.slug, e.target.files[0], 'category')
                      }
                    />
                  </label>
                </div>
                <div>
                  <p className="font-medium text-lg">{cat.name}</p>
                  <p className="text-xs text-gray-500">{cat.slug}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}