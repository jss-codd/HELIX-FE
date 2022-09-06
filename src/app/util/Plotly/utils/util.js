import * as XLSX from "xlsx/xlsx.mjs";

export function xlsFileReader(url, callback) {
  fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((data) => {
      if (
        data.type === "application/vnd.ms-excel" ||
        data.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        var reader = new FileReader();
        if (reader.readAsBinaryString) {
          reader.onload = function (e) {
            try {
              const newData = e.target.result;
              var workbook = XLSX.read(newData, {
                type: "binary",
                cellDates: true,
              });

              const allSheets = {};
              workbook.SheetNames.forEach((sheet) => {
                let rowObject = XLSX.utils.sheet_to_row_object_array(
                  workbook.Sheets[sheet]
                );
                let jsonObject = JSON.stringify(rowObject);
                const jsonDataParse = JSON.parse(jsonObject);

                const jsonDataMap = jsonDataParse.map((curElem) => {
                  Object.entries(curElem).map((curElem2, index2) => {
                    const key = curElem2[0]
                      .trim()
                      .toLowerCase()
                      .replace(/([^A-Z0-9]+)(.)/gi, function (match) {
                        return arguments[2].toUpperCase();
                      });
                    delete curElem[curElem2[0]];
                    curElem[key] = curElem2[1];
                  });
                  return curElem;
                });
                const sheetnewNAME = sheet
                  .trim()
                  .toLowerCase()
                  .replace(/([^A-Z0-9]+)(.)/gi, function (match) {
                    return arguments[2].toUpperCase();
                  });

                allSheets[sheetnewNAME] = jsonDataMap;

                //   setLoader(true);
                //   setJsonCopyData(jsonDataMap);
                //   var today = moment(new Date()).format("YYYY-MM-DD");
                //   setEndDateFilter(today);
                //   setStartDateFilter(today);
              });

              callback(allSheets);
            } catch (error) {
              alert(error?.message);
            }
          };
          reader.onerror = (e) => {
            alert(e?.message);
          };
          reader.readAsBinaryString(data);
        }
      } else {
        alert("File path is not exist.");
      }
    });
}
export function filterCxoWithoutDate(filterKeys, data ) {
  const filterDateData = data?.filter?.((dt) => {
    return (
      (filterKeys.city ? dt.city?.toString() === filterKeys.city : true) &&
      (filterKeys.country
        ? dt.country?.toString() === filterKeys.country
        : true) &&
      (filterKeys.businessParks
        ? dt.businessParks?.toString() === filterKeys.businessParks
        : true) &&
      (filterKeys.allTowers
        ? dt.allTowers?.toString() === filterKeys.allTowers
        : true) &&
      (filterKeys.tenants ? dt.tenants?.toString() === filterKeys.tenants : true)
    );
  });
  return filterDateData;
}

export const ChartType = [
  {
    name: "Pie",
  },
  {
    name: "Line",
  },
  {
    name: "Bar",
  },
  {
    name: "Bubble",
  },
  // {
  //   name: "Map",
  // },
];

export const ChartModes = [
  {
    name: "single data",
    value: "single"
  },
  {
    name: "group data",
    value: "group"
  },
  {
    name: "stack data",
    value: "stack"
  },
];