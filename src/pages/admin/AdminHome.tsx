import { ReactNode } from "react";
import Page from "../../components/Page";
import { Link } from "react-router-dom";
import {
    faUsers,
    faUserCircle,
    faUserPlus,
    faTasks,
    faListAlt,
    faChartPie,
    faKey,
    faVideo,
    IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function JumboCard({ path, icon, children }: { path: string; icon: IconDefinition; children: ReactNode }) {
    return (
        <Link
            to={path}
            className="w-full sm:w-40 h-32 p-4 rounded-2xl bg-gray-700 text-xl text-yellow-500 border-2 border-accent hover:bg-gray-600 hover:border-yellow-500 inline-block text-center flex flex-col items-center"
        >
            <FontAwesomeIcon icon={icon} className="h-8 w-8 mb-2 text-white" />
            {children}
        </Link>
    );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
    return (
        <Page title="Trang quản trị">
            <div className="flex flex-wrap justify-start space-x-4">
                <JumboCard path="/admin/users" icon={faUsers}>Quản lý tài khoản</JumboCard>
                <JumboCard path="/admin/amazon/profile" icon={faUserCircle}>Profile List</JumboCard>
                
            
                <JumboCard path="/admin/dashboard" icon={faChartPie}>Bảng điều khiển</JumboCard>
            
            </div>
        </Page>
    );
}
