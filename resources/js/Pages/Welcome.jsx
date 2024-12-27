import { Link, Head } from '@inertiajs/react';
import {LayoutContext, LayoutProvider} from "@/Layouts/layout/context/layoutcontext.jsx";
import {PrimeReactProvider} from "primereact/api";
import {Button} from "primereact/button";
import React, {useContext} from "react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const { layoutConfig} = useContext(LayoutContext);
    return (
        <>
            <PrimeReactProvider>
                <LayoutProvider>
            <Head title="Welcome" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:left-0 p-6">

                    <div className="flex align-items-center">

                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Log in
                                </Link>

                                <Link
                                    href={route('register')}
                                    className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>


                <div className="grid grid-nogutter surface-0 text-800">
                    <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
                        <section>
                        <h4 className="mt-0 mb-4 text-700 line-height-3">Streamline your workflow and stay on top of priorities with a task management system that ensures efficiency, clarity, and seamless collaboration for your team.</h4>

                        </section>
                    </div>
                    <div className="col-12 md:col-6 overflow-hidden">
                        <img src="/images/hero/Task-Manager.webp" alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                    </div>
                </div>

            </div>
            </LayoutProvider>
            </PrimeReactProvider>
        </>
    );
}
