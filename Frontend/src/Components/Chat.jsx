import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import API_URL from "../api";

/* ================= IMAGE RESOLVER ================= */

const resolveImage = (path) => {
    if (!path)
        return "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg";

    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads")) return `${API_URL}${path}`;

    return "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg";
};

/* ================= CHAT LIST ================= */

const ChatList = ({ matches, onSelect }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-145 min-w-90 bg-black text-white overflow-y-auto">
            <div className="flex items-center gap-3 p-4 border-b border-white/20">
                <button className="sm:hidden" onClick={() => navigate("/explore")}>
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <h1 className="text-lg font-bold text-orange-500">Messages</h1>
            </div>

            <div className="p-3 space-y-3">
                {matches.map((m) => (
                    <div
                        key={m._id}
                        onClick={() => onSelect(m)}
                        className="flex gap-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer"
                    >
                        <img
                            src={resolveImage(m.profilePhoto)}
                            className="w-12 h-12 rounded-full object-cover"
                            alt=""
                        />
                        <div>
                            <p className="font-semibold">{m.FName}</p>
                            <p className="text-sm text-white/60">Tap to chat</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ================= CHAT WINDOW ================= */

const ChatWindow = ({
    activeChat,
    messages,
    messageInput,
    setMessageInput,
    onSend,
    onBack,
    userId,
}) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="min-h-145 min-w-90 bg-black text-white flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b border-white/20">
                <button onClick={onBack}>
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <img
                    src={resolveImage(activeChat.profilePhoto)}
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                />
                <p className="font-bold">{activeChat.FName}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`max-w-[75%] px-4 py-2 rounded-xl break-words text-white ${msg.senderId === userId
                            ? "ml-auto bg-orange-600"
                            : "mr-auto bg-white/20"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-white/20 flex gap-2">
                <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSend()}
                    className="flex-1 bg-white/10 px-4 py-2 rounded-full outline-none text-white"
                    placeholder="Type a message"
                />
                <button onClick={onSend} className="bg-orange-600 px-4 rounded-full">
                    <span className="material-symbols-outlined">send</span>
                </button>
            </div>
        </div>
    );
};

/* ================= MAIN CHAT ================= */

const Chat = () => {
    const [user, setUser] = useState(null);
    const [matches, setMatches] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [roomId, setRoomId] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const userId = user?._id ? String(user._id) : null;

    /* ===== AUTH ===== */

    useEffect(() => {
        fetch(`${API_URL}/api/getUserData`, { credentials: "include" })
            .then((res) => {
                if (res.status === 401) {
                    navigate("/", { replace: true });
                    throw new Error("Unauthorized");
                }
                return res.json();
            })
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, [navigate]);

    /* ===== FETCH MATCHES ===== */

    useEffect(() => {
        if (!userId) return;

        fetch(`${API_URL}/api/getUserMatches`, {
            method: "POST",
            credentials: "include",
        })
            .then((r) => r.json())
            .then(setMatches);
    }, [userId]);


    /* ===== JOIN ROOM ===== */

    useEffect(() => {
        if (!activeChat || !userId) return;

        const a = String(userId);
        const b = String(activeChat._id);
        const room = a < b ? `${a}_${b}` : `${b}_${a}`;

        socket.emit("leave_all");

        if (socket.connected) {
            socket.emit("join_room", room);
        } else {
            socket.off("connect");
            socket.once("connect", () => {
                socket.emit("join_room", room);
            });
        }

        setRoomId(room);
        setMessages([]);

        fetch(`${API_URL}/api/getMessages`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomId: room }),
        })
            .then((r) => r.json())
            .then(setMessages);
    }, [activeChat, userId]);

    /* ===== SOCKET RECEIVE ===== */

    useEffect(() => {
        if (!roomId) return;

        const onReceive = (msg) => {
            if (msg.roomId !== roomId) return;

            setMessages((prev) => {
                if (prev.some((m) => m._id === msg._id)) return prev;
                return [...prev, msg];
            });
        };

        socket.on("receive_message", onReceive);
        return () => socket.off("receive_message", onReceive);
    }, [roomId]);

    /* ===== SEND MESSAGE ===== */

    const sendChat = () => {
        if (!messageInput.trim() || !roomId) return;

        socket.emit("send_message", {
            roomId,
            senderId: userId,
            receiverId: activeChat._id,
            text: messageInput,
        });

        setMessages((prev) => [
            ...prev,
            {
                _id: `local-${Date.now()}`,
                roomId,
                senderId: userId,
                text: messageInput,
            },
        ]);

        setMessageInput("");
    };

    if (loading) return null;

    return activeChat ? (
        <ChatWindow
            activeChat={activeChat}
            messages={messages}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            onSend={sendChat}
            onBack={() => setActiveChat(null)}
            userId={userId}
        />
    ) : (
        <ChatList matches={matches} onSelect={setActiveChat} />
    );
};

export default Chat;
