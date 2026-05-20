import React from 'react'

const Footer = () => {
    return (<>
        <div className='bg-black p-10'>

            <div className='text-sm text-gray-400 flex gap-x-20'>
                <ul>
                    <li className='font-bold text-white mb-3'>Swivvy</li>
                    <li className='mt-1'>Privacy</li>
                    <li className='mt-1'>Terms</li>
                    <li className='mt-1'>Contact</li>
                </ul>
                <ul>
                    <li className='font-bold text-white mb-3'>Account</li>
                    <li className='mt-1'>Manage your Account</li>
                    <li className='mt-1'>Delete</li>
                </ul>
            </div>

            <div>
                <p className='mt-20 text-gray-400 mb-3'>
                    Skill-seekers, listen up: If you’re looking to learn, share your expertise, or just connect with like-minded people, you need to be on Swivvy. With thousands of matches made through skills, it’s the go-to place to find your next collaborator, mentor, or learning buddy. Let’s be real — the way we grow today looks very different, and most meaningful connections now start online. With Swivvy, you have a world of talented people at your fingertips, all ready to team up with someone like you. Whether you’re a student, a creator, or a professional, Swivvy is here to spark your next big move.
                </p>

                <hr />

                <p className='mt-2 text-gray-400 mb-3'>
                    There really is something for everyone on Swivvy. Want to build a project? You got it. Looking for a mentor or peer to grow with? Say no more. New on campus and eager to explore? Swivvy’s got your back. This isn’t your average networking site — it’s the most diverse skill-matching platform, where people of all backgrounds are invited to connect, collaborate, and create something bigger together.
                </p>

                <hr />

                <h1 className='text-lg mt-1 text-gray-400'>
                    Copyright 2025 Swivvy Inc. All rights reserved
                </h1>
            </div>
        </div>
    </>)
}

export default Footer
