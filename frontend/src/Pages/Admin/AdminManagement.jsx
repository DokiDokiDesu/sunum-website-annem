import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/tr";

dayjs.locale("tr");

export function AdminManagement({ token }) {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    role: "admin",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      setError("Adminler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingAdmin
        ? `http://localhost:5000/api/admins/${editingAdmin.id}`
        : "http://localhost:5000/api/admins";

      const method = editingAdmin ? "PUT" : "POST";

      const payload = editingAdmin
        ? {
            username: formData.username,
            email: formData.email,
            fullName: formData.fullName,
            role: formData.role,
            isActive: formData.isActive,
          }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "İşlem başarısız");
      }

      await fetchAdmins();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu admini silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admins/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Silme başarısız");
      }

      await fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt("Yeni şifre:");
    if (!newPassword) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admins/${id}/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Şifre sıfırlama başarısız");
      }

      alert("Şifre başarıyla sıfırlandı");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      password: "",
      email: admin.email,
      fullName: admin.fullName || "",
      role: admin.role,
      isActive: admin.isActive,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingAdmin(null);
    setFormData({
      username: "",
      password: "",
      email: "",
      fullName: "",
      role: "admin",
    });
  };

  if (loading) return <div className="text-white">Yükleniyor...</div>;

  return (
    <div>
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          {showForm ? "İptal" : "+ Yeni Admin Ekle"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800">
          <h3 className="text-white text-xl font-semibold mb-4">
            {editingAdmin ? "Admin Düzenle" : "Yeni Admin"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Kullanıcı Adı *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              {!editingAdmin && (
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Şifre *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    minLength={6}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Tam Ad
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Rol *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              {editingAdmin && (
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-gray-300">Aktif</span>
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                {editingAdmin ? "Güncelle" : "Oluştur"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
          <h3 className="text-white font-semibold">Tüm Adminler</h3>
          <p className="text-gray-400 text-sm">
            Toplam {admins.length} admin kayıtlı
          </p>
        </div>

        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-gray-300">
                Kullanıcı Adı
              </th>
              <th className="px-6 py-3 text-left text-gray-300">Email</th>
              <th className="px-6 py-3 text-left text-gray-300">Tam Ad</th>
              <th className="px-6 py-3 text-left text-gray-300">Rol</th>
              <th className="px-6 py-3 text-left text-gray-300">Durum</th>
              <th className="px-6 py-3 text-left text-gray-300">Son Giriş</th>
              <th className="px-6 py-3 text-left text-gray-300">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-800/50">
                <td className="px-6 py-4 text-white">{admin.username}</td>
                <td className="px-6 py-4 text-gray-300">{admin.email}</td>
                <td className="px-6 py-4 text-gray-300">
                  {admin.fullName || "-"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      admin.role === "superadmin"
                        ? "bg-purple-600/20 text-purple-400"
                        : "bg-blue-600/20 text-blue-400"
                    }`}
                  >
                    {admin.role === "superadmin" ? "Super Admin" : "Admin"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      admin.isActive
                        ? "bg-green-600/20 text-green-400"
                        : "bg-red-600/20 text-red-400"
                    }`}
                  >
                    {admin.isActive ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm">
                  {admin.lastLogin
                    ? dayjs(admin.lastLogin).format("DD/MM/YYYY HH:mm")
                    : "Hiç giriş yapmadı"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleResetPassword(admin.id)}
                      className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition text-sm"
                    >
                      Şifre Sıfırla
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
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

        {admins.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-400">
            Henüz admin eklenmemiş
          </div>
        )}
      </div>
    </div>
  );
}
