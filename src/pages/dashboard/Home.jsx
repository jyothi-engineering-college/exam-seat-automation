import ClassButton from "../../components/ClassButton";
import DepartmentTable from "../../components/DepartmentTable";
import NoticeTable from "../../components/NoticeTable";
import TodayExam from "../../components/TodayExam";
import "../../styles/home.css";

function Home() {
  return (
    <>
      <div className="tdye">
        <TodayExam />
        <NoticeTable />
        <DepartmentTable />
        <br />
        <ClassButton />
      </div>
    </>
  );
}

export default Home;
