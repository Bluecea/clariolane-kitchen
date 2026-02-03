import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, LogOut, FileText, LayoutDashboard, User } from 'lucide-react'

export const DashboardLayout = () => {
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, end: true },
    { name: 'Passage', href: '/dashboard/passage', icon: FileText },
  ]

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-slate-900/50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className='flex h-16 items-center justify-center border-b border-slate-100'>
          <h1 className='text-xl font-bold text-indigo-600'>Bluecea Passage</h1>
        </div>

        <nav className='flex-1 space-y-1 px-4 py-6'>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }>
              <item.icon className='mr-3 h-5 w-5' />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className='border-t border-slate-100 p-4'>
          <div className='flex items-center gap-3 px-4 py-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500'>
              <User className='h-4 w-4' />
            </div>
            <div className='overflow-hidden'>
              <p className='truncate text-sm font-medium text-slate-700'>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className='mt-2 flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors'>
            <LogOut className='mr-3 h-5 w-5' />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='lg:pl-64 flex flex-col min-h-screen'>
        <header className='sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='rounded-md p-2 text-slate-500 hover:bg-slate-100 focus:outline-none'>
            <Menu className='h-6 w-6' />
          </button>
          <span className='ml-4 text-lg font-semibold text-slate-900'>
            Dashboard
          </span>
        </header>

        <main className='flex-1 p-4 sm:p-6 lg:p-8'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
