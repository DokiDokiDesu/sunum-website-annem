import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import { API_BASE_URL } from "../../config/api";

dayjs.locale("tr");

export function ActivityLogs({ token }) {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    action: "",
    resourceType: "",
    adminId: "",
  });

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await fetch(`${API_BASE_URL}/api/logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setLogs(data.logs || data);
    } catch (err) {
      setError("Loglar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logs/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("İstatistikler yüklenemedi:", err);
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "create":
        return "bg-green-600/20 text-green-400";
      case "update":
        return "bg-blue-600/20 text-blue-400";
      case "delete":
        return "bg-red-600/20 text-red-400";
      case "login":
        return "bg-purple-600/20 text-purple-400";
      case "change_password":
      case "reset_password":
        return "bg-yellow-600/20 text-yellow-400";
      case "cancel_schedule":
        return "bg-orange-600/20 text-orange-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  const getActionText = (action) => {
    const actions = {
      create: "Oluştur",
      update: "Güncelle",
      delete: "Sil",
      login: "Giriş",
      logout: "Çıkış",
      change_password: "Şifre Değiştir",
      reset_password: "Şifre Sıfırla",
      schedule: "Planla",
      cancel_schedule: "Planlamayı İptal",
    };
    return actions[action] || action;
  };

  if (loading) return <div className="text-white">Yükleniyor...</div>;

  return (
    <div>
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* İstatistikler */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-1">Toplam Log</div>
            <div className="text-3xl font-bold text-white">
              {stats.totalLogs}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-1">Eylem Türü</div>
            <div className="text-lg font-semibold text-white">
              {stats.actionStats?.length || 0}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-1">Kaynak Türü</div>
            <div className="text-lg font-semibold text-white">
              {stats.resourceStats?.length || 0}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-gray-400 text-sm mb-1">Aktif Admin</div>
            <div className="text-lg font-semibold text-white">
              {stats.adminStats?.length || 0}
            </div>
          </div>
        </div>
      )}

      {/* Filtreler */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Eylem</label>
            <select
              value={filters.action}
              onChange={(e) =>
                setFilters({ ...filters, action: e.target.value, page: 1 })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            >
              <option value="">Tümü</option>
              <option value="create">Oluştur</option>
              <option value="update">Güncelle</option>
              <option value="delete">Sil</option>
              <option value="login">Giriş</option>
              <option value="change_password">Şifre Değiştir</option>
              <option value="cancel_schedule">Planlamayı İptal</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Kaynak Türü
            </label>
            <select
              value={filters.resourceType}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  resourceType: e.target.value,
                  page: 1,
                })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            >
              <option value="">Tümü</option>
              <option value="seminar">Seminer</option>
              <option value="category">Kategori</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Sayfa Boyutu
            </label>
            <select
              value={filters.limit}
              onChange={(e) =>
                setFilters({ ...filters, limit: e.target.value, page: 1 })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </select>
          </div>
        </div>
      </div>

      {/* Log Tablosu */}
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
          <h3 className="text-white font-semibold">Aktivite Logları</h3>
          <p className="text-gray-400 text-sm">
            Tüm admin aktiviteleri kayıt altında
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300">Tarih</th>
                <th className="px-4 py-3 text-left text-gray-300">Admin</th>
                <th className="px-4 py-3 text-left text-gray-300">Eylem</th>
                <th className="px-4 py-3 text-left text-gray-300">
                  Kaynak Türü
                </th>
                <th className="px-4 py-3 text-left text-gray-300">Açıklama</th>
                <th className="px-4 py-3 text-left text-gray-300">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-gray-300 text-sm whitespace-nowrap">
                    {dayjs(log.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </td>
                  <td className="px-4 py-3">
                    {log.adminUsername === "System" ? (
                      <span className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-orange-600/20 text-orange-400 rounded text-xs font-medium">
                          🤖 Sistem
                        </span>
                      </span>
                    ) : (
                      <span className="text-white font-medium">
                        {log.adminUsername}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}
                    >
                      {getActionText(log.action)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {log.resourceType || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-300 max-w-md truncate">
                    {log.description}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">
                    {log.ipAddress || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-400">
            Henüz log kaydı yok
          </div>
        )}
      </div>

      {/* Admin İstatistikleri */}
      {stats?.adminStats && stats.adminStats.length > 0 && (
        <div className="mt-6 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">
            Admin Aktivite İstatistikleri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.adminStats.map((stat) => (
              <div
                key={stat.adminId}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="text-white font-medium">
                  {stat.adminUsername}
                </div>
                <div className="text-2xl font-bold text-blue-400 mt-2">
                  {stat.count}
                </div>
                <div className="text-gray-400 text-sm">toplam işlem</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
