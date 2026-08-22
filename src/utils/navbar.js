import Dashboard from "../components/Dashboard"
import History from "../components/History"
import Missions from "../components/Missions"
import Profile from "../components/Profile"
import Review from "../components/Review"
import Routine from "../components/Routine"
import Statistics from "../components/Statistics"

const Data = [

    {
        id: 2,
        title: "Dashboard",
        path: "/dashboard",
        element: Dashboard
    },

    {
        id: 3,
        title: "Missions",
        path: "/missions",
        element: Missions
    },

    {
        id: 4,
        title: "Routine",
        path: "/routine",
        element: Routine
    },

    {
        id: 5,
        title: "Statistics",
        path: "/statistics",
        element: Statistics
        
    },

    {
        id: 6, 
        title: "Review",
        path: "/review",
        element: Review
    },

    {
        id: 7, 
        title: "Profile",
        path: "/profile",
        element: Profile
    },

    {
        id: 8,
        title: "History",
        path: "/history",
        element: History
    }
]

export default Data