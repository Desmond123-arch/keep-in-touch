
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import routes from "./routes"
import { authRoutes } from "./routes"
import MainLayout from "./components/MainLayout"
import AuthLayout from "./components/AuthLayout"

function App() {
  const router = createBrowserRouter([
    {
      element: <MainLayout/>,
      // errorElement: <page404/>
      children: routes
    },
    {
      element: <AuthLayout/>,
      children: authRoutes
    }
  ])
  return (
    <RouterProvider router={router}/>
  )
}

export default App
