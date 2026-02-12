import { useState, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  ChartBarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export function VotingManagement() {
  const [topics, setTopics] = useState([
    { position: 1, title: "", description: "", voteCount: 0 },
    { position: 2, title: "", description: "", voteCount: 0 },
    { position: 3, title: "", description: "", voteCount: 0 },
    { position: 4, title: "", description: "", voteCount: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://localhost:5000/api/voting/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        setError(
          `API Hatası (${response.status}): ${errorData.error || response.statusText}`,
        );
        return;
      }

      const data = await response.json();

      // Mevcut konuları pozisyonlara göre yerleştir
      const initialTopics = [
        { position: 1, title: "", description: "", voteCount: 0 },
        { position: 2, title: "", description: "", voteCount: 0 },
        { position: 3, title: "", description: "", voteCount: 0 },
        { position: 4, title: "", description: "", voteCount: 0 },
      ];

      data.forEach((topic) => {
        if (topic.position >= 1 && topic.position <= 4) {
          initialTopics[topic.position - 1] = {
            id: topic.id,
            position: topic.position,
            title: topic.title,
            description: topic.description || "",
            voteCount: topic.voteCount || 0,
          };
        }
      });

      setTopics(initialTopics);
    } catch (err) {
      console.error("Konular yüklenemedi:", err);
      setError(`Konular yüklenemedi: ${err.message}`);
    }
  };

  const handleInputChange = (position, field, value) => {
    setTopics((prevTopics) =>
      prevTopics.map((topic) =>
        topic.position === position ? { ...topic, [field]: value } : topic,
      ),
    );
  };

  const handleSave = async (position) => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const topic = topics.find((t) => t.position === position);

      if (!topic.title.trim()) {
        setError(`Pozisyon ${position} için başlık giriniz`);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/voting/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: topic.id,
          title: topic.title,
          description: topic.description,
          position: topic.position,
        }),
      });

      if (!response.ok) {
        throw new Error("Konu kaydedilemedi");
      }

      setSuccessMessage(`Pozisyon ${position} başarıyla kaydedildi`);
      await fetchTopics();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Kayıt hatası:", err);
      setError("Konu kaydedilirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (position) => {
    const topic = topics.find((t) => t.position === position);

    if (!topic.id) {
      // Henüz kaydedilmemiş, sadece temizle
      handleInputChange(position, "title", "");
      handleInputChange(position, "description", "");
      return;
    }

    if (
      !confirm(
        `Pozisyon ${position}'deki konuyu silmek istediğinizden emin misiniz?`,
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/voting/admin/${topic.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Konu silinemedi");
      }

      setSuccessMessage(`Pozisyon ${position} başarıyla silindi`);
      await fetchTopics();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Silme hatası:", err);
      setError("Konu silinirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleResetVotes = async () => {
    if (
      !confirm(
        "Tüm oyları sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.",
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://localhost:5000/api/voting/admin/reset-votes",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Oylar sıfırlanamadı");
      }

      setSuccessMessage("Tüm oylar başarıyla sıfırlandı");
      await fetchTopics();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Sıfırlama hatası:", err);
      setError("Oylar sıfırlanırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Oylama Yönetimi</h2>
          <p className="text-gray-400 mt-1">
            Ana sayfada gösterilecek 4 oylama konusunu yönetin
          </p>
        </div>
        <button
          onClick={handleResetVotes}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Oyları Sıfırla
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Topics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {topics.map((topic) => (
          <div
            key={topic.position}
            className="bg-neutral-800 rounded-lg p-6 space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  {topic.position}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Pozisyon {topic.position}
                  </h3>
                  {topic.id && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <ChartBarIcon className="w-4 h-4" />
                      <span>{topic.voteCount} oy</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(topic.position)}
                disabled={loading}
                className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                title="Sil"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={topic.title}
                  onChange={(e) =>
                    handleInputChange(topic.position, "title", e.target.value)
                  }
                  placeholder="Örn: Yapay Zeka ve Etik"
                  className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={topic.description}
                  onChange={(e) =>
                    handleInputChange(
                      topic.position,
                      "description",
                      e.target.value,
                    )
                  }
                  placeholder="Kısa bir açıklama ekleyin..."
                  rows={3}
                  className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none resize-none"
                  disabled={loading}
                />
              </div>

              <button
                onClick={() => handleSave(topic.position)}
                disabled={loading || !topic.title.trim()}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">💡 Bilgi</h4>
        <ul className="text-blue-300 text-sm space-y-1 list-disc list-inside">
          <li>Her pozisyon için bir konu başlığı girin</li>
          <li>
            Konular ana sayfada ziyaretçilerin oy vermesi için görüntülenecek
          </li>
          <li>
            Oy sayılarını takip edebilir ve dilediğiniz zaman
            sıfırlayabilirsiniz
          </li>
          <li>
            Konuları dilediğiniz zaman güncelleyebilir veya silebilirsiniz
          </li>
        </ul>
      </div>
    </div>
  );
}
