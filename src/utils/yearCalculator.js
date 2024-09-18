export const calculateYear = (value, dept, currentYear) => {
  const hasYearPrefix = dept.name.length > 2;
  const deptWithoutYear = hasYearPrefix ? dept.name.slice(2) : dept.name;
  switch (value) {
    case "first_years":
      return { ...dept, name: `${currentYear}${deptWithoutYear}` };
    case "second_years":
      return { ...dept, name: `${currentYear - 1}${deptWithoutYear}` };
    case "third_years":
      return { ...dept, name: `${currentYear - 2}${deptWithoutYear}` };
    case "fourth_years":
      return { ...dept, name: `${currentYear - 3}${deptWithoutYear}` };
    default:
      return dept;
  }
};
