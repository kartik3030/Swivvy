import React from 'react'
import "../index.css"
import { Link } from "react-router-dom"

const Navbar = () => {
    return (<>
        <nav className='fixed top-0 w-full p-2 z-100 bg-black/40 backdrop-blur-md '>
            <ul className='flex justify-between items-center ml-5 mr-5  sm:ml-10 sm:mr-10'>
                <li className='font-extrabold text-sm sm:text-lg  text-white '>
                    <Link to={"/"}>
                        Swivvy
                    </Link>
                </li>
                <div className='flex gap-x-4 text-sm '>
                    <li>
                        <Link to="/login">
                            <button className='font-bold text-white  cursor-pointer'>Login</button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/signup">
                            <button className='font-bold text-white cursor-pointer'>  Sign-up</button>
                        </Link>
                    </li>
                </div>
            </ul>
        </nav>
    </>)
}

export default Navbar
