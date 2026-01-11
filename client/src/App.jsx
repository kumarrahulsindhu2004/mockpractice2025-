import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./AppLayout/AppLayout.jsx";
import Home from "./component/UI/Home.jsx";
import Login from "./component/UI/Login.jsx";
import SignUp from "./component/UI/SignUp.jsx";
import Subjects from "./component/UI/Subjects.jsx";

import PracticeLayout from "./component/UI/practice/PracticeLayout.jsx";
import PracticeCategories from "./component/UI/practice/PracticeCategories.jsx";
import PracticeSubcategories from "./component/UI/practice/PracticeSubcategories.jsx";
import PracticeQuestions from "./component/UI/practice/PracticeQuestions.jsx";
import Dashboard from "./component/UI/Dashboard.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <SignUp /> },
        { path: "/subject", element: <Subjects /> },
        {path:"/dashboard", element:<Dashboard/>},

        {
          path: "/practice",
          element: <PracticeLayout />,
          children: [
            { index: true, element: <PracticeCategories /> },
            { path: ":category", element: <PracticeSubcategories /> },
            {
              path: ":category/:subcategory",
              element: <PracticeQuestions />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
