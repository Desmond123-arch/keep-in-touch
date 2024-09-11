import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Header from "./Header";
import Footer from "./Footer";


export default function MainLayout(){
    return (
        <body className="h-screen grid grid-rows-1">
        <Header/>
            <main>
            <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
            </Suspense>
            </main>
        <Footer/>
        </body>
    )
}