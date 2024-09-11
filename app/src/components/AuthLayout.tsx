import { Outlet } from "react-router-dom";
import { Suspense } from "react";



export default function AuthLayout(){
    return (
        <body className="h-screen grid grid-rows-1">
            <main>
            <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
            </Suspense>
            </main>
        </body>
    )
}