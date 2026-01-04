import React from "react";
import { useSwipeable } from "react-swipeable";
import API_URL from "../api";

const resolveImage = (path) => {
    if (!path) {
        return "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg";
    }

    // already absolute
    if (path.startsWith("http")) return path;

    // backend-relative upload
    if (path.startsWith("/uploads")) return `${API_URL}${path}`;

    return "https://i.pinimg.com/474x/3d/8d/b1/3d8db18cc50c15523a13908a593a480c.jpg";
};



const SwipeCard = ({ user, onAccept, onReject, matchedUser, closeMatch }) => {
    if (!user) {
        return (
            <div
                className="relative mt-4 
                           min-h-[75vh] max-h-[75vh]
                           sm:min-h-145 sm:max-h-145
                           min-w-[90%] max-w-[90%]
                           sm:min-w-145 sm:max-w-145
                           rounded-[10px]
                           flex items-center justify-center
                           bg-black"
            >
                <p className="text-gray-400 font-semibold">
                    No user left
                </p>
            </div>
        );
    }

    const handlers = useSwipeable({
        onSwipedRight: () => onAccept?.(user),
        onSwipedLeft: () => onReject?.(user),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    return (
        <div
            {...handlers}
            className="relative mt-4 
                       min-h-[75vh] max-h-[75vh]
                       sm:min-h-145 sm:max-h-145
                       min-w-[90%] max-w-[90%]
                       sm:min-w-145 sm:max-w-145
                       rounded-[10px] 
                       transition-transform duration-300"
        >
            {/* BACKGROUND IMAGE */}
            <img
                src={resolveImage(user.profilePhoto)}
                alt="profile"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                loading="eager"
                decoding="async"
            />

            {/* USER INFO */}
            <div
                className="absolute bottom-0 left-0 right-0 z-10
                           bg-black/85 backdrop-blur-md
                           p-2 sm:p-3 shadow-md"
            >
                <div className="flex items-end gap-x-2">
                    <h1 className="font-extrabold sm:text-2xl">
                        {user.FName}
                    </h1>

                    <div className="flex items-end text-sm text-gray-400">
                        <span className="material-symbols-outlined">
                            location_on
                        </span>
                        <span className="font-semibold">
                            {user.country || "India"}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                    {user.skills?.slice(0, 6).map((skill, i) => (
                        <div
                            key={i}
                            className="border-2 border-white/20 px-2 py-1
                                       rounded-full text-sm font-bold
                                       bg-gradient-to-r from-orange-500 to-orange-700
                                       bg-clip-text text-transparent"
                        >
                            {skill}
                        </div>
                    ))}
                </div>

                <p className="font-semibold text-sm sm:text-lg mt-2">
                    {user.bio || "No bio provided"}
                </p>
            </div>

            {/* MATCH POPUP */}
            {matchedUser && matchedUser._id === user._id && (
                <div
                    className="absolute inset-0 z-50 bg-black/70
                               flex items-center justify-center"
                >
                    <div
                        className="bg-black/20 backdrop-blur-md text-white
                                   w-full h-full rounded-[10px]
                                   p-6 flex items-center justify-center text-center"
                    >
                        <div>
                            <h2 className="text-2xl font-extrabold mb-3">
                                It's a Match!
                            </h2>

                            <img
                                src={resolveImage(matchedUser.profilePhoto)}
                                alt="match"
                                className="w-28 h-28 mx-auto rounded-full object-cover mb-4"
                            />

                            <p className="font-extrabold text-xl">
                                {matchedUser.FName}
                            </p>

                            <button
                                onClick={closeMatch}
                                className="h-10 mt-5 w-full
                                           rounded-[20px] font-bold
                                           bg-gradient-to-r from-orange-500 to-orange-700"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SwipeCard;
