import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from '../hooks/auth';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';

// eslint-disable-next-line import/no-anonymous-default-export
export default function() {
    return (
        <div className="min-h-screen w-full">
            <ToastContainer/>
            <AuthProvider>
                <NavBar/>
                
                <main className="w-full">
                    <Outlet />
                </main>
            </AuthProvider>
        </div>
    )
}