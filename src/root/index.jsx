import { Navigate, Route, Routes } from "react-router-dom"
import Data from "../utils/navbar"
import PrivateRoutes from "./privateRoutes"
import Sidebar from "../components/Sidebar"
import Home from "../components/Home"
import SignInForm from "../components/Registration/SignIn"
import SignUpForm from "../components/Registration/SignUp"
import NotFound from "../components/NotFound"
import TelegramApp from "../components/TelegramApp"

function Root() {
     const isAuthed = Boolean(localStorage.getItem("token"))

     return <div>
          <Routes>
               <Route path="/home" element={<Home />} />
               <Route path="/telegram-app" element={<TelegramApp />} />

               <Route element={<Sidebar />}>
                    {
                         Data.map(({ path, element: Element }) => {
                              return <Route path={path} element={<PrivateRoutes> <Element /> </PrivateRoutes>} key={path} />
                         })
                    }
               </Route>

               <Route path="sign-in" element={<SignInForm />} />
               <Route path="sign-up" element={<SignUpForm />} />

               {/* Login qilmagan foydalanuvchi (va qidiruv botlari) uchun "/" darhol
                   marketing sahifasini ko'rsatadi — ikki bosqichli redirect (avval
                   /dashboard'ga, keyin /home'ga) Google'ga bo'sh sahifa ko'rsatib,
                   indekslashni buzayotgan edi. Faqat token bor foydalanuvchi
                   avtomatik dashboard'ga o'tadi. */}
               <Route path="/" element={isAuthed ? <Navigate to="/dashboard" /> : <Home />} />
               <Route path="*" element={<NotFound />} />
          </Routes>
     </div>

}

export default Root