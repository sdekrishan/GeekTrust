const fs = require("fs")

const filename = process.argv[2]

fs.readFile(filename, "utf8", (err, data) => {
  let mainData = data.trim().toString().split("\n");
  let centralData = mainData.filter(el=>el.includes('CENTRAL')).splice(0,7);
  let airportData = mainData.filter(el=>el.includes('AIRPORT')).splice(0,6);
  let balanceData = mainData.filter(el=>el.includes('BALANCE'))
  
  console.log(centralData,airportData,balanceData)
})
