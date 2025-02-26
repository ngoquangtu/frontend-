import { useState } from "react";
import Page from "../components/Page";
import { useLocation, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AmazonCampaignList from "./admin/AmazonCampaign";
import ChartExample from "../components/Chart";

export default function Home() {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <Page title="Trang chủ">
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div
                    className={`flex-1 p-4 transition-all duration-300 ${
                        isSidebarOpen ? "ml-64" : "ml-0"
                    }`}
                >
                    {location.pathname === "/home" ? <AmazonCampaignList /> : <Outlet />}
                </div>
              
            </div>
        </Page>
    );
}
