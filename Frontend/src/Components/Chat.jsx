import React, { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

/* =========================
   CHAT LIST
========================= */

const ChatList = ({ matches, onSelect }) => {
    const navigate = useNavigate();

    return (
        <div className="h-full sm:h-145 sm:w-95 overflow-y-auto">
            <div className="flex items-center gap-3 p-4 border-b border-white/20">
                <button className="sm:hidden" onClick={() => navigate("/explore")}>
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>

                <h1 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                    Messages
                </h1>
            </div>

            <div className="p-3 space-y-3">
                {matches.map((m) => (
                    <div
                        key={m._id}
                        onClick={() => onSelect(m)}
                        className="flex gap-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer"
                    >
                        <img src={m.profilePhoto} className="w-12 h-12 rounded-full" />
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

/* =========================
   CHAT WINDOW
========================= */

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
        <div className="h-full sm:h-145 sm:w-95 flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b border-white/20">
                <button onClick={onBack}>
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <img src={activeChat.profilePhoto} className="w-10 h-10 rounded-full" />
                <p className="font-bold">{activeChat.FName}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`max-w-[75%] px-3 py-2 rounded-lg ${msg.senderId === userId
                            ? "ml-auto bg-orange-600"
                            : "mr-auto bg-white/10"
                            }`}
                    >
                        {msg.message}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-white/20 flex gap-2">
                <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSend()}
                    className="flex-1 bg-white/10 px-3 py-2 rounded-lg"
                    placeholder="Type a message…"
                />
                <button onClick={onSend}>
                    <span className="material-symbols-outlined">send</span>
                </button>
            </div>
        </div>
    );
};

/* =========================
   MAIN CHAT
========================= */

const Chat = () => {
    const [matches, setMatches] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [roomId, setRoomId] = useState(null);

    const { id: userId } = jwtDecode(localStorage.getItem("token"));

    /* SOCKET */
    useEffect(() => {
        socket.connect();
        socket.on("receive_message", (msg) =>
            setMessages((prev) => [...prev, msg])
        );

        return () => socket.disconnect();
    }, []);

    /* FETCH MATCHES */
    useEffect(() => {
        fetch("http://localhost:3000/api/getUserMatches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        })
            .then((r) => r.json())
            .then(setMatches);
    }, [userId]);

    /* JOIN ROOM + LOAD HISTORY */
    useEffect(() => {
        if (!activeChat) return;

        const room =
            userId < activeChat._id
                ? `${userId}_${activeChat._id}`
                : `${activeChat._id}_${userId}`;

        setRoomId(room);
        socket.emit("join_room", room);

        fetch("http://localhost:3000/api/getMessages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomId: room }),
        })
            .then((r) => r.json())
            .then(setMessages);
    }, [activeChat, userId]);

    /* SEND MESSAGE (OPTIMISTIC UI) */
    const sendChat = () => {
        if (!messageInput.trim() || !roomId) return;

        const tempMessage = {
            _id: Date.now(),
            roomId,
            senderId: userId,
            receiverId: activeChat._id,
            message: messageInput,
        };

        setMessages((prev) => [...prev, tempMessage]);

        socket.emit("send_message", {
            roomId,
            senderId: userId,
            receiverId: activeChat._id,
            message: messageInput,
        });

        setMessageInput("");
    };

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
