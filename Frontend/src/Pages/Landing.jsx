import React, { useState, useEffect } from 'react'
import Navbar from "../Components/Navbar.jsx"
import Footer from "../Components/Footer.jsx"
import { Link } from "react-router-dom"

const Landing = () => {



    return (
        <>
            <Navbar />
            <main className='cursor-default'>
                <div className='bg-black '>
                    <div className='sm:flex sm:justify-between text-center sm:text-start'>
                        <div>
                            <p className='ml-5 pt-10 sm:ml-10 mr-5 sm:mr-0 sm:pt-20'>
                                <h1 className='font-extrabold   text-6xl sm:text-8xl text-red-900'>
                                    <span>Find people</span> {" "}
                                    <span>by skills,</span>
                                </h1>
                                <h1 className='font-extrabold  text-6xl sm:text-8xl text-red-900'>
                                    not by
                                </h1>
                                <h1 className='font-extrabold text-6xl sm:text-8xl text-red-900'>
                                    resume
                                </h1>
                            </p>

                            <div className='flex gap-x-2 sm:gap-x-5 mt-5 justify-center sm:justify-normal'>
                                <Link to="/signup">
                                    <button className='h-10 text-sm text-white rounded-[20px] w-30 sm:ml-10 font-bold bg-gradient-to-r from-orange-500 to-orange-700 cursor-pointer'>
                                        Join now
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className='border-2 h-10 rounded-[20px] w-30 bg-black text-white font-bold cursor-pointer hover:border-[#FFFDD0]'>
                                        Register
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className='flex sm:min-w-150 min-w-screen max-w-screen '>
                            <div className='flex sm:justify-center items-center sm:mr-5 pt-5 sm:pt-20  sm:min-w-100'>
                                <div className='bg-black/10 p-4 sm:min-w-fit min-h-fit sm:min-h-fit rounded-[10px] relative left-5 sm:right-20 min-w-fit border-2 border-gray-300 hover:border-[#D8BC9B]'>
                                    <div className='flex justify-center'>
                                        <img
                                            src="https://i.pinimg.com/736x/fb/35/41/fb35411697c03cf8b3d09ee89856098d.jpg"
                                            alt="img"
                                            className='rounded-[10px] w-30 sm:w-50 sm:sml-5 min-h-30 '
                                        />
                                    </div>
                                    <h1 className='text-center font-extrabold text-white'>Rhea</h1>
                                    <h1 className='text-center text-sm text-white'>Money </h1>
                                    <div className='flex justify-center mt-2'>
                                        <button className='p-1 w-30 sm:w-50 rounded-[20px] bg-white text-black font-bold'>
                                            Chat
                                        </button>
                                    </div>
                                </div>

                                <div className='bg-black/95 text-white p-4 relative min-w-[55vw] right-15 sm:right-10 sm:min-w-fit sm:min-h-fit rounded-[10px] z-10 border-2 hover:border-[#D8BC9B] border-violet-200'>
                                    <div className='flex justify-center'>
                                        <img
                                            src="https://i.pinimg.com/originals/6e/76/b1/6e76b167bb0b2160ba3e84d9abc2a30a.jpg"
                                            alt="img"
                                            className='rounded-[10px] sm:min-w-60 sm:max-w-60 min-h-[30vh]'
                                        />
                                    </div>
                                    <h1 className='text-center font-extrabold text-white'>Clave</h1>
                                    <h1 className='text-center text-sm text-white'>Code & CHill</h1>
                                    <div className='flex justify-center mt-2 sm:mt-15'>
                                        <button className='h-10 rounded-[20px] sm:w-50 w-30 font-bold bg-gradient-to-r from-orange-500 to-orange-700 cursor-pointer'>
                                            Chat
                                        </button>
                                    </div>
                                </div>

                                <div className='bg-black/10 p-4 sm:min-w-fit min-h-fit sm:min-h-fit rounded-[10px] relative right-40 sm:right-20 min-w-fit border-2 border-gray-300 hover:border-[#D8BC9B]'>
                                    <div className='flex justify-center'>
                                        <img
                                            src="https://i.pinimg.com/736x/2a/43/21/2a4321d71391e8caebfd6cd4b8cbd442.jpg"
                                            alt="img"
                                            className='rounded-[10px] w-30 sm:w-50 sm:sml-5 min-h-30'
                                        />
                                    </div>
                                    <h1 className='text-center font-extrabold text-white'>Joe</h1>
                                    <h1 className='text-center text-sm text-white'>Data Sci</h1>n
                                    <div className='flex justify-center items-center'>
                                        <button className='p-1 w-30 sm:w-50 rounded-[20px] bg-white text-black font-bold'>
                                            Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='bg-black text-white text-center pt-10'>
                        <h1 className="text-5xl sm:text-7xl font-extrabold">
                            How its <span className="text-red-900">Done ?</span>
                        </h1>
                    </div>

                    <div className='flex justify-center pt-5'>
                        <div className='grid grid-cols-2 gap-x-2 sm:gap-x-0 gap-y-2 sm:flex items-center  w-fit sm:ml-10'>
                            <div className='flex h-25 w-45 sm:w-50 justify-center gap-x-1 sm:justify-center items-center bg-gray-100 hover:bg-red-900 hover:text-white'>
                                <span className="material-symbols-outlined text-red-700">
                                    account_circle
                                </span>
                                <p className='font-serif '>Create profile</p>
                            </div>

                            <div className='flex h-25 w-45 sm:w-50 justify-center gap-x-1 sm:justify-center items-center bg-gray-100 hover:bg-red-900 hover:text-white'>
                                <span className="material-symbols-outlined text-red-700">
                                    face
                                </span>
                                <p className='font-serif'>Explore peoples</p>
                            </div>

                            <div className='flex h-25 w-45 sm:w-50 justify-center gap-x-1 sm:justify-center items-center bg-gray-100 hover:bg-red-900 hover:text-white'>
                                <span className="material-symbols-outlined text-red-700">
                                    group
                                </span>
                                <p className='font-serif'>Collaborate</p>
                            </div>

                            <Link to="/signup">
                                <div className='flex h-25 w-45 sm:w-50 justify-around items-center bg-gradient-to-r from-orange-500 to-orange-700 sm:mt-0'>
                                    <button className='font-serif text-white'>Join Now</button>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Second */}


                {/* slider container */}
                <div className='bg-black pt-15 min-h-screen'>
                    <div className='bg-[url("https://i.ytimg.com/vi/Ov-K6GSpVxg/maxresdefault.jpg")] bg-no-repeat bg-top min-h-[90vh]'>
                        <div className='flex justify-end'>
                            <h1 className='text-6xl sm:text-8xl text-end font-extrabold sm:mt-10 text-white mr-5'>
                                <span>Find </span> <br />
                                <span>Your </span> <br />
                                <span className='text-red-900'>Match</span>

                                <p className='text-xs sm:text-sm sm:text-end font-medium'>
                                    <span>No more mid matches.</span><br />
                                    <span>Find the people who actually feel like your type of human.
                                    </span>
                                </p>
                                <Link to="/signup">
                                    <div className='flex sm:justify-end mt-5 mr-5'>
                                        <button
                                            className='h-10 text-sm rounded-[20px] w-30 sm:ml-10 font-bold bg-gradient-to-r from-orange-500 to-orange-700 cursor-pointer'>
                                            Explore
                                        </button>
                                    </div>

                                </Link>
                            </h1>
                        </div>
                    </div>
                </div>


                <div className='bg-black pt-10 min-h-screen'>
                    <div className='bg-[url("https://i.ytimg.com/vi/3ZyEnuqyu0k/maxresdefault.jpg")] bg-no-repeat  bg-center sm:bg-right min-h-[90vh] ] '>
                        <div className='ml-5'>
                            <span className='text-5xl sm:text-8xl font-extrabold mt-10 text-white'>
                                Connect &
                            </span>
                            <br />
                            <span className='text-5xl sm:text-8xl font-extrabold mt-10 text-red-900'>Collaborate</span><br />
                            <span className='text-sm font-medium text-white ml-5'>Link up with driven people and make collaboration effortless.</span><br />

                            <Link to="/signup">
                                <button className='h-10 text-sm rounded-[20px] w-30  font-bold bg-gradient-to-r from-orange-500 to-orange-700 mt-5 text-white'>
                                    Connect
                                </button>
                            </Link>

                        </div>
                        <div className='sm:mt-80 mt-100'>
                            <div className=' text-white text-center '>
                                <h1 className="text-5xl sm:text-7xl font-extrabold">
                                    Find. <span className="text-red-900">Match.</span> Link. Repeat.
                                </h1>
                            </div>
                            <p className='text-white text-center'>Strong connections. Better teamwork.</p>
                        </div>
                    </div>

                </div>





                <div className='sm:flex bg-black text-black sm:pt-5 pt-10  '>
                    <div

                        className='sm:w-1/2 bg-white/10 text-white ml-5 sm:ml-3 mr-5 sm:mr-0 min-h-[90vh] sm:min-h-150'>
                        <div className='sm:flex sm:justify-between '>
                            <div className='sm:pt-5 font-extrabold '>
                                <span className='text-2xl sm:text-7xl ml-3 sm:ml-5'>Swipe</span><br />
                                <span className='text-2xl sm:text-6xl ml-3 sm:ml-5'>To</span>
                                <p className='text-red-900 text-5xl sm:text-5xl ml-3 sm:ml-5'>
                                    Match
                                </p>
                            </div>

                            <div className='flex justify-center mt-10 sm:mt-0'>
                                <div className='bg-black/90 text-white p-1 sm:p-2 w-70 rounded-[10px] sm:h-100 border-2 sm:mr-20 sm:mt-10 border-gray-400'>
                                    <div className='flex justify-center items-center mt-1'>
                                        <img
                                            src="https://preview.redd.it/huey-riley-v0-jefvnkclrbz91.jpg?width=640&crop=smart&auto=webp&s=448475c181c2c2ab12d30a12fdd774d27c765e70"
                                            alt="img"
                                            className='rounded-[10px]  sm:max-h-60 '
                                        />
                                    </div>
                                    <h1 className='text-center font-extrabold'>Anonymous</h1>
                                    <h1 className='text-center'>You need two brains to beat me in Chess </h1>

                                    <div className='flex items-center justify-center gap-x-5 mt-5 sm:mt-2 '>
                                        <button className='p-4 border-2 rounded-[10px] border-red-500 text-red-500 flex items-center justify-center '>
                                            <span className="material-symbols-outlined">close</span>
                                        </button>

                                        <button className='p-4 border-2 rounded-[10px] border-green-700 text-green-700 flex items-center justify-center'>
                                            <span className="material-symbols-outlined">check</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <p className='sm:text-lg text-gray-400 text-center  mt-10 sm:mt-50'>
                            Swipe Left to <span className='text-red-500'>reject</span> and swipe right to{' '}
                            <span className='text-green-700'>connect</span>
                        </p>

                    </div>

                    <div

                        className='sm:w-1/2 bg-white/10 mt-5  sm:mt-0 text-white sm:ml-3 sm:mr-3 mr-5 ml-5 sm:h-140 min-h-[90vh] '>
                        <h1 className='sm:pt-2 font-extrabold  text-end'>
                            <p className='text-4xl sm:text-6xl mr-3'>Skill</p>
                            <p className='text-2xl sm:text-6xl mr-3'>Based</p>
                            <p className=' text-red-900 text-5xl sm:text-5xl mr-3'>
                                MatchMaking
                            </p>
                        </h1>

                        <div className='flex justify-center items-center mt-10 sm:mt-2 '>
                            <div className='flex items-center  justify-between sm:gap-x-10 sm:ml-25 '>
                                <div className='bg-black/90 text-white p-2 w-40 sm:w-60 min-h-fit rounded-[10px] sm:min-h-50 border-2 sm:mt-1 border-gray-400'>

                                    <img
                                        src="https://i.pinimg.com/474x/59/07/5c/59075c3183f3694b5cd432be62cb3370.jpg?nii=t"
                                        alt="img"
                                        className='rounded-[10px] sm:max-h-60 sm:min-h-60 max-h-50  '
                                    />

                                    <h1 className='text-center font-extrabold'>Jade</h1>
                                    <h1 className='text-center text-sm'>
                                        Vibe Coding and Gaming
                                    </h1>
                                    <div className='flex justify-center  mt-20'>
                                        <button className='p-1 w-30 sm:w-50 rounded-[20px] bg-gradient-to-r from-orange-500 to-orange-700 text-black font-bold'>
                                            Chat
                                        </button>
                                    </div>
                                </div>

                                <div className='text-red-700'>
                                    <span className="material-symbols-outlined">favorite</span>
                                </div>

                                <div className='bg-black/90 text-white p-2 w-40 sm:w-60 min-h-fit rounded-[10px] sm:min-h-50 border-2 sm:mt-1 border-gray-400'>
                                    <img
                                        src="https://assets-prd.ignimgs.com/avatars/628784792d8e1600016d569e/download20211104112955-1653048478988.png"
                                        alt="img"
                                        className='rounded-[10px] sm:max-h-60 sm:min-h-60 '
                                    />
                                    <h1 className='text-center font-extrabold'>Joe</h1>
                                    <h1 className='text-center text-sm'>
                                        Tech and Programming
                                    </h1>
                                    <div className='flex justify-center  mt-20'>
                                        <button className='p-1 w-30 sm:w-50 rounded-[20px] bg-gradient-to-r from-orange-500 to-orange-700 text-black font-bold'>
                                            Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className='text-lg text-gray-400 text-center mt-40 sm:mt-10'>
                            connect with the people with same{' '}
                            <span className='text-green-700'>intrest</span>
                        </p>
                    </div>
                </div>

                <div className='sm:flex bg-black text-black sm:min-h-fit pt-5 sm:pt-3'>
                    <div className='hidden sm:block sm:w-1/2 bg-white/10 text-white ml-3'>
                        <h1 className='text-end font-extrabold '>
                            <span className='sm:text-7xl'>Real</span><br />
                            <span className='sm:text-3xl'>Time</span>
                            <p className='text-red-900 sm:text-5xl'>
                                Chat
                            </p>
                        </h1>

                        <div>
                            <div className='bg-black/90 text-white p-2 w-70 sm:w-fit rounded-[10px]  border-2 border-gray-400'>
                                <h1 className='font-bold sm:text-2xl text-center'>Chat</h1>

                                <div className='flex items-center gap-x-5 mt-5 sm:mt-0'>
                                    <img
                                        src="https://blog.cpanel.com/wp-content/uploads/2019/08/user-01.png"
                                        alt="pfp"
                                        className='w-15'
                                    />
                                    <span className='text-2xl font-bold text-gray-400'>Joe</span>
                                </div>

                                <div className='flex gap-x-3'>
                                    <p className='border-2 w-fit p-2 rounded-[10px] bg-gray-300 text-black ml-70'>
                                        Hey! bro i like your pfp
                                    </p>
                                </div>

                                <div className='flex gap-x-3'>
                                    <p className='border-2 w-fit p-2 rounded-[10px] bg-gray-300 text-black ml-66'>
                                        And we got same intrests
                                    </p>
                                    <img
                                        src="https://static.vecteezy.com/system/resources/thumbnails/035/712/008/small_2x/3d-simple-user-icon-png.png"
                                        alt="pfp"
                                        className='w-10'
                                    />
                                </div>

                                <div className='flex gap-x-3'>
                                    <p className='border-2 w-fit p-2 rounded-[10px] bg-gray-300 text-black ml-13'>
                                        Thanks bro
                                    </p>
                                </div>

                                <div className='flex gap-x-3'>
                                    <img
                                        src="https://blog.cpanel.com/wp-content/uploads/2019/08/user-01.png"
                                        alt="pfp"
                                        className='w-10'
                                    />
                                    <p className='border-2 w-fit p-2 rounded-[10px] bg-gray-300 text-black'>
                                        Lets collaborate
                                    </p>
                                </div>

                                <div className='flex items-center gap-x-3 mt-10 ml-10'>
                                    <input
                                        type="text"
                                        className='bg-2 bg-gray-300 text-black font-bold p-3 w-100 rounded-[10px]'
                                        placeholder='Chat'
                                    />
                                    <button>
                                        <span className="material-symbols-outlined">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div

                        className='sm:w-1/2 bg-white/10 text-white sm:ml-3 ml-5 mr-5 sm:mr-3 mt-3  sm:mt-0 min-h-[90vh] sm:min-h-150 '>
                        <div>
                            <h1 className='font-extrabold   sm:text-start text-2xl sm:text-5xl'>
                                Global
                                <p className=' text-red-900 text-5xl'>
                                    Community
                                </p>
                            </h1>
                        </div>
                        <div className='bg-black/90 text-white p-2 sm:w-100 rounded-[10px]  border-2 sm:ml-50 border-gray-400  flex justify-center items-center sm:items-start mt-10 '>
                            <img
                                src="https://i.pinimg.com/originals/40/7c/12/407c12a9e8aed1d6dcbffe752a03f5e8.png"
                                alt="img"
                                className=' min-h-100'
                            />
                        </div>


                    </div>
                </div>
            </main >
            <Footer />
        </>
    )
}

export default Landing
