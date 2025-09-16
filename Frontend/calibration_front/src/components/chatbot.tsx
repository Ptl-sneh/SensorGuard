import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageCircle } from "lucide-react";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(input);
      const reply = result.response.text() || "⚠️ No response";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Gemini error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ An error occurred while fetching reply." },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 flex justify-between items-center">
            <span className="font-semibold text-sm">💬 AI Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs hover:opacity-70 transition"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[75%] leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white ml-auto rounded-br-none"
                    : "bg-gray-200 text-gray-900 mr-auto rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 text-xs animate-pulse">🤔 Thinking...</div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex bg-white">
            <input
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 shadow-sm"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-full hover:opacity-90 transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
