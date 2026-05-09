import React from 'react'

const Aside = () => {
    return (<>
        <aside>
            <div className=' rounded-[10px] w-95  bg-white/5 backdrop-blur-md shadow-lg border-2 border-white/31'>
                <div className='flex justify-between p-4 items-center'>
                    <h1 className='font-lg bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent  font-bold'>MATCHES</h1>
                    <button
                        className='bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent hover:cursor-auto text-sm '>See all Matches</button>
                </div>
                <div className='flex justify-evenly p-3'>
                    <img
                        src="https://tse2.mm.bing.net/th/id/OIP.Dsn5Znnv-PfGHhOv-E95qwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                        alt="img"
                        className='max-w-20 rounded-[10px] blur-[2px]' />
                    <img
                        src="https://tse1.mm.bing.net/th/id/OIP._qBi83NNPhoX_OzkfUeNkAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                        alt="img"
                        className='max-w-20 rounded-[10px] blur-[2px]' />
                    <img
                        src="https://i.pinimg.com/originals/10/e9/14/10e914ff9c8cf99e84ee522a5724b16a.jpg"
                        alt="img"

                        className='max-w-20 rounded-[10px] blur-[2px]' />
                    <img
                        src="https://mir-s3-cdn-cf.behance.net/projects/max_808/74bc84163114807.Y3JvcCwxNDAwLDEwOTUsMCwxNDk.png"
                        alt="img" className='max-w-20 rounded-[10px] blur-[2px]' />
                </div>
            </div>

            {/* 2nd div */}
            <div className='rounded-[10px] w-95 border-1 border-white/31 bg-white/5  backdrop-blur-md shadow-lg mt-10 p-5'>

                <div className='flex mt-5 justify-evenly '>
                    <img
                        src="https://tse4.mm.bing.net/th/id/OIP.7G5KhBAEAyCnqd1Ucgna3wAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"
                        alt="img"
                        className='max-w-40 rounded-[10px]' />

                    <img
                        src="https://i.ytimg.com/vi/_zDYLteChgg/hqdefault_live.jpg"
                        alt="img"
                        className='max-w-40 rounded-[10px] ' />
                </div>
                <div className='flex justify-center'>
                    <button
                        className='border-2 border-white/21 p-1 w-40 rounded-[40px]  font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent mt-3 '>
                        See all Intrests
                    </button>
                </div>
            </div>

        </aside>
    </>)
}

export default Aside
