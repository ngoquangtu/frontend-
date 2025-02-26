import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark, faBars, faRightToBracket, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useApi } from "../hooks/api";
import { useAuth } from '../hooks/auth';
import { Link, NavLink } from 'react-router-dom';
import { API, NotificationInfo, Roles } from '../common/common';
import { ModalWithForm } from './Modal';
import { NotificationApp, showNotification } from '../components/NotificationApp';
import { toast } from 'react-toastify';
interface NavLinkInfo {
    title: string;
    url?: string;
}
interface NavItemInfo extends NavLinkInfo {
    subItems?: NavLinkInfo[];
}



function DesktopNavItem({ title, url, subItems }: NavItemInfo) {
    if (subItems && subItems.length > 0) {
        return <div className="dropdown">
            <div tabIndex={0} role="button" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                {title}
            </div>

            <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
                {subItems.map((item, idx) => <li key={item.url ?? item.title}>
                    <NavLink to={item.url ?? '#'} className={({ isActive }) => isActive ? 'bg-gray-900 text-white' : ''}>
                        {item.title}
                    </NavLink>
                </li>)}
            </ul>
        </div>
    } else {
        return <NavLink to={url ?? '#'} className={({ isActive }) => `rounded-md ${isActive ?
            'bg-gray-900 px-3 py-2 text-sm font-medium text-white' :
            'px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
        >
            {title}
        </NavLink>
    }
}

function MobileNavItem({ title, url, subItems }: NavItemInfo) {
    const [subItemsOpen, setSubItemsOpen] = useState(false);

    if (subItems && subItems.length > 0) {
        return <>
            <div className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                onClick={() => setSubItemsOpen(!subItemsOpen)}
            >
                {title}
                <FontAwesomeIcon icon={subItemsOpen ? faAngleUp : faAngleDown} className='ml-2' />
            </div>

            {subItemsOpen &&
                subItems.map((item, idx) =>
                    <NavLink key={item.url ?? item.title} to={item.url ?? '#'} className={({ isActive }) => `block rounded-md ${isActive ?
                        'bg-gray-900 px-6 py-2 text-base font-medium text-white' :
                        'px-6 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        {item.title}
                    </NavLink>)
            }
        </>

    } else {
        return <NavLink to={url ?? '#'} className={({ isActive }) => `block rounded-md ${isActive ?
            'bg-gray-900 px-3 py-2 text-base font-medium text-white' :
            'px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
        >
            {title}
        </NavLink>
    }
}




function LoginDialog() {
    const [show, setShow] = useState(false);
    const { login } = useAuth();

    return (<>
        <button className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" onClick={() => setShow(true)}>
            <FontAwesomeIcon icon={faRightToBracket} className="h-4 w-4 text-white" /> Đăng nhập
        </button>

        <ModalWithForm title='Đăng nhập' submitBtnTitle='Đăng nhập' show={show} handleClose={() => setShow(false)}
            formikConfig={{
                initialValues: {
                    username: '',
                    password: '',
                    rememberLogin: false
                },

                validate: values => {
                    const errors: any = {};
                    if (values.username.trim() === '') errors.username = 'Chưa điền tên đăng nhập.';
                    if (values.password.trim() === '') errors.password = 'Chưa điền mật khẩu.';
                    return errors;
                },

                onSubmit: async (values, { setSubmitting }) => {
                    setSubmitting(true);
                    await login(values.username, values.password, values.rememberLogin);
                    setSubmitting(false);
                }
            }}
        >
            {formik => <>
                <div>
                    <label className="label">
                        <span className="text-base label-text">Tên đăng nhập</span>
                    </label>
                    <input type="text" name="username" className="w-full input input-bordered"
                        onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} />
                </div>

                <div>
                    <label className="label mt-4">
                        <span className="text-base label-text">Mật khẩu</span>
                    </label>
                    <input type="password" name="password" className="w-full input input-bordered"
                        onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
                </div>

                <div>
                    <label className="label justify-start mt-4">
                        <input type="checkbox" name="rememberLogin" className="checkbox checkbox-md"
                            onChange={formik.handleChange} onBlur={formik.handleBlur} checked={formik.values.rememberLogin} />
                        <span className="text-base label-text ml-2">Nhớ đăng nhập</span>
                    </label>
                </div>
            </>}
        </ModalWithForm>
    </>)
}


function UserSection() {
    const formatDate = (dateString: any) => {
        if (!dateString) return "N/A"; // Xử lý nếu ngày tháng không có
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(date);
      };
    const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
    const { logout } = useAuth();
    const { userInfo } = useAuth();
    const [countNotification, setCountNotification] = useState<number>(0);
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<NotificationInfo[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const callApi = useApi();
    const fetchNotification = async () => {
        try {
            const response = await callApi(API.USER__NOTIFICATION__UNREAD_COUNT);
            setCountNotification(response.count);
        } catch (error) {
            throw error;
        }
    };
    const fetchNotificationList = async () => {
        try {
            const response = await callApi(API.USER__NOTIFICATION__LIST);
            setNotifications(response.info);
            if(countNotification>0)
            {
                await callApi(API.USER__NOTIFICATION__MARK_READ_ALL);
            }
           
        } catch (error) {
            throw error;
        }
    };
      const requestNotificationPermission = async () => {
        const permission = await Notification.requestPermission();
      };

    const toggleNotification = () => {
        setIsNotificationOpen(prevState => !prevState);
        setCountNotification(0);
    };
    useEffect(() => {
        if (userInfo) {
            fetchNotification();
        }
        requestNotificationPermission();
    
        const connectWebSocket = () => {
            const ws = new WebSocket('wss://localhost:5678');
            setSocket(ws);
    
            ws.onopen = () => {
                const subscribeMessage = {
                    message: 'subscribe',
                    userId: userInfo?.id,
                };
                ws.send(JSON.stringify(subscribeMessage));
            };
    
            ws.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    if(response.message && response.message==='new-notification')
                    {
                        showNotification(userInfo?.fullname);
                        fetchNotification();
                    }
                    
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };
    
            ws.onclose = () => {
                setTimeout(connectWebSocket, 1000); // Delay 1 giây để thử kết nối lại
            };
        };
    
        // Bắt đầu kết nối WebSocket khi component mount
        connectWebSocket();
    
        return () => {
            if (socket) {
                socket.close(); // Đảm bảo đóng kết nối khi component unmount
            }
        };
    }, [userInfo]);
    
    if (userInfo) {
        return (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Notifications icon */}
                <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    onClick={() => {
                        fetchNotificationList(); // Gọi hàm làm mới danh sách thông báo
                        toggleNotification(); // Bật/tắt hiển thị danh sách thông báo
                      }}
                >
                    <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
                    {/* Notification count badge */}
                    {countNotification > 0 && (
                        <span className="absolute top-5 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white-1000 bg-red-500 rounded-full">
                            {countNotification}
                        </span>
                    )}
                    {isNotificationOpen && (
                        <div className="absolute top-10 right-0 bg-blue-100  rounded-lg w-64 h-60 overflow-auto pt-2">
                            <ul>
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <li key={index} className="p-2 border-b">
                                            *{notification.content} ngày {formatDate(notification.creation_time)}
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-2 text-gray-500">Không có thông báo nào</li>
                                )}
                            </ul>
                        </div>
                    )}
                </button>
                <div className="relative ml-3" onClick={() => setProfileMenuOpen(s => !s)}>
                    <div>
                        <button type="button" className="relative flex rounded-full bg-gray-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                            <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-white mr-1" />
                            {userInfo.username}
                        </button>
                    </div>

                    <div className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${profileMenuOpen ?
                        'block transition-all ease-in duration-1000 transform opacity-100 scale-100' :
                        'hidden transition-all ease-out duration-1000 transform opacity-0 scale-95'
                        }`} role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={0}>
                        <Link to={`/profile/${userInfo.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left" tabIndex={0}>Your Profile ({userInfo.username})</Link>
                        <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left" tabIndex={0}>Settings</Link>
                        <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left w-full" tabIndex={0}
                            onClick={() => logout()}>Log out</button>
                    </div>
                </div>
            </div>)

    } else {
        return (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <LoginDialog />

            </div>
        )
    }
}



export default function NavBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const { userInfo } = useAuth();

    const navItems: NavItemInfo[] = [];

    navItems.push(
        { title: 'Giới Thiệu', url: '/hello' },
        // { title: 'Demo', subItems: [
        //     { title: 'Modal', url: '/modal' },
        //     { title: 'Static List', url: '/static-list' },
        //     { title: 'Dynamic List', url: '/dynamic-list' },
        // ]}
    );
    if(userInfo?.role && ([Roles.SYSTEM_ADMIN].includes(userInfo.role)||[Roles.NORMAL_USER].includes(userInfo.role)))
    {
        navItems.push(
            { title: 'Trang Chủ', url: '/home' },
        )
    }

    if (userInfo?.role && [Roles.SYSTEM_ADMIN].includes(userInfo.role)) {
        navItems.push({ title: 'Quản trị', url: '/admin' });
    }

    useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setMobileMenuOpen(false),
        );
    }, []);

    return <>
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">

                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden" onClick={() => setMobileMenuOpen(s => !s)}>
                        <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} className="h-6 w-6" fixedWidth={true} />
                        </button>
                    </div>

                    {/* Desktop menu bar */}
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <Link to="/" className="flex flex-shrink-0 items-center">
                            <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="" />
                        </Link>

                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navItems.map((e, idx) => <DesktopNavItem {...e} key={e.url ?? e.title} />)}
                            </div>
                        </div>
                    </div>
                    <UserSection />
                </div>
            </div>

            {/* Mobile menu bar */}
            <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {navItems.map((e, idx) => <MobileNavItem {...e} key={e.url ?? e.title} />)}
                </div>
            </div>
        </nav>
    </>
}