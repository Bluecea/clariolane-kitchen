import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { Login } from './routes/Login'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { PassageForm } from './components/passage/PassageForm'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import Overview from './routes/dashboard/overview'
import Passages from './routes/dashboard/passages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Overview />,
          },
          {
            path: 'passage',
            element: <Outlet />, // Wrapper for nested passage routes
            children: [
              {
                index: true,
                element: <Passages />,
              },
              {
                path: 'new',
                element: <PassageForm />,
              },
              {
                path: ':id',
                element: <PassageForm />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to='/' replace />,
  },
])
