export const filteredData = (data, searchTerm) => {
  
  if (data) {
    return data.filter((item) => {
      const concatenatedValues = Object.values(item).join(" ").toLowerCase();
      const searchWords = searchTerm.toLowerCase().split(" ");

      return searchWords.every((searchWord) =>
        concatenatedValues.includes(searchWord)
      );
    });
  } else {
    return [];
  }
};