import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/HomePage/Home/Home";
import CityMap from "../Pages/CityMap/CityMap";
import ErrorPage from "../Pages/Error/ErrorPage";
import RegistrationPage from "../Authentication/Pages/RegistrationPage/RegistrationPage";
import LogInPage from "../Authentication/Pages/LogInPage/LogInPage";
import PrivateRoute from "./PrivateRoute";
import CitizenDashboard from "../Pages/Dashboard/CitizenDashboard/CitizenDashboard";
import StaffDashboard from "../Pages/Dashboard/StaffDashboard/StaffDashboard";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard/AdminDashboard";
import IssueDetails from "../Pages/IssueDetails/IssueDetails";
import AllIssues from "../Pages/AllIssues/AllIssues";
import CitizenStats from "../Pages/Dashboard/CitizenDashboard/CitizenStats";
import MyIssues from "../Pages/Dashboard/CitizenDashboard/MyIssues";
import ReportIssue from "../Pages/Dashboard/CitizenDashboard/ReportIssue";
import UserProfile from "../Pages/Dashboard/CitizenDashboard/UserProfile";
import EditIssueModal from "../Pages/Dashboard/CitizenDashboard/EditIssueModal";

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
        path: "dashboard/staff",
        element: (
          <PrivateRoute>
            <StaffDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "dashboard/admin",
        element: (
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        ),
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
