import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

import Home from './pages/Home';
import HelloPage from './pages/demo/Hello';
import ModalPage from './pages/demo/Modal';
import StaticListPage from './pages/demo/StaticList';
import DynamicListPage from './pages/demo/DynamicList';
import AdminHome from './pages/admin/AdminHome';
import AdminUsers from './pages/admin/AdminUsers';
import UserProfile from './pages/UserProfile';
import PageNotFoundErrorPage from './pages/error/PageNotFoundErrorPage';
import AmazonAuth from './pages/admin/AmazonAuth';
import CreateCampaign from './pages/admin/CreateCampaign';
import AmazonProfile from './pages/admin/AmazonProfile';
import AmazonCampaign from './pages/admin/AmazonCampaign';
import AmazonReport from './pages/admin/AmazonReport';
import AmazonBiddingRule from './pages/admin/AmazonBiddingRule';
import AmazonBudgetRule from './pages/admin/AmazonBudgetRule';
import CampaignUpload from './pages/admin/CampaignUpload';
import ProductCreate from './pages/admin/ProductCreate';
import PortfolioCreate from './pages/admin/CreatePortfolio';
import SellerLayout from './components/SellerLayout';   
import DetailCampaign from './pages/admin/DetailCampaign';
import RulesList from './components/RuleList';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        
        console.log(event.data.action);
      if (event.data && event.data.action === 'play_sound') {
        const audio = new Audio('/sounds/ting-notification.mp3');
        audio.play().catch((error) => {
          console.error("Không thể phát âm thanh: ", error);
        });
      }
    });
  }
  
root.render(
    <React.StrictMode>
        <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
            <Routes>
            <Route path="/" element={<Layout />} />
                <Route index element={<HelloPage />} />
            
                <Route element={<Layout />}>
                    
                    <Route path="/home" element={<Home />} />
                   
                    <Route path="/hello" element={<HelloPage />} />
                    {/* {process.env.NODE_ENV === 'development' && <>
                        
                        <Route path="/modal" element={<ModalPage />} />
                        <Route path="/static-list" element={<StaticListPage />} />
                        <Route path="/dynamic-list" element={<DynamicListPage />} />
                    </>} */}
                    <Route element={<Home />}>
                    <Route path="/profile/:id" element={<UserProfile />} />
                    <Route path="/user/amazon/create-campaign" element={<CreateCampaign />} />
                    <Route path="/user/amazon/login" element={<AmazonAuth />} />
                    <Route path="/user/amazon/campaign_list" element={<AmazonCampaign />} />
                    <Route path="/user/amazon/report" element={<AmazonReport />} />
                    <Route path="/user/amazon/bidding" element={<AmazonBiddingRule />} />
                    <Route path="/user/amazon/budget" element={<AmazonBudgetRule />} />
                    <Route path="/user/campaign/upload" element={<CampaignUpload />} />
                    <Route path="/user/product/create" element={<ProductCreate />} />
                    <Route path="/user/portfolio/create" element={<PortfolioCreate />} />
                    <Route path="/user/amazon/profile" element={<AmazonProfile />} />
                    <Route path="/user/amazon/campaign_list/:campaignId" element={<DetailCampaign />} />
                    <Route path="/user/amazon/rules" element={<RulesList />} />
                    </Route>
                    <Route element={<SellerLayout/>}>
                        
                    </Route>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<AdminHome />} />
                        <Route path="/admin/users" element={<AdminUsers />} />
                        <Route path="/admin/amazon/login" element={<AmazonAuth />} />
                        <Route path="/admin/amazon/profile" element={<AmazonProfile />} />
                        <Route path="/admin/amazon/campaign_list" element={<AmazonCampaign />} />
                        <Route path="/admin/amazon/report" element={<AmazonReport />} />
                    </Route>
                    <Route path="*" element={<PageNotFoundErrorPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
