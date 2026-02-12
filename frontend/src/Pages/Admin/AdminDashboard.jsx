import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/tr";

dayjs.locale("tr");

export function AdminDashboard() {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("content"); // 'content', 'schedule', 'popular', 'categories'
  const navigate = useNavigate();

  // Category states
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    slug: "",
    showInMenu: true,
    highlight: false,
    order: 0,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    detailedDescription: "",
    topics: "",
    category: "",
    duration: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState(null);

  // Planlama için ayrı state
  const [scheduleData, setScheduleData] = useState({
    instructor: "",
    instructorTitle: "",
    instructorFullName: "",
    date: "",
    startTime: "",
    dayOfWeek: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchSeminars();
    fetchCategories();
  }, [navigate]);

  const fetchSeminars = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/seminars");
      const data = await response.json();
      setSeminars(data);
    } catch (err) {
      setError("Seminerler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Kategoriler yüklenemedi:", err);
    }
  };

  // Kategori slug'ından isim bulma
  const getCategoryName = (slug) => {
    const category = categories.find((cat) => cat.slug === slug);
    return category ? category.name : slug;
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    try {
      const url = editingSeminar
        ? `http://localhost:5000/api/seminars/${editingSeminar.id}`
        : "http://localhost:5000/api/seminars";

      const response = await fetch(url, {
        method: editingSeminar ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("İşlem başarısız");

      await fetchSeminars();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError("Seminer kaydedilemedi");
    }
  };

  const handleEdit = (seminar) => {
    setEditingSeminar(seminar);
    setFormData({
      title: seminar.title,
      description: seminar.description,
      detailedDescription: seminar.detailedDescription || "",
      topics: seminar.topics || "",
      category: seminar.category,
      duration: seminar.duration || "",
      price: seminar.price || "",
    });
    setActiveTab("content");
    setShowForm(true);
  };

  const handleSchedule = (seminar) => {
    setEditingSeminar(seminar);

    // Eski format tarihi (dd/mm/yyyy) yeni formata (YYYY-MM-DD) çevir
    let formattedDate = seminar.date || "";
    if (formattedDate && formattedDate.includes("/")) {
      // dd/mm/yyyy formatını YYYY-MM-DD'ye çevir
      const [day, month, year] = formattedDate.split("/");
      formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    setScheduleData({
      instructor: seminar.instructor || "",
      instructorTitle: seminar.instructorTitle || "",
      instructorFullName: seminar.instructorFullName || "",
      date: formattedDate,
      startTime: seminar.startTime || "",
      dayOfWeek: seminar.dayOfWeek || "",
    });
    setActiveTab("schedule");
    setShowForm(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    try {
      const formDataToSend = new FormData();
      Object.keys(scheduleData).forEach((key) => {
        formDataToSend.append(key, scheduleData[key]);
      });
      formDataToSend.append("isScheduled", true);
      // Planlanan her seminer otomatik olarak "Yakın" etiketini alır
      formDataToSend.append("isUpcoming", true);

      const response = await fetch(
        `http://localhost:5000/api/seminars/${editingSeminar.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        },
      );

      if (!response.ok) throw new Error("İşlem başarısız");

      await fetchSeminars();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError("Planlama kaydedilemedi");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu semineri silmek istediğinizden emin misiniz?")) return;

    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`http://localhost:5000/api/seminars/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Silme başarısız");

      await fetchSeminars();
    } catch (err) {
      setError("Seminer silinemedi");
    }
  };

  const handleCancelSchedule = async (id) => {
    if (
      !confirm(
        "Bu seminerin planlamasını iptal etmek istediğinizden emin misiniz?",
      )
    )
      return;

    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(
        `http://localhost:5000/api/seminars/${id}/cancel-schedule`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Planlama iptal edilemedi");

      await fetchSeminars();
      setError(""); // Hata mesajını temizle
    } catch (err) {
      setError("Planlama iptal edilemedi");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      detailedDescription: "",
      topics: "",
      category: "",
      duration: "",
      price: "",
    });
    setScheduleData({
      instructor: "",
      instructorTitle: "",
      instructorFullName: "",
      date: "",
      startTime: "",
      dayOfWeek: "",
      isPopular: false,
      isUpcoming: false,
    });
    setImageFile(null);
    setEditingSeminar(null);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      slug: "",
      showInMenu: true,
      highlight: false,
      order: 0,
    });
    setEditingCategory(null);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    try {
      const url = editingCategory
        ? `http://localhost:5000/api/categories/${editingCategory.id}`
        : "http://localhost:5000/api/categories";

      const response = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryFormData),
      });

      if (!response.ok) throw new Error("İşlem başarısız");

      await fetchCategories();
      resetCategoryForm();
      setShowForm(false);
    } catch (err) {
      setError("Kategori kaydedilemedi");
    }
  };

  const handleCategoryEdit = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      slug: category.slug,
      showInMenu: category.showInMenu,
      highlight: category.highlight,
      order: category.order,
    });
    setShowForm(true);
  };

  const handleCategoryDelete = async (id) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return;

    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Silme başarısız");

      await fetchCategories();
    } catch (err) {
      setError("Kategori silinemedi");
    }
  };

  const handleCategoryToggle = async (id) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/${id}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("İşlem başarısız");

      await fetchCategories();
    } catch (err) {
      setError("Kategori durumu değiştirilemedi");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Admin Paneli</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Ana Sayfa
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setActiveTab("content");
              setShowForm(false);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "content"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            📝 Seminer İçerikleri
          </button>
          <button
            onClick={() => {
              setActiveTab("schedule");
              setShowForm(false);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "schedule"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            📅 Planlama
          </button>
          <button
            onClick={() => {
              setActiveTab("popular");
              setShowForm(false);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "popular"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            ⭐ Popüler Seminerler
          </button>
          <button
            onClick={() => {
              setActiveTab("categories");
              setShowForm(false);
              resetCategoryForm();
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "categories"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            📊 Kategoriler
          </button>
        </div>

        {/* Add Button */}
        {activeTab === "content" && (
          <div className="mb-6">
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {showForm ? "İptal" : "+ Yeni Seminer İçeriği Ekle"}
            </button>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="mb-6">
            <button
              onClick={() => {
                resetCategoryForm();
                setShowForm(!showForm);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {showForm ? "İptal" : "+ Yeni Kategori Ekle"}
            </button>
          </div>
        )}

        {/* Content Form */}
        {showForm && activeTab === "content" && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
            <h2 className="text-white text-xl font-bold mb-4">
              {editingSeminar
                ? "Seminer İçeriğini Düzenle"
                : "Yeni Seminer İçeriği"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-2">
                  Seminer Başlığı *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                  placeholder="Örn: Antik Dünyanın Yedi Harikası"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-2">
                  Açıklama *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                  placeholder="Seminer hakkında detaylı açıklama..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-2">
                  Detaylı Açıklama (Seminer Hakkında)
                </label>
                <textarea
                  name="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                  placeholder="Seminerin detaylı açıklaması... (Detay sayfasında görüntülenecek)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-2">
                  Seminer Konuları (Özeti)
                </label>
                <textarea
                  name="topics"
                  value={formData.topics}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                  placeholder="Her satıra bir konu yazın. Örnek:
Yedi Harikanın Kültürel Mirası
Harika Kavramının Doğuşu
Kültürel Bellek ve Hafıza"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Kategori *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Kategori seçin...</option>
                  {categories
                    .filter((cat) => cat.isActive)
                    .sort(
                      (a, b) =>
                        a.order - b.order || a.name.localeCompare(b.name),
                    )
                    .map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Süre</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Örn: 2 saat"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Fiyat (₺)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Örn: 100"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Kapak Resmi
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-gray-500 text-xs mt-1">
                  {editingSeminar &&
                    !imageFile &&
                    "Değiştirmek için yeni resim seçin"}
                </p>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  {editingSeminar ? "İçeriği Güncelle" : "İçeriği Kaydet"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Schedule Form */}
        {showForm && activeTab === "schedule" && editingSeminar && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
            <h2 className="text-white text-xl font-bold mb-2">
              Semineri Planla: {editingSeminar.title}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Bu seminere tarih, saat ve eğitmen bilgisi ekleyin
            </p>
            <form
              onSubmit={handleScheduleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Eğitmen Unvanı
                </label>
                <input
                  type="text"
                  name="instructorTitle"
                  value={scheduleData.instructorTitle}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      instructorTitle: e.target.value,
                    })
                  }
                  placeholder="Örn: Prof. Dr."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Eğitmen Adı Soyadı
                </label>
                <input
                  type="text"
                  name="instructorFullName"
                  value={scheduleData.instructorFullName}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      instructorFullName: e.target.value,
                    })
                  }
                  placeholder="Örn: Tuna Şare Ağtürk"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  name="date"
                  value={scheduleData.date}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    let dayName = "";

                    if (selectedDate) {
                      // Tarihi parse et ve gün adını al
                      dayName = dayjs(selectedDate).format("dddd");
                      // İlk harfi büyük yap
                      dayName =
                        dayName.charAt(0).toUpperCase() + dayName.slice(1);
                    }

                    setScheduleData({
                      ...scheduleData,
                      date: selectedDate,
                      dayOfWeek: dayName,
                    });
                  }}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Başlangıç Saati
                </label>
                <input
                  type="text"
                  name="startTime"
                  value={scheduleData.startTime}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      startTime: e.target.value,
                    })
                  }
                  placeholder="20:00"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Gün{" "}
                  <span className="text-xs text-gray-500">
                    (Otomatik hesaplanıyor)
                  </span>
                </label>
                <input
                  type="text"
                  name="dayOfWeek"
                  value={scheduleData.dayOfWeek}
                  readOnly
                  placeholder="Tarih seçildiğinde otomatik hesaplanır"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-gray-400 cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-3 font-semibold">
                  📌 Bilgilendirme
                </label>
                <div className="space-y-3 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-start gap-3 p-3 bg-green-900/20 rounded">
                    <span className="text-2xl">🔜</span>
                    <div>
                      <div className="text-green-400 font-medium">
                        ✅ Otomatik Yaklaşan Etiketi
                      </div>
                      <p className="text-gray-400 text-xs">
                        Bu semineri planladığınızda otomatik olarak "Yaklaşan
                        Seminerler" kategorisine eklenecek
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-700/20 rounded">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <div className="text-gray-300 font-medium">
                        Popüler Etiketi
                      </div>
                      <p className="text-gray-400 text-xs">
                        "Popüler Seminerler" sekmesinden yönetebilirsiniz
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Planlamayı Kaydet
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content List - Seminer İçerikleri */}
        {activeTab === "content" && (
          <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
              <h3 className="text-white font-semibold">Seminer İçerikleri</h3>
              <p className="text-gray-400 text-sm">
                Tüm seminer içeriklerini görüntüle ve düzenle
              </p>
            </div>
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-300">Başlık</th>
                  <th className="px-6 py-3 text-left text-gray-300">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-gray-300">
                    Etiketler
                  </th>
                  <th className="px-6 py-3 text-left text-gray-300">Süre</th>
                  <th className="px-6 py-3 text-left text-gray-300">Fiyat</th>
                  <th className="px-6 py-3 text-left text-gray-300">Durum</th>
                  <th className="px-6 py-3 text-left text-gray-300">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {seminars.map((seminar) => (
                  <tr key={seminar.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-white max-w-xs truncate">
                      {seminar.title}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                        {getCategoryName(seminar.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {seminar.isPopular && (
                          <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs">
                            ⭐
                          </span>
                        )}
                        {seminar.isUpcoming && (
                          <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                            🔜
                          </span>
                        )}
                        {!seminar.isPopular && !seminar.isUpcoming && (
                          <span className="text-gray-500 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {seminar.duration || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {seminar.price ? `${seminar.price} ₺` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      {seminar.isScheduled ? (
                        <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                          ✓ Planlanmış
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs">
                          Planlanmamış
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(seminar)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                        >
                          Düzenle
                        </button>
                        {seminar.isScheduled && (
                          <button
                            onClick={() => handleCancelSchedule(seminar.id)}
                            className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition text-sm"
                          >
                            Planla. İptal
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(seminar.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {seminars.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Henüz seminer içeriği eklenmemiş
              </div>
            )}
          </div>
        )}

        {/* Schedule List - Planlanmış Seminerler */}
        {activeTab === "schedule" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sol Kolon - Planlanmamış İçerikler */}
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
                <h3 className="text-white font-semibold">
                  📋 Planlanmamış İçerikler
                </h3>
                <p className="text-gray-400 text-sm">
                  Tarih ve eğitmen ataması bekleyen seminerler
                </p>
              </div>
              <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                {seminars.filter((s) => !s.isScheduled).length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="mb-2">✅ Tüm içerikler planlandı!</p>
                    <p className="text-sm">
                      Yeni içerik eklemek için "Seminer İçerikleri" sekmesine
                      gidin.
                    </p>
                  </div>
                ) : (
                  seminars
                    .filter((s) => !s.isScheduled)
                    .map((seminar) => (
                      <div
                        key={seminar.id}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-600 transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">
                              {seminar.title}
                            </h4>
                            <div className="flex gap-2 items-center text-xs">
                              <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded">
                                {getCategoryName(seminar.category)}
                              </span>
                              {seminar.duration && (
                                <span className="text-gray-400">
                                  ⏱️ {seminar.duration}
                                </span>
                              )}
                              {seminar.price && (
                                <span className="text-gray-400">
                                  💰 {seminar.price} ₺
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {seminar.description}
                        </p>
                        <button
                          onClick={() => handleSchedule(seminar)}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm font-medium"
                        >
                          📅 Planla
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Sağ Kolon - Planlanmış Seminerler */}
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
                <h3 className="text-white font-semibold">
                  ✅ Planlanmış Seminerler
                </h3>
                <p className="text-gray-400 text-sm">
                  Tarih ve eğitmen ataması yapılmış seminerler
                </p>
              </div>
              <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                {seminars.filter((s) => s.isScheduled).length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="mb-2">📭 Henüz planlanmış seminer yok</p>
                    <p className="text-sm">
                      Sol taraftaki içeriklere tarih ve eğitmen atayın.
                    </p>
                  </div>
                ) : (
                  seminars
                    .filter((s) => s.isScheduled)
                    .map((seminar) => (
                      <div
                        key={seminar.id}
                        className="bg-gray-800 rounded-lg p-4 border border-green-600/30 hover:border-green-600 transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">
                              {seminar.title}
                            </h4>
                            <div className="flex gap-2 items-center text-xs mb-2">
                              <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded">
                                {getCategoryName(seminar.category)}
                              </span>
                              {seminar.isPopular && (
                                <span className="px-2 py-0.5 bg-yellow-600/20 text-yellow-400 rounded">
                                  ⭐ Popüler
                                </span>
                              )}
                              {seminar.isUpcoming && (
                                <span className="px-2 py-0.5 bg-green-600/20 text-green-400 rounded">
                                  🔜 Yaklaşan
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          {seminar.instructor && (
                            <div className="flex items-center text-sm text-gray-300">
                              <span className="text-gray-500 mr-2">👤</span>
                              {seminar.instructor}
                            </div>
                          )}
                          {seminar.date && (
                            <div className="flex items-center text-sm text-gray-300">
                              <span className="text-gray-500 mr-2">📅</span>
                              {seminar.date}{" "}
                              {seminar.dayOfWeek && `(${seminar.dayOfWeek})`}
                            </div>
                          )}
                          {seminar.startTime && (
                            <div className="flex items-center text-sm text-gray-300">
                              <span className="text-gray-500 mr-2">🕐</span>
                              {seminar.startTime}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSchedule(seminar)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
                          >
                            ✏️ Düzenle
                          </button>
                          <button
                            onClick={() => handleCancelSchedule(seminar.id)}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-medium"
                          >
                            ❌ Planlamayı İptal
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Popular Tab */}
        {activeTab === "popular" && (
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                ⭐ Popüler Seminerler Yönetimi
              </h2>
              <p className="text-gray-400">
                Popüler olarak işaretlenen seminerler ana sayfada öne çıkar
              </p>
            </div>

            <div className="grid gap-4">
              {seminars.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Henüz seminer oluşturulmamış
                </p>
              ) : (
                seminars.map((seminar) => (
                  <div
                    key={seminar.id}
                    className={`p-5 rounded-lg border-2 transition ${
                      seminar.isPopular
                        ? "bg-yellow-900/20 border-yellow-600"
                        : "bg-gray-800 border-gray-700"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {seminar.image && (
                        <img
                          src={`http://localhost:5000${seminar.image}`}
                          alt={seminar.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}

                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {seminar.title}
                        </h3>

                        <div className="flex gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400">
                            {getCategoryName(seminar.category)}
                          </span>

                          {seminar.isScheduled && (
                            <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-xs font-medium">
                              ✓ Planlanmış
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          {seminar.instructor && (
                            <span>👤 {seminar.instructor}</span>
                          )}
                          {seminar.date && seminar.dayOfWeek && (
                            <span>
                              📅 {seminar.dayOfWeek},{" "}
                              {new Date(seminar.date).toLocaleDateString(
                                "tr-TR",
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("adminToken");
                            const response = await fetch(
                              `http://localhost:5000/api/seminars/${seminar.id}`,
                              {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                  isPopular: !seminar.isPopular,
                                }),
                              },
                            );

                            if (response.ok) {
                              fetchSeminars();
                            }
                          } catch (err) {
                            console.error(
                              "Popüler durumu güncellenemedi:",
                              err,
                            );
                          }
                        }}
                        className={`px-6 py-3 rounded-lg font-medium transition ${
                          seminar.isPopular
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-yellow-600 text-white hover:bg-yellow-700"
                        }`}
                      >
                        {seminar.isPopular
                          ? "❌ Popülerden Çıkar"
                          : "⭐ Popüler Yap"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            {/* Category Form */}
            {showForm && (
              <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
                <h2 className="text-white text-xl font-bold mb-4">
                  {editingCategory ? "Kategori Düzenle" : "Yeni Kategori"}
                </h2>
                <form
                  onSubmit={handleCategorySubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Kategori Adı *
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.name}
                      onChange={(e) =>
                        setCategoryFormData({
                          ...categoryFormData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                      placeholder="Örn: Teknoloji"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Slug (URL) *
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.slug}
                      onChange={(e) =>
                        setCategoryFormData({
                          ...categoryFormData,
                          slug: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                      placeholder="Örn: teknoloji"
                      required
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      Küçük harf, tire kullanın. Örn: kisisel-gelisim
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Sıralama
                    </label>
                    <input
                      type="number"
                      value={categoryFormData.order}
                      onChange={(e) =>
                        setCategoryFormData({
                          ...categoryFormData,
                          order: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex gap-6">
                      <label className="flex items-center text-gray-300">
                        <input
                          type="checkbox"
                          checked={categoryFormData.showInMenu}
                          onChange={(e) =>
                            setCategoryFormData({
                              ...categoryFormData,
                              showInMenu: e.target.checked,
                            })
                          }
                          className="mr-2"
                        />
                        Header Menüsünde Göster (Keşfet)
                      </label>

                      <label className="flex items-center text-gray-300">
                        <input
                          type="checkbox"
                          checked={categoryFormData.highlight}
                          onChange={(e) =>
                            setCategoryFormData({
                              ...categoryFormData,
                              highlight: e.target.checked,
                            })
                          }
                          className="mr-2"
                        />
                        Vurgula (Kırmızı)
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      {editingCategory ? "Güncelle" : "Kaydet"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Categories List */}
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
                <h3 className="text-white font-semibold">📊 Tüm Kategoriler</h3>
                <p className="text-gray-400 text-sm">
                  Header menüsü ve filtrelerde kullanılan içerik kategorilerini
                  yönetin
                </p>
              </div>
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-300">Ad</th>
                    <th className="px-6 py-3 text-left text-gray-300">Slug</th>
                    <th className="px-6 py-3 text-left text-gray-300">
                      Header Menüsü
                    </th>
                    <th className="px-6 py-3 text-left text-gray-300">Sıra</th>
                    <th className="px-6 py-3 text-left text-gray-300">Durum</th>
                    <th className="px-6 py-3 text-left text-gray-300">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${
                            category.highlight ? "text-red-400" : "text-white"
                          }`}
                        >
                          {category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                        {category.slug}
                      </td>
                      <td className="px-6 py-4">
                        {category.showInMenu ? (
                          <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                            ✓ Görünür
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs">
                            × Gizli
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {category.order}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleCategoryToggle(category.id)}
                          className={`px-2 py-1 rounded text-xs ${
                            category.isActive
                              ? "bg-green-600/20 text-green-400"
                              : "bg-gray-600/20 text-gray-400"
                          }`}
                        >
                          {category.isActive ? "✓ Aktif" : "✗ Pasif"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCategoryEdit(category)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleCategoryDelete(category.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {categories.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  Henüz kategori eklenmemiş
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
