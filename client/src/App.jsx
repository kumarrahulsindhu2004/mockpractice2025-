import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AppLayout from './AppLayout/AppLayout.jsx'
import './App.css'
import Home from './component/UI/Home.jsx'
import Login from "./component/UI/Login.jsx"
import Practice from "./component/UI/Practice.jsx"
import SignUp from "./component/UI/SignUp.jsx"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path:"/login",
          element:<Login/>
        },
        {
          path:"/signup",
          element:<SignUp/>
        },
        {
          path:"/practice",
          element:<Practice/>
        },
        
      ]
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
