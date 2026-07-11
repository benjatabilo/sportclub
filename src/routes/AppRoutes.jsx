import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Unauthorized from "../pages/Unauthorized"
import PublicLayout from "../layouts/PublicLayout"

import UserDashboard from "../pages/user/UserDashboard"
import CoachDashboard from "../pages/coach/CoachDashboard"
import AdminDashboard from "../pages/admin/AdminDashboard"

import UserLayout from "../layouts/UserLayout"
import CoachLayout from "../layouts/CoachLayout"
import AdminLayout from "../layouts/AdminLayout"

import ProtectedRoute from "./ProtectedRoute"
import RoleRoute from "./RoleRoute"
import UsersPage from "../pages/admin/UsersPage"

import Salas from "../pages/admin/Salas"
import Assignments from "../pages/admin/Assignments"
import Schedules from "../pages/admin/Shedules"
import Sports from "../pages/admin/Sports"

// IMPORTACIONES PARA USUARIO//
import UserClass from "../pages/user/UserClass"
import UserReserve from "../pages/user/UserReserve"

//importaciones para el coach
import CoachClass from "../pages/coach/CoachClass";
import CoachSchedule from "../pages/coach/CoachSchedule"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} /> 

        <Route path="/user" element={<RoleRoute allowedRoles={["user"]}><UserLayout /></RoleRoute>}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="userclass" element={<UserClass />} />
          <Route path="userreserve" element={<UserReserve />} />
        </Route>


        <Route path="/coach" element={<RoleRoute allowedRoles={["coach"]}><CoachLayout /></RoleRoute>}>
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="coachclass" element={<CoachClass />} />
          <Route path="coachschedule" element={<CoachSchedule />} />

        </Route>

        <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminLayout /></RoleRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="salas" element={<Salas />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="sports" element={<Sports/>} />
          <Route path="shedules" element={<Schedules />} />


        </Route>

        <Route path="/perfil" element={<ProtectedRoute><h1>Perfil del usuario autenticado</h1></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}



export default AppRoutes