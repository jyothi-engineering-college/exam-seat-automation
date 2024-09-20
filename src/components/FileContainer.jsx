import { QuestionCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Popconfirm, Progress, Upload } from "antd";
import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useAppContext } from "../context/AppContext";
import FlexContainer from "./FlexContainer";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";

const FileContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { destination } = queryString.parse(location.search);

  const [workbook, setWorkbook] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(true);
  const cancelToken = useRef(true); // Ref to manage cancellation

  const { uploadSubFile, uploadExamhallFile } = useAppContext();

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
    try {
      if (workbook) {
        setUploading(false);
        cancelToken.current = true;
        if (destination === "subjectsform") {
          await uploadSubFile(workbook, updateProgress, cancelToken);
          setTimeout(() => navigate("/subjects"), 600);
        } else if (destination === "examhallform") {
          await uploadExamhallFile(workbook, updateProgress, cancelToken);
          setTimeout(() => navigate("/exam-halls"), 600);
        }
        setUploading(true);

        setProgress(0);
        setWorkbook(null);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleCancel = () => {
    cancelToken.current = false; // Cancel the upload
  };

  return (
    <>
      {destination === "subjectsform" ? "Add Subjects" : "Add Exam Halls"}
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
          {destination === "subjectsform" ? (
            <Alert
              message="The file should have columns of DEPT	| SEM | SLOT | COURSE CODE | COURSE NAME |	L	| T	| P |	HOURS | CREDIT  "
              type="info"
            />
          ) : (
            <Alert
              message="The file should have columns of Semester	| Classroom | No:of desks | Department
 "
              type="info"
            />
          )}
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

export default FileContainer;
