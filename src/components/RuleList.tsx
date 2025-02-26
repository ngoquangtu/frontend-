import React, { useEffect, useState } from "react";
import { API } from "../common/common";
import { useApi } from "../hooks/api";
import { Button,Input } from "antd"
import CreateStrategyPanel from "./CreateStrategyPanel";
import { PlusOutlined } from "@ant-design/icons";
interface Strategy {
  id: number;
  name: string;
  description: string;
  type: string;
  image: string;
  total: number;
}
interface Rules {
  id: number;
  note: string,
  priority: number,
  trigger_event: string,
  conditions: object,
  period: string,
  action: string,
  created_at: string,
  strategy_id: number,
  targeting_type:string
}
interface Camapaign
{
  campaignId:number;
  name:string;
}
function mappingDay(period:string)
{
  switch (period) {
	  case "1d":
      return "1 Day"
	  case "7d":
      return "7 Days"
	  case "14d":
      return "14 Days"
	  case "30d":
      return "30 Days"
	  default:
      return "Today"
		
	}
}
function mappingAction(action:string)
{
  switch (action) {
	  case "black_list_search_term":
      return "negative search term"
	  case "disable_keyword_product":
      return "negative keyword || product"
	  case "decrease_bid":
      return "decrease bid to"
	  case "increase_bid":
      return "increase bid to"
	  case "define_bid":
      return "set bid to"
	  case "target_search_term":
      return "target search term"
	  case "paused":
      return "Pause campaign"
	  case "archived":
      return "delete campaign"
	  default:
      return ""
		
	}
}

export default function RulesList() {
  const [showModal, setShowModal] = useState(false);
  const [showModalApply, setShowModalApply] = useState(false);
  const [campaignName,setCampaignName]=useState<string>('');
  
  const [strategy, setStrategy] = useState<Strategy[]>([]);
  const [selectedStrategyId, setSelectedStategyId] = useState<number>(0);
  const [rules, setRule] = useState<Rules[]>([]);
  const [campaign,setCampaign]=useState<Camapaign[]>([]);
  const openModal = (id: number) => {
    setShowModal(true);
    setSelectedStategyId(id);
  };
  const openModalApply=(id:number)=>
  {
    setShowModalApply(true);
    setSelectedStategyId(id);
  }
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => setShowModal(false);
  const closeModalApply = () => setShowModalApply(false);

  const callApi = useApi();

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'Aggressive':
        return 'bg-red-100 text-red-600';
      case 'Save Money':
        return 'bg-green-100 text-green-600';
      case 'Balanced':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Aggressive':
        return '⚡';
      case 'Save Money':
        return '💰';
      case 'Balanced':
        return '⚖️';
      default:
        return '❓';
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await callApi(API.GET__STRATEGY);
        if (response && typeof response === "object") {
          // Lọc ra những key là số (bỏ qua 'error')
          const validRules = Object.keys(response)
            .filter((key) => !isNaN(Number(key))) // Chỉ giữ lại các key là số
            .map((key) => response[key]); // Lấy giá trị của các key là số

          setStrategy(validRules);
        } else {
          console.error('Unexpected API response format:', response);
        }
      } catch (err) {
        console.error('Error fetching rules:', err);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchRule = async (strategy_id: number) => {
      try {
        const response = await callApi(API.GET__RULES__BASE, { strategy_id });
        if (response && typeof response === "object") {
          // Lọc ra những key là số (bỏ qua 'error')
          const validRules = Object.keys(response)
            .filter((key) => !isNaN(Number(key))) // Chỉ giữ lại các key là số
            .map((key) => response[key]); // Lấy giá trị của các key là số

          setRule(validRules);
        } else {
          console.error('Unexpected API response format:', response);
        }
      } catch (err) {
        console.error('Error fetching rules:', err);
      }
    };
    if (selectedStrategyId != 0) {
      fetchRule(selectedStrategyId);
    }

  }, [selectedStrategyId]);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await callApi(API.GET__CAMPAIGN__NOT__APPLY__STRATEGY, { name: campaignName });
        if (response && response.data && Array.isArray(response.data)) {
          setCampaign(response.data); // Cập nhật state với data từ API
        } else {
          console.error('Unexpected API response format:', response);
        }
      } catch (err) {
        console.error('Error fetching campaign:', err);
      }
    };
    fetchCampaign();
  }, [campaignName]); 
  return (
    <div>
      <div className="flex justify-between mb-4 ml-6">
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
        <PlusOutlined /> Create a strategy
        </Button>

        <CreateStrategyPanel
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </div>
      <div className="grid grid-cols-2 gap-6 p-6">
        {strategy.map((rule, index) => (
          <div
            key={`${rule.id}-${index}`} // Tạo key kết hợp cả id và index để tránh trùng lặp
            className="bg-white rounded-2xl shadow-md overflow-hidden flex"
          >
            <img
              src={rule.image}
              alt={rule.name}
              className="w-1/3 h-full object-cover"
            />
            <div className="p-4 flex flex-col justify-between w-2/3">
              <div>
                <h3 className="text-xl font-semibold">{rule.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="  px-2 py-1 text-sm font-semibold bg-gray-300  rounded-full text-gray-600">{rule.total || 0} rules</span>
                  <span
                    className={`px-2 py-1 text-sm font-semibold rounded-full flex items-center gap-1 ${getTypeClass(rule.type)}`}
                  >
                    {getTypeIcon(rule.type)} {rule.type || 'N/A'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{rule.description}</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  onClick={() => openModal(rule.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Details
                </Button>
                <Button className="px-4 py-2 text-sm bg-black text-white rounded-lg">
                  Edit
                </Button>
                <Button
                  onClick={()=>openModalApply(rule.id)}
                  className="px-4 py-2 text-sm bg-black text-white rounded-lg">
                  Apply
                </Button>
              </div>
            </div>
          </div>

        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full relative">

          <div className="overflow-x-auto mt-4 max-h-96 overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left text-gray-600">Priority</th>
                <th className="p-3 text-left text-gray-600">Note</th>
                <th className="p-3 text-left text-gray-600">Trigger</th>
                <th className="p-3 text-left text-gray-600">Condition</th>
                <th className="p-3 text-left text-gray-600">Period</th>
                <th className="p-3 text-left text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {rules.length > 0 ? (
                rules.map((rule) => (
                  <tr key={rule.id} className="border-b bg-red-50">
                    <td className="p-3">{rule.priority}</td>
                    <td className="p-3 flex items-center">
                      <span className="mr-2 text-blue-600 font-bold">⬛</span>
                      {rule.note}
                    </td>
                    <td className="p-3">{rule.trigger_event}</td>
                    <td className="p-3">{rule.trigger_event}</td>
                    {/* <td className="p-3">{rule.conditions}</td> */}
                    <td className="p-3">{mappingDay(rule.period)}</td>
                    <td className="p-3 text-red-600 font-semibold">❌ {mappingAction(rule.action)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td  className="p-4 text-center text-gray-500">
                    No rules available for this strategy.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition mr-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

    {showModalApply && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full relative">
          <Input
        type="text"
        placeholder="Search campaigns..."
        className="w-full p-2 mb-4 border rounded-md"
        value={campaignName}
        onChange={(e) => setCampaignName(e.target.value)}
      />
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {campaign.length > 0 ? (
                campaign.map((rule) => (
                  <div key={rule.campaignId} className="p-4 border rounded-md shadow-sm bg-green-50">
                    <h3 className="text-lg font-medium">{rule.name}</h3>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">All campaigns already have strategy applied.</p>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={closeModalApply}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition mr-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
