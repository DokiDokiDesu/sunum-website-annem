import { useState } from "react";

export function Voting() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const topics = [
    {
      id: 1,
      title: "Blockchain ve Kripto Para",
      description:
        "Dijital para sistemleri ve blockchain teknolojisinin geleceği",
    },
    {
      id: 2,
      title: "Sürdürülebilir Yaşam",
      description:
        "Çevre dostu yaşam tarzı ve karbon ayak izi azaltma yöntemleri",
    },
    {
      id: 3,
      title: "Yapay Zeka Etiği",
      description: "AI'ın toplum üzerindeki etkileri ve etik sınırları",
    },
    {
      id: 4,
      title: "Uzay Turizmi",
      description: "Uzay yolculuğunun geleceği ve ticari uzay sektörü",
    },
  ];

  const handleVote = () => {
    if (selectedTopic !== null) {
      setHasVoted(true);
      // Burada backend'e veri gönderilebilir
      console.log("Oy verildi:", topics[selectedTopic].title);
    }
  };

  return (
    <div className="py-10 px-8 w-full bg-gradient-to-b from-transparent to-neutral-900/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-3">
            Bir Sonraki Konuyu Sen Seç!
          </h2>
          <p className="text-gray-400 text-base">
            Gelecek seminerlerde görmek isteğiniz konuyu oylayın.
          </p>
        </div>

        {!hasVoted ? (
          <>
            {/* Voting Grid */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {topics.map((topic, index) => (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(index)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedTopic === index
                      ? "bg-red-500 scale-105 shadow-xl shadow-red-500/50"
                      : "bg-neutral-800 hover:bg-neutral-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white font-bold text-xl flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {topic.description}
                      </p>
                    </div>
                    {selectedTopic === index && (
                      <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                        <span className="text-red-500 font-bold text-xl">
                          ✓
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Vote Button */}
            <div className="flex justify-center">
              <button
                onClick={handleVote}
                disabled={selectedTopic === null}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                  selectedTopic !== null
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                Oyumu Gönder
              </button>
            </div>
          </>
        ) : (
          // Success Message
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-green-500/20 rounded-full mb-6">
              <span className="text-7xl">✓</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Oyunuz Alındı!
            </h3>
            <p className="text-gray-400 text-lg mb-4">
              "{topics[selectedTopic].title}" konusuna oy verdiniz.
            </p>
            <p className="text-gray-500">
              Geri bildiriminiz için teşekkür ederiz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
