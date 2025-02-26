import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faTimes,
    faBoxOpen,
    faBriefcase,
    faListAlt,
    faTasks,
    faBullhorn,
    faChartBar,
    faCloudUploadAlt,
    faDollar,
    faPiggyBank,
    faSignInAlt,
    faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

function SidebarLink({ path, icon, children }: { path: string; icon: any; children: React.ReactNode }) {
    return (
        <Link
            to={path}
            className="w-full h-12 px-4 py-2 rounded-lg text-base text-yellow-500 border-2 border-accent hover:bg-gray-600 hover:border-yellow-500 flex items-center transition-all duration-200"
        >
            <FontAwesomeIcon icon={icon} className="h-6 w-6 mr-3 text-white" />
            {children}
        </Link>
    );
}

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-15  left-0 z-50 text-white p-3  shadow-lg"
            >
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="h-3 w-3" />
            </button>

            <div
                className={`fixed left-0 top-19 h-screen bg-gray-800 text-white p-4 shadow-lg transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 w-64`}
            >
                 <h2 className="text-2xl font-bold text-cente  text-white mb-4">Dashboard</h2>
                <SidebarLink path="/user/amazon/login" icon={faSignInAlt}>Đăng Nhập Amazon</SidebarLink>
            <SidebarLink path="/user/amazon/create-campaign" icon={faBullhorn}>Create Campaign</SidebarLink>
            <SidebarLink path="/user/amazon/profile" icon={faUserCircle}>Profile List</SidebarLink>
            <SidebarLink path="/user/amazon/campaign_list" icon={faListAlt}>Campaign List</SidebarLink>
            <SidebarLink path="/user/amazon/report" icon={faChartBar}>Amazon Report</SidebarLink>
            <SidebarLink path="/user/amazon/bidding" icon={faPiggyBank}>Amazon Bidding Rule</SidebarLink>
            <SidebarLink path="/user/amazon/budget" icon={faDollar}>Amazon Budget Rule</SidebarLink>
            <SidebarLink path="/user/campaign/upload" icon={faCloudUploadAlt}>Campaign Upload</SidebarLink>
            <SidebarLink path="/user/product/create" icon={faBoxOpen}>Product Create</SidebarLink>
            <SidebarLink path="/user/portfolio/create" icon={faBriefcase}>Portfolio Create</SidebarLink>
            <SidebarLink path="/user/amazon/rules" icon={faBriefcase}>Ads Strategy</SidebarLink>
            </div>
        </>
    );
}
