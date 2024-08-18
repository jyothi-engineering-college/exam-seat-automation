import { Segmented } from "antd";
const NavigationTab = () => (
  <Segmented
    options={["Home", "Exam Dept", "Slots", "Classes", "Yearly"]}
    onChange={(value) => {
      console.log(value); // string
    }}
  />
);
export default NavigationTab;
