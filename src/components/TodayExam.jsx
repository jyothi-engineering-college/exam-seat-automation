import { Select } from "antd";
import FlexContainer from "../components/FlexContainer";
import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { test } from "../utils/seatAllocator";

const TodayExam = () => {
  const {
    fetchExamData,
    fetchslotNames,
    slots,
    classCapacity,
    deptStrength,
    letStrength,
    exams,
    drop,
    rejoin,
    examToday,
    setAllocatedData,
  } = useAppContext();
  const [slotNames, setSlotNames] = useState([]);
  const [slot, setSlot] = useState("");
  const [todayExam, setTodayExam] = useState([]);

  const submitSlot = async (slot) => {
    await fetchExamData(slots[slot]);
    setSlot(slot);
    setTodayExam(slots[slot]);
  };

  useEffect(() => {
    if (
      classCapacity &&
      deptStrength &&
      letStrength &&
      exams &&
      drop &&
      rejoin &&
      examToday
    ) {
      const allocatedData = test(
        classCapacity,
        deptStrength,
        letStrength,
        exams,
        drop,
        rejoin,
        examToday
      );
      setAllocatedData(allocatedData);
    }
  }, [
    classCapacity,
    deptStrength,
    letStrength,
    exams,
    drop,
    rejoin,
    examToday,
  ]);

  useEffect(() => {
    fetchslotNames().then((fetchedSlotNames) => {
      setSlotNames(fetchedSlotNames);
    });
  }, []);

  return (
    <>
      <FlexContainer>
        <div>
          <h3 className="tdhd">Today's Exam</h3>
          <div className="underline"></div>
        </div>
        <div style={{ marginLeft: "450px" }}>
          <Select
            style={{ width: 120 }}
            placeholder="Select Slot"
            onChange={submitSlot}
            options={slotNames.map((slot) => ({ value: slot, label: slot }))}
          />
        </div>
      </FlexContainer>
      <div className="tcwrap">
        {todayExam.map((exam, index) => (
          <div key={index} className="tcard">
            <img src="../book.svg" alt="hi" />
            <div className="cdet">
              <h3>{exam}</h3>
              <p>Slot {slot}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TodayExam;
