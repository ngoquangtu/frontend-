import React, { useState } from "react";
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
import { PlusOutlined, MinusCircleOutlined, StopOutlined, ArrowRightOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { Option } = Select;

interface CreateStrategyPanelProps {
  visible: boolean;
  onClose: () => void;
}

const EditStrategyPanel: React.FC<CreateStrategyPanelProps> = ({
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

  const createStrategy = async (values: any) => {
    try {
      const strategyName = values.name;

      // Gọi API tạo Strategy
      const response = await callApi(API.EDIT__STRATEGY, {
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
            value: ruleItem.value
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
            action: ruleItem.action
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
      <Steps current={current}>
        <Step className="pt-5 pb-2" title="Informations" />
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
              <Radio.Button value="Save money">Save money</Radio.Button>
              <Radio.Button value="Balanced">Balanced</Radio.Button>
              <Radio.Button value="Aggressive">Aggressive</Radio.Button>
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
                          <Radio.Button value="targeting">Target</Radio.Button>
                          <Radio.Button value="searchterm">Search term</Radio.Button>
                          <Radio.Button value="campaign">Campaign</Radio.Button>
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
                          <Radio.Button value="auto">AUTO</Radio.Button>
                          <Radio.Button value="manual">MANUAL</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                      {/* Action */}
                      <Form.Item
                        {...field}
                        name={[field.name, "action"]}
                        label="Action"
                        rules={[{ required: true, message: "Please select an action!" }]}
                      >
                        <Select placeholder="Select action">
                          <Option value="black_list_search_term">black_list_search_term</Option>
                          <Option value="disable_keyword_product">disable_keyword_product</Option>
                          <Option value="decrease_bid">decrease_bid</Option>
                          <Option value="increase_bid">increase_bid</Option>
                          <Option value="define_bid">define_bid</Option>
                          <Option value="target_search_term">target_search_term</Option>
                          <Option value="apply_bid_rule_per_hour">apply_bid_rule_per_hour</Option>
                        </Select>
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
                      <Form.Item shouldUpdate>
                        {({ getFieldValue }) => {
                          const metric = getFieldValue(["rules", field.name, "metric"]);
                          if (metric === "sale") {
                            return (
                              <Form.Item
                                {...field}
                                name={[field.name, "period"]}
                                label="Period"
                                rules={[{ required: true, message: "Please enter period!" }]}
                              >
                                <Select placeholder="Enter period">
                                  {metric === "sale" &&
                                    <Option value="1d">1 Days</Option>}
                                  <Option value="7d">7 Days</Option>
                                  <Option value="14d">14 Days</Option>
                                  <Option value="30d">30 Days</Option>
                                </Select>
                              </Form.Item>
                            );
                          }
                          else if (metric === "acosClicks") {
                            {

                              return (
                                <Form.Item
                                  {...field}
                                  name={[field.name, "period"]}
                                  label="Period"
                                  rules={[{ required: true, message: "Please enter period!" }]}
                                >
                                  <Select placeholder="Enter period">
                                    {metric === "sale"}
                                    <Option value="7d">7 Days</Option>
                                    <Option value="14d">14 Days</Option>
                                  </Select>
                                </Form.Item>
                              );
                            }
                          }
                          return null;
                        }}
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
          {current > 0 && <Button onClick={prev}>Previous</Button>}
          {current < 1 && <Button type="primary" onClick={next}>Next <ArrowRightOutlined /></Button>}
          {current === 1 && <Button type="primary" htmlType="submit">Submit</Button>}
        </div>
      </Form>
    </Modal>
  );
};
export default EditStrategyPanel;
