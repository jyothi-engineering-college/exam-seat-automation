import React, { useState, useRef } from "react";
import { Button, Progress, Upload, Popconfirm, message } from "antd";
import { useAppContext } from "../context/AppContext";
import * as XLSX from "xlsx";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import FlexContainer from "./FlexContainer";

const Subjects = () => {
  const [workbook, setWorkbook] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(true);
  const cancelToken = useRef(true); // Ref to manage cancellation
  const [messageApi, contextHolder] = message.useMessage();

  const { uploadSubFile } = useAppContext();

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      setWorkbook(workbook);
    };

    reader.readAsArrayBuffer(file);
    return false;
  };

  const updateProgress = (percent) => {
    setProgress(percent);
  };

  const handleUpload = async () => {
    if (workbook) {
      setUploading(false);
      cancelToken.current = true; // Reset cancel token
      try {
        await uploadSubFile(workbook, updateProgress, cancelToken);
        messageApi.open({
          type: "success",
          content: "File Uploaded Successfully!",
        });
      } catch (error) {
        console.log(error.message);
        messageApi.open({
          type: "error",
          content: error.message,
        });
      } finally {
        setUploading(true);
        setProgress(0);
        setWorkbook(null);
      }
    }
  };

  const handleCancel = () => {
    cancelToken.current = false; // Cancel the upload
  };

  return (
    <>
      {contextHolder}
      Add Subjects
      <div>
        <FlexContainer>
          <Upload
            beforeUpload={handleFileUpload}
            showUploadList={false}
            accept=".xlsx, .xls"
          >
            <Button>Select Subject Workbook</Button>
          </Upload>
          &nbsp;
          <Alert
            message="The file should have columns of DEPT	| SEM | SLOT | COURSE CODE | COURSE NAME |	L	| T	| P |	HOURS | CREDIT  "
            type="info"
          />
        </FlexContainer>
        <Popconfirm
          onConfirm={handleUpload}
          onCancel={handleCancel}
          title="All current subjects data will be OVERWRITTEN!"
          description="Are you sure you want to submit?"
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
        >
          <Button disabled={!workbook}>Submit</Button>
        </Popconfirm>

        {!uploading && (
          <Progress
            percent={progress}
            percentPosition={{ align: "center", type: "outer" }}
            size={[400, 10]}
          />
        )}
      </div>
    </>
  );
};

export default Subjects;
