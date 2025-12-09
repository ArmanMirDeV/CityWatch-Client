import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/HomePage/Home/Home";
import CityMap from "../Pages/CityMap/CityMap";
import ErrorPage from "../Pages/Error/ErrorPage";
import RegistrationPage from "../Authentication/Pages/RegistrationPage/RegistrationPage";
import LogInPage from "../Authentication/Pages/LogInPage/LogInPage";
import PrivateRoute from "./PrivateRoute";

// Citizen Imports
import CitizenDashboard from "../Pages/Dashboard/CitizenDashboard/CitizenDashboard";
import StaffDashboard from "../Pages/Dashboard/StaffDashboard/StaffDashboard";
import AssignedIssues from "../Pages/Dashboard/StaffDashboard/AssignedIssues";
import StaffOverview from "../Pages/Dashboard/StaffDashboard/StaffOverview";

import IssueDetails from "../Pages/IssueDetails/IssueDetails";
import AllIssues from "../Pages/AllIssues/AllIssues";
import CitizenStats from "../Pages/Dashboard/CitizenDashboard/CitizenStats";
import MyIssues from "../Pages/Dashboard/CitizenDashboard/MyIssues";
import ReportIssue from "../Pages/Dashboard/CitizenDashboard/ReportIssue";
import UserProfile from "../Pages/Dashboard/CitizenDashboard/UserProfile";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard/AdminDashboard";
import AdminOverview from "../Pages/Dashboard/AdminDashboard/AdminOverview";
import ManageUsers from "../Pages/Dashboard/AdminDashboard/ManageUsers";
import ManageStaff from "../Pages/Dashboard/AdminDashboard/ManageStaff";
import AdminAllIssues from "../Pages/Dashboard/AdminDashboard/AdminAllIssues";
import AdminProfile from "../Pages/Dashboard/AdminDashboard/AdminProfile";
import Payments from "../Pages/Dashboard/AdminDashboard/Payments";
import StaffProfile from "../Pages/Dashboard/StaffDashboard/StaffProfile";
import TopIssues from "../Pages/TopIssues/TopIssues";


const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "city-map",
        Component: CityMap,
      },
      {
        path: "register",
        element: <RegistrationPage />,
      },
      {
        path: "top-issues",
        element: <TopIssues />
      },
      {
        path: "login",
        element: <LogInPage />,
      },
      {
        path: "dashboard/citizen",
        element: (
          <PrivateRoute>
            <CitizenDashboard />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <CitizenStats />,
          },
          {
            path: "my-issues",
            element: <MyIssues />,
          },
          {
            path: "report-issue",
            element: <ReportIssue />,
          },
          {
            path: "profile",
            element: <UserProfile />,
          },
        ],
      },
      {
        path: "dashboard/admin",
        element: (
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        ),
        children: [
            {
               index: true, 
               element: <AdminOverview />
            },
            {
                path: "manage-users",
                element: <ManageUsers />
            },
            {
                path: "manage-staff",
                element: <ManageStaff />
            },
            {
                path: "all-issues",
                element: <AdminAllIssues />
            },
            {
                path: "profile",
                element: <AdminProfile />
            },
            {
                path: "payments",
                element: <Payments />
            }
        ]
      },
      {
        path: "dashboard/staff",
        element: (
          <PrivateRoute>
             <StaffDashboard />
          </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: <StaffOverview />
            },
            {
                path: "assigned-issues",
                element: <AssignedIssues />
            },
            {
                path: "profile",
                element: <StaffProfile />
            }
        ]
      },
      {
        path: "issue-details/:id",
        element: (
          <PrivateRoute>
            <IssueDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "all-issues",
        Component: AllIssues,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;
