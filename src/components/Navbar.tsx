'use client'; // This directive ensures the component is treated as a Client Component

import { useState } from 'react';
import Link from 'next/link';

export const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <button
                className="fixed top-4 left-4 z-50"
                onClick={toggleSidebar}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e8eaed"
                >
                    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                </svg>
            </button>

            <nav
                className={`bg-gray-800 text-white p-4 sm:p-6 md:p-4 w-64 fixed h-full z-40 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out`}
            >
                <div className="flex flex-col h-full justify-center items-center space-y-8">
                    <a href="/" className="text-2xl font-bold">
                        DreamLog
                    </a>
                    <div className="flex flex-col space-y-4">
                        <Link href="/logpage" className="hover:text-gray-300">
                            Log Page
                        </Link>
                        <Link href="/newentry" className="hover:text-gray-300">
                            New Entry
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};