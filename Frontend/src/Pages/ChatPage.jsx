import React from "react";
import Chat from "../Components/Chat";

const ChatPage = () => {
    return (
        <div className="h-[100dvh] w-screen bg-black flex sm:justify-center text-white ">
            <div
                className="
                    h-full w-full
                    sm:w-200
                "
            >
                <Chat />
            </div>
        </div>
    );
};

export default ChatPage;
