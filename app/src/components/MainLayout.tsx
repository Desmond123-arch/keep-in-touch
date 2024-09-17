import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Header from "./Header";


export default function MainLayout(){
    return (
        <div className="w-full h-screen flex flex-col-reverse md:flex-row">
            <Header/>
            <main className="w-full h-full">
            <Suspense fallback={<div>Loading...</div>}>
                <Outlet/>
            </Suspense>
            </main>
        </div>
    )
}