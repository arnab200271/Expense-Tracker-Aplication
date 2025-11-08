"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type Msg = {
  id: number;
  user_id: string | null;
  sender: string;
  message: string;
  created_at: string;
};

const Chatbot = () => {
  let pathname = usePathname();
  const supabase = createClientComponentClient();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<any>(null);
  const suggestions = [
    "Hi",
    "Help",
    "Transaction problem",
    "Slow service",
    "Calculation problem",
    "Thanks",
  ];

  //  const shouldHide = pathname === "/";
  // Scroll helper
  const scrollToBottom = () => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  };
  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userRef.current = user;
    return user;
  };

  // Fetch messages once
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        if (!user) return;
        const { data, error } = await supabase
          .from("support_messages")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) console.error("Supabase Error:", error.message);
        else setMessages(data || []);
        setTimeout(scrollToBottom, 200);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Listen to real-time inserts
    const channel = supabase
      .channel("public:support_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_messages" },
        (payload) => {
          const newMsg = payload.new as Msg;
          setMessages((prev) => [...prev, newMsg]);
          setTimeout(scrollToBottom, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  if (pathname === "/") return null;

  const getAutoReply = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("help")) return "Sure! Tell me what you need help with.";
    if (t.includes("transaction problem"))
      return "😊Thanks for contacting support. We'll check your transaction shortly.";
    if (t.includes("slow service") || t.includes("aplication not running properly") || t.includes("wrong calculation") ||t.includes("aplication not working properly") )
      return "😊 Thanks for submiting your problem. We'll check your issue shortly.";
    if (t.includes("calculation problem"))
      return "Describe your issue, We'll check your issue shortly.";
    if (t.includes("hi") || t.includes(" hello") || t.includes("Hlw") || t.includes("hlw")|| t.includes("Hi")||t.includes("Hello"))
      return "😄Hi there! how can i help you?";
    if (t.includes("thanks")) return "😊Welcome keep support";
    if (t.includes("sourav mondal")) return "😲 Woow i know him coding expert";
    return "Thanks for contacting support. We'll get back to you shortly.";
  };

  // Send message
  const sendMessage = async (customText?: string) => {
    if (!input.trim()) return;
    const msgText = input.trim();
    setInput("");

    // Insert user message immediately in UI
    const newUserMsg: Msg = {
      id: Date.now(),
      user_id: null,
      sender: "user",
      message: msgText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMsg]);
    scrollToBottom();
    // Save in Supabase
    const currentUser = userRef.current;
    await supabase
      .from("support_messages")
      .insert([{ user_id: currentUser?.id, sender: "user", message: msgText }]);

    // Auto reply after 700ms
    setTimeout(async () => {
      const replyText = getAutoReply(msgText);
      const botMsg: Msg = {
        id: Date.now() + 1,
        user_id: null,
        sender: "bot",
        message: replyText,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      scrollToBottom();

      await supabase
        .from("support_messages")
        .insert([
          { user_id: currentUser?.id, sender: "bot", message: replyText },
        ]);
    }, 700);
  };
  const handleSuggestionClick = (text: string) => {
    setInput(text);
    sendMessage(text);
  };
  // Send on Enter
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      <div className="fixed bottom-2 right-6 z-50 flex flex-col items-end gap-3">
        <button
          aria-label="Open chat"
          onClick={() => setOpen((v) => !v)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg transform hover:scale-105 transition"
        >
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 opacity-40 blur-md animate-pulse" />
          <svg
            className="relative w-7 h-7 text-white"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Chatbox */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] md:w-[420px] bg-transparent">
          <div className="flex flex-col h-[480px] rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div>
                  <div className="text-sm font-semibold">Support</div>
                  <div className="text-xs text-gray-300">Arnab Paladhi</div>
                </div>
              </div>
              <button
                className="text-gray-300 hover:text-white"
                onClick={() => setOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div
              ref={boxRef}
              className="flex-1 bg-gray-900 p-4 overflow-y-auto space-y-3 scroll-smooth"
              style={{ maxHeight: "380px" }}
            >
              {loading && (
                <div className="text-center text-sm text-gray-400">
                  Loading...
                </div>
              )}

              {messages.length === 0 && !loading && (
                <div className="text-center flex justify-center items-center h-70 text-gray-400 ">
                  No messages yet. Start the conversation 👋
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`${
                      m.sender === "user"
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-800 text-gray-100"
                    } max-w-[78%] px-4 py-2 rounded-2xl`}
                  >
                    <div className="text-sm">{m.message}</div>
                    <div className="text-xs text-white mt-1 text-right">
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input box fixed at bottom */}

            <div className="px-3 py-3 bg-gray-800 flex gap-2 items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message..."
                className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg outline-none border border-gray-700"
              />
              <button
                onClick={() => sendMessage()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
