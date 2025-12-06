import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/HomePage/Home/Home";
import CityMap from "../Pages/CityMap/CityMap";
import ErrorPage from "../Pages/Error/ErrorPage";

const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: 'city-map',
                Component: CityMap
            },
            {
                path: "*",
                element: <ErrorPage />
            }
        ]

    }
])


export default router