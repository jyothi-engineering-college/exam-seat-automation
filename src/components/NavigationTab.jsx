import { Segmented } from "antd";
import "./navtab.css";
const NavigationTab = () => (
  <Segmented
  className="navigationTab"
    options={["Home", "Exam Dept", "Slots", "Classes", "Yearly"]}
    onChange={(value) => {
      console.log(value); // string
    }}
  />
);
export default NavigationTab;
