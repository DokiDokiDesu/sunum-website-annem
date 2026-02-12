import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/tr";

dayjs.locale("tr");

export function AdminProfile({ adminProfile, token, onProfileUpdate }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Yeni şifreler eşleşmiyor");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/admins/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Şifre değiştirilemedi");
      }

      setSuccess("Şifre başarıyla değiştirildi");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!adminProfile) {
    return <div className="text-white">Yükleniyor...</div>;
  }

  return (
    <div>
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profil Bilgileri */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-white text-xl font-semibold mb-6">
            Profil Bilgileri
          </h3>

          <div className="space-y-4">
            <div>
              <div className="text-gray-400 text-sm mb-1">Kullanıcı Adı</div>
              <div className="text-white text-lg font-medium">
                {adminProfile.username}
              </div>
            </div>

            <div>
              <div className="text-gray-400 text-sm mb-1">Email</div>
              <div className="text-white text-lg">{adminProfile.email}</div>
            </div>

            {adminProfile.fullName && (
              <div>
                <div className="text-gray-400 text-sm mb-1">Tam Ad</div>
                <div className="text-white text-lg">
                  {adminProfile.fullName}
                </div>
              </div>
            )}

            <div>
              <div className="text-gray-400 text-sm mb-1">Rol</div>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  adminProfile.role === "superadmin"
                    ? "bg-purple-600/20 text-purple-400"
                    : "bg-blue-600/20 text-blue-400"
                }`}
              >
                {adminProfile.role === "superadmin" ? "Super Admin" : "Admin"}
              </span>
            </div>

            <div>
              <div className="text-gray-400 text-sm mb-1">Durum</div>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  adminProfile.isActive
                    ? "bg-green-600/20 text-green-400"
                    : "bg-red-600/20 text-red-400"
                }`}
              >
                {adminProfile.isActive ? "Aktif" : "Pasif"}
              </span>
            </div>

            <div>
              <div className="text-gray-400 text-sm mb-1">Kayıt Tarihi</div>
              <div className="text-white">
                {dayjs(adminProfile.createdAt).format("DD MMMM YYYY, HH:mm")}
              </div>
            </div>

            {adminProfile.lastLogin && (
              <div>
                <div className="text-gray-400 text-sm mb-1">Son Giriş</div>
                <div className="text-white">
                  {dayjs(adminProfile.lastLogin).format("DD MMMM YYYY, HH:mm")}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Şifre Değiştirme */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-white text-xl font-semibold mb-6">Güvenlik</h3>

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold w-full"
            >
              🔒 Şifre Değiştir
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Mevcut Şifre *
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Yeni Şifre *
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  minLength={6}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Yeni Şifre (Tekrar) *
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  minLength={6}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Değiştir
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setError("");
                  }}
                  className="flex-1 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  İptal
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-gray-300 text-sm">
              <strong>Güvenlik İpuçları:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Şifreniz en az 6 karakter olmalıdır</li>
                <li>Güçlü şifre kullanın (harf, rakam, sembol)</li>
                <li>Şifrenizi başkalarıyla paylaşmayın</li>
                <li>Düzenli olarak şifrenizi değiştirin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
