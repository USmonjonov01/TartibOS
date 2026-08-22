import { Navigate, Route, Routes } from "react-router-dom"
import Data from "../utils/navbar"
import PrivateRoutes from "./privateRoutes"
import Sidebar from "../components/Sidebar"
import Home from "../components/Home"
import SignInForm from "../components/Registration/SignIn"
import SignUpForm from "../components/Registration/SignUp"
import NotFound from "../components/NotFound"

function Root() {
     return <div>
          <Routes>
               <Route path="/home" element={<Home />} />

               <Route element={<Sidebar />}>
                    {
                         Data.map(({ path, element: Element }) => {
                              return <Route path={path} element={<PrivateRoutes> <Element /> </PrivateRoutes>} key={path} />
                         })
                    }
               </Route>

               <Route path="sign-in" element={<SignInForm />} />
               <Route path="sign-up" element={<SignUpForm />} />

               <Route path="/" element={<Navigate to="/dashboard" />} />
               <Route path="*" element={<NotFound />} />
          </Routes>
     </div>

}

export default Root