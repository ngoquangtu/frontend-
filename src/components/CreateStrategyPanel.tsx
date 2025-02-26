import React, { useEffect, useState } from "react";
import {
  Modal,
  Steps,
  Form,
  Input,
  Button,
  Radio,
  InputNumber,
  Select,
  Space,
  Typography
} from "antd";
import { useApi } from "../hooks/api";
import { API } from "../common/common";
import { toast } from "react-toastify";
import { 
  PlusOutlined, MinusCircleOutlined, StopOutlined, ArrowRightOutlined, 
  SearchOutlined, RocketOutlined, SettingOutlined, ThunderboltOutlined, 
  PauseCircleOutlined, DeleteOutlined, AppstoreAddOutlined, FireOutlined, 
  UserSwitchOutlined, CloseCircleOutlined, ArrowDownOutlined, 
  ArrowUpOutlined, EditOutlined, AimOutlined, 
  SolutionOutlined,
  UserOutlined,
  BehanceOutlined,
  ProfileOutlined,
  BulbOutlined,
  ArrowLeftOutlined,
  DollarOutlined
} from "@ant-design/icons";
import { faBalanceScale } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const { Step } = Steps;
const { Option } = Select;

interface CreateStrategyPanelProps {
  visible: boolean;
  onClose: () => void;
}
const actionOptions = [
  { value: "black_list_search_term", label: "Negative search term", icon: <StopOutlined /> },
  { value: "disable_bid_auto", label: "Disable bid search term ", icon: <CloseCircleOutlined /> },
  { value: "decrease_bid_by_$", label: "Decrease bid of", icon: <ArrowDownOutlined /> },
  { value: "increase_bid_by__%", label: "Increase bid by %", icon: <ArrowUpOutlined /> },
  { value: "set_bid_to", label: "Set bid to", icon: <EditOutlined /> },
  { value: "increase_bid_by__$", label: "Increase bid by $", icon: <ArrowUpOutlined /> },
  { value: "decrease_bid_by_%", label: "Decrease bid by %", icon: <ArrowDownOutlined /> },
  { value: "paused", label: "Paused Campaign", icon: <PauseCircleOutlined /> },
  { value: "archived", label: "DELETE Campaign", icon: <DeleteOutlined /> },
];
const CreateStrategyPanel: React.FC<CreateStrategyPanelProps> = ({
  visible,
  onClose
}) => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const callApi = useApi();

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const handleFinish = (values: any) => {
    createStrategy(values);
    setCurrent(0);
    form.resetFields();
    onClose();
  };
  // useEffect(() => {
  //   const type = form.getFieldValue("targetingType");
  //   console.log(type);
  //   if (type !== "auto") {
  //     form.setFieldsValue({ bid_type: null });
  //   }
  // }, [form, form.getFieldValue("targetingType")]);

  const createStrategy = async (values: any) => {
    try {
      const strategyName = values.name;

      // Gọi API tạo Strategy
      const response = await callApi(API.CREATE__STRATEGY, {
        name: values.name,
        description: values.description,
        type: values.type,
        image: "https://localhost:5678/static/blue_horse.jpg"
      });

      // Sau khi tạo xong strategy, duyệt qua mảng rules để tạo từng rule
      if (values.rules && values.rules.length > 0) {
        for (let ruleItem of values.rules) {
          // Tự động nhóm metric, operator, value thành một object conditions
          const conditionsObj = {
            metric: ruleItem.metric,
            operator: ruleItem.operator,
            value: ruleItem.value,
            bidValue: ruleItem.bidValue,
            bid_type: ruleItem.bid_type
          };

          await callApi(API.CREATE__RULES__BASE, {
            strategy_id: response.strategy_id,
            note: ruleItem.note,
            priority: ruleItem.priority,
            trigger_event: ruleItem.trigger_event,
            targeting_type: ruleItem.targeting_type,
            // Lưu object conditionsObj thành JSON
            conditions: JSON.stringify(conditionsObj),
            period: ruleItem.period,
            action: ruleItem.action,

          });
        }
      }
      toast.success(`Create successfully strategy ${strategyName}`);
    } catch (err) {
      console.error("Error create strategy:", err);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={1000}
    >
      <Steps  className="pt-5"
items={[
  {
    title: 'Strategy',
    icon: <BulbOutlined />, // Biểu tượng bóng đèn thể hiện ý tưởng, chiến lược
  },
  {
    title: 'Rules',
    icon: <ProfileOutlined />, // Biểu tượng quyển sổ thể hiện quy tắc, hướng dẫn
  }
]}

        current={current}>
        <Step  className="pt-5 pb-2" title="Informations" />
        <Step className="pt-5 pb-2" title="Rules" />
      </Steps>

      <Form form={form} onFinish={handleFinish} layout="vertical">
        {/* Bước 0: Thông tin strategy */}
        <div style={{ display: current === 0 ? "block" : "none" }}>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select a goal!" }]}
          >
            <Radio.Group>
            <Radio.Button value="Save money">
        <DollarOutlined  style={{ marginRight: 8 }}/>
        Save money
      </Radio.Button>
      <Radio.Button value="Balanced">
      <FontAwesomeIcon icon={faBalanceScale}  style={{ marginRight: 8 }} />
        Balanced
      </Radio.Button>
      <Radio.Button value="Aggressive" >
        <ThunderboltOutlined    style={{ marginRight: 8 }}/>
        Aggressive
      </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter a name!" }]}
          >
            <Input placeholder="Enter strategy name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description!" }]}
          >
            <Input.TextArea placeholder="Enter strategy description" />
          </Form.Item>
        </div>

        {/* Bước 1: Danh sách Rules */}
        <div style={{ display: current === 1 ? "block" : "none" }}>
          <Form.List name="rules">
            {(fields, { add, remove }) => (
              <>
                {fields.length === 0 ? (
                  // Nếu chưa có rules, hiển thị "No rules yet" và icon bảng cấm
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <StopOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
                    <Typography.Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                      No rules yet
                    </Typography.Text>
                  </div>
                ) :
                  (fields.map((field, index) => (
                    <div
                      key={field.key}
                      style={{
                        marginBottom: 16,
                        border: "1px solid #ccc",
                        padding: "16px",
                        borderRadius: "4px",
                        position: "relative"
                      }}
                    >
                      <h4>Rule {index + 1}</h4>
                      {/* Icon delete ở góc phải */}
                      <MinusCircleOutlined
                        style={{
                          color: "red",
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          cursor: "pointer"
                        }}
                        onClick={() => remove(field.name)}
                      />

                      {/* Note */}
                      <Form.Item
                        {...field}
                        name={[field.name, "note"]}
                        label="Note"
                        rules={[{ required: true, message: "Please enter a note!" }]}
                      >
                        <Input placeholder="Enter note" />
                      </Form.Item>

                      {/* Priority */}
                      <Form.Item
                        {...field}
                        name={[field.name, "priority"]}
                        label="Priority"
                        rules={[{ required: true, message: "Please enter a priority!" }]}
                      >
                        <InputNumber min={1} placeholder="Enter priority to execute rule" />
                      </Form.Item>

                      {/* Trigger */}
                      <Form.Item
                        {...field}
                        label="When a"
                        name={[field.name, "trigger_event"]}
                        rules={[{ required: true, message: "Please choose a trigger" }]}
                      >
                        <Radio.Group>
                          <Radio.Button value="targeting">
                            <AimOutlined /> Target
                          </Radio.Button>
                          <Radio.Button value="searchterm">
                            <SearchOutlined /> Search term
                          </Radio.Button>
                          <Radio.Button value="campaign">
                            <RocketOutlined /> Campaign
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                      {/* Targeting type */}
                      <Form.Item
                        {...field}
                        label="Targeting type"
                        name={[field.name, "targeting_type"]}
                        rules={[{ required: true, message: "Please choose targeting type" }]}
                      >
                        <Radio.Group>
                          <Radio.Button value="auto">
                            <ThunderboltOutlined /> AUTO
                          </Radio.Button>
                          <Radio.Button value="sp">
                            <SettingOutlined /> Sponsored Product
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                      {/* Action */}
<Form.Item shouldUpdate>
  {({ getFieldValue }) => {
    const targetingType =
      getFieldValue(["rules", field.name, "targeting_type"]) ||
      getFieldValue("targeting_type");
    return targetingType === "auto" ? (
      <Form.Item
        {...field}
        name={[field.name, "bid_type"]}
        label="Bid Type"
        rules={[{ required: true, message: "Please select a bid type!" }]}
      >
        <Radio.Group>
          <Radio.Button value="LM">
            <FireOutlined /> LOSE MATCH
          </Radio.Button>
          <Radio.Button value="CL">
            <AimOutlined /> CLOSE MATCH
          </Radio.Button>
          <Radio.Button value="SUB">
            <UserSwitchOutlined /> SUBSTITUTES
          </Radio.Button>
          <Radio.Button value="COM">
            <AppstoreAddOutlined /> COMPLEMENTS
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
    ) : null;
  }}
</Form.Item>
                      <Form.Item shouldUpdate>
                        {({ getFieldValue }) => {
                          const targetingType = getFieldValue(["rules", field.name, "targeting_type"]);
                          const action = getFieldValue(["rules", field.name, "action"]);

                          // Lọc danh sách action dựa trên targeting type
                          const filteredActionOptions =
                            targetingType === "auto"
                              ? actionOptions.filter(option => ["paused", "archived", "black_list_search_term", "disable_bid_auto"].includes(option.value))
                              : actionOptions;
                          return (
                            <>
                              {/* Chọn Action */}
                              <Form.Item
                                {...field}
                                name={[field.name, "action"]}
                                label="Action"
                                rules={[{ required: true, message: "Please select an action!" }]}
                              >
                                <Radio.Group>
                                  {filteredActionOptions.map((option) => (
                                    <Radio.Button key={option.value} value={option.value}>
                                      {option.icon} {option.label}
                                    </Radio.Button>
                                  ))}
                                </Radio.Group>
                              </Form.Item>

                              {/* Ô nhập giá trị nếu action liên quan đến bid (chỉ hiển thị khi targeting là "manual") */}
                              {["increase_bid_by__$", "increase_bid_by__%", "decrease_bid_by_$", "decrease_bid_by_%", "set_bid_to"].includes(action) && (
                                <Form.Item
                                  label="Bid Value"
                                  name={[field.name, "bidValue"]}
                                  rules={[{ required: true, message: "Enter bid value" }]}
                                >
                                  <InputNumber min={0} style={{ width: 140 }} placeholder="Enter bid value" />
                                </Form.Item>
                              )}
                            </>
                          );
                        }}
                      </Form.Item>
                      {/* Condition Fields (Metric / Operator / Value) */}
                      <Form.Item label="Condition">
                        <Space
                          key={field.key}
                          align="baseline"
                          style={{
                            marginBottom: 8,
                            border: "1px solid #ccc",
                            padding: "8px",
                            borderRadius: "4px"
                          }}
                        >
                          <Form.Item shouldUpdate>
                            {({ getFieldValue }) => {
                              const metric = getFieldValue(["rules", field.name, "trigger_event"]);
                              {

                                return (
                                  <Form.Item
                                    {...field}
                                    label="Metric"
                                    name={[field.name, "metric"]}
                                    rules={[{ required: true, message: "Select a metric" }]}
                                  >
                                    <Select style={{ width: 140 }} placeholder="Filter by">
                                      <Option value="keywordBid">Bid</Option>
                                      <Option value="impressions">Impressions</Option>
                                      <Option value="clickThroughRate">Click Through Rate</Option>
                                      <Option value="clicks">Clicks</Option>
                                      <Option value="cost">Cost</Option>
                                      <Option value="costPerClick">CPC</Option>
                                      <Option value="sale">Sale</Option>
                                      {metric === "targeting" && <Option value="acosClicks">ACOS</Option>}
                                    </Select>
                                  </Form.Item>
                                );
                              }
                            }
                            }
                          </Form.Item>
                          <Form.Item
                            {...field}
                            label="Operator"
                            name={[field.name, "operator"]}
                            rules={[{ required: true, message: "Select an operator" }]}
                          >
                            <Select style={{ width: 80 }} placeholder="Op">
                              <Option value="gt">{">"}</Option>
                              <Option value="gte">{">="}</Option>
                              <Option value="lt">{"<"}</Option>
                              <Option value="lte">{"<="}</Option>
                              <Option value="eq">{"="}</Option>
                            </Select>
                          </Form.Item>

                          <Form.Item
                            {...field}
                            label="Value"
                            name={[field.name, "value"]}
                            rules={[{ required: true, message: "Enter a value" }]}
                          >
                            <InputNumber />
                          </Form.Item>
                        </Space>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "period"]}
                        label="Period"
                        rules={[{ required: true, message: "Please enter period!" }]}
                      >
                        <Select placeholder="Enter period">
                          <Option value="1d">1 Days</Option>
                          <Option value="7d">7 Days</Option>
                          <Option value="14d">14 Days</Option>
                          <Option value="30d">30 Days</Option>
                        </Select>
                      </Form.Item>

                    </div>
                  ))
                  )}
                <Form.Item>
                  <Button style={{ width: "fit-content", display: "block", margin: "0 auto" }} type="default" onClick={() => add()} block>
                    <PlusOutlined /> Add Rule
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {current > 0 && <Button onClick={prev}> <ArrowLeftOutlined/>Previous</Button>}
          {current < 1 && <Button type="primary" onClick={next}>Next <ArrowRightOutlined /></Button>}
          {current === 1 && <Button type="primary" htmlType="submit">Submit</Button>}
        </div>
      </Form>
    </Modal>
  );
};
export default CreateStrategyPanel;
