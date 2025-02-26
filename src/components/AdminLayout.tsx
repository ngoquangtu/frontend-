import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import { Roles } from '../common/common';
import NotAdminErrorPage from '../pages/error/NotAdminErrorPage';

// eslint-disable-next-line import/no-anonymous-default-export
export default function() {
    const { userInfo } = useAuth();
    
    return (
        <div>
            { (userInfo?.role && [Roles.SYSTEM_ADMIN].includes(userInfo.role)) ? <Outlet /> : <NotAdminErrorPage /> }
		</div>
    )
}

