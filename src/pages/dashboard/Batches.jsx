import { Button, DatePicker } from "antd";
import TableContainer from "../../components/TableContainer";
import { ConfigProvider } from "antd";
import { Space } from "antd";
import { message } from "antd";

const Batches = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const yearChanged = (date) => {      
      messageApi.open({
        type: "success",
        content: `Academic year changed to ${date.$y}`,
      });
    };

  return (
    <>
      <div className="academicYear">
        <p>Select Academic year</p>
        <ConfigProvider
          theme={{
            token: {
              colorText: "#07314a",
              fontWeightStrong: 800,
              colorPrimary: "#07314a",
              colorBgContainer: "#f0f9ff",
              colorBgElevated: "#f0f9ff",
            },
          }}
        >
          <Space>
            {contextHolder}

            <DatePicker onChange={yearChanged} picker="year" />
          </Space>
        </ConfigProvider>
      </div>
      <TableContainer />
    </>
  );
};

export default Batches;
