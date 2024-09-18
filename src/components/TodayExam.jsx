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
    selectedSlotName,
  } = useAppContext();
  const [slotNames, setSlotNames] = useState([]);

  const submitSlot = async (slot) => {
    
    await fetchExamData(slots[slot], slot);
  };

  useEffect(() => {
    if (
      classCapacity &&
      deptStrength &&
      letStrength &&
      exams &&
      drop &&
      rejoin &&
      examToday &&
      selectedSlotName
    ) {
      const allocatedData = test(
        classCapacity,
        deptStrength,
        letStrength,
        exams,
        drop,
        rejoin,
        examToday,
        selectedSlotName
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
    selectedSlotName,
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
            defaultValue={selectedSlotName}
            style={{ width: 120 }}
            placeholder="Select Slot"
            onChange={submitSlot}
            options={slotNames.map((slot) => ({ value: slot, label: slot }))}
          />
        </div>
      </FlexContainer>
      <div className="tcwrap">
        {examToday.map((exam, index) => (
          <div key={index} className="tcard">
            <img src="../book.svg" alt="hi" />
            <div className="cdet">
              <h3>{exam}</h3>
              <p>Slot {selectedSlotName}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TodayExam;
