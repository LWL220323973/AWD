import express from "express";
import mysql from "mysql2";
import fs from "fs";

const server = express();

// CORS middleware - must be before other middleware
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// JSON middleware
server.use(express.json());

const conn = mysql.createConnection({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "awd",
});

server.listen(8080, function () {
  console.log("server started");
  // initializeFileOperations();
});

conn.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Insert mobile office
server.post("/api/insertMobileOffice", (req, res) => {});

// Delete mobile office by officeID
server.delete("/api/deleteMobileOffice", (req, res) => {});

// Update mobile office by officeID
server.put("/api/updateMobileOffice", (req, res) => {});

// Select mobile office by English display
server.post("/api/selectMobileOfficeByEnglish", (req, res) => {
  const searchParams = req.body;
  selectMobileOfficeByEnglish(searchParams, res);
});

// Select mobile office by Traditional Chinese display
server.post("/api/selectMobileOfficeByTraditionalChinese", (req, res) => {
  const searchParams = req.body;
  selectMobileOfficeByTraditionalChinese(searchParams, res);
});

// Select mobile office by Simplified Chinese display
server.post("/api/selectMobileOfficeBySimplifiedChinese", (req, res) => {
  const searchParams = req.body;
  selectMobileOfficeBySimplifiedChinese(searchParams, res);
});

//
//SQL functions
//

// Insert mobile office
function insertPostMobileOffice(officeInfo) {
  const {
    mobileCode,
    locationTC,
    locationSC,
    locationEN,
    addressTC,
    addressSC,
    addressEN,
    nameTC,
    nameSC,
    nameEN,
    districtTC,
    districtSC,
    districtEN,
    openHour,
    closeHour,
    dayOfWeekCode,
    latitude,
    longitude,
    seq,
  } = officeInfo;
  const sql =
    "INSERT INTO `post_mobile_office`( `mobile_code`, `location_tc`, `location_sc`, `location_en`, `address_tc`, `address_sc`, `address_en`, `name_tc`, `name_sc`, `name_en`, `district_tc`, `district_sc`, `district_en`, `open_hour`, `close_hour`, `day_of_week_code`, `latitude`, `longitude`, `seq`)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    mobileCode,
    locationTC,
    locationSC,
    locationEN,
    addressTC,
    addressSC,
    addressEN,
    nameTC,
    nameSC,
    nameEN,
    districtTC,
    districtSC,
    districtEN,
    openHour,
    closeHour,
    dayOfWeekCode,
    latitude,
    longitude,
    seq,
  ];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
      return;
    }
    console.log("Data inserted successfully: ", values);
  });
}

// Delete mobile office by officeID
function deleteMobileOffice(officeID) {
  const sql = "DELETE FROM `post_mobile_office` WHERE id = ?";
  const values = [officeID];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error deleting data:", err);
      return;
    }
    console.log("Data deleted successfully for officeID: ", officeID);
  });
}

// Update mobile office by officeID
function updateMobileOffice(officeID, officeInfo) {}

//Select mobile office by English display
function selectMobileOfficeByEnglish(searchParams, res) {
  let sql =
    "SELECT id, mobile_code, location_en, address_en, name_en, district_en, open_hour, close_hour, day_of_week_code, latitude, longitude FROM `post_mobile_office` WHERE 1=1";
  const values = [];

  // Add search conditions
  if (searchParams.location !== undefined) {
    sql += " AND (location_en LIKE ? OR location_tc LIKE ? OR location_sc LIKE ?)";
    values.push(`%${searchParams.location}%`);
    values.push(`%${searchParams.location}%`);
    values.push(`%${searchParams.location}%`);
  }

  if (
    searchParams.district !== undefined 
  ) {
    sql += " AND district_en = ?";
    values.push(searchParams.district.trim());
    values.push(searchParams.district.trim());
    values.push(searchParams.district.trim());
  }

  if (searchParams.address !== undefined) {
    sql += " AND (address_en LIKE ? OR address_tc LIKE ? OR address_sc LIKE ?)";
    values.push(`%${searchParams.address.trim()}%`);
    values.push(`%${searchParams.address.trim()}%`);
    values.push(`%${searchParams.address.trim()}%`);
  }

  if (searchParams.openHour !== undefined) {
    sql += " AND open_hour >= ? ";
    values.push(searchParams.openHour);
  }

  if (searchParams.closeHour !== undefined) {
    sql += " AND close_hour <= ? ";
    values.push(searchParams.closeHour);
  }

  console.log('Executing SQL:', sql);
  console.log('With values:', values);
  
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error selecting data:", err);
      res.status(500).json({ error: "Database query failed", details: err.message });
      return;
    }
    res.json({ success: true, data: results });
  });
}

//Select mobile office by Traditional Chinese display
function selectMobileOfficeByTraditionalChinese(searchParams, res) {
  let sql =
    "SELECT id, mobile_code, location_tc, address_tc, name_tc, district_tc, open_hour, close_hour, day_of_week_code, latitude, longitude FROM `post_mobile_office` WHERE 1=1";
  const values = [];

  // Add search conditions
  if (searchParams.location !== undefined) {
    sql += " AND (location_en LIKE ? OR location_tc LIKE ? OR location_sc LIKE ?)";
    values.push(`%${searchParams.location}%`);
    values.push(`%${searchParams.location}%`);
    values.push(`%${searchParams.location}%`);
  }

  if (
    searchParams.district !== undefined 
  ) {
    sql += " AND district_en = ?";
    values.push(searchParams.district.trim());
  }

  if (searchParams.address !== undefined) {
    sql += " AND (address_en LIKE ? OR address_tc LIKE ? OR address_sc LIKE ?)";
    values.push(`%${searchParams.address.trim()}%`);
    values.push(`%${searchParams.address.trim()}%`);
    values.push(`%${searchParams.address.trim()}%`);
  }

  if (searchParams.openHour !== undefined) {
    sql += " AND open_hour >= ? ";
    values.push(searchParams.openHour);
  }

  if (searchParams.closeHour !== undefined) {
    sql += " AND close_hour <= ? ";
    values.push(searchParams.closeHour);
  }

  console.log('Executing SQL:', sql);
  console.log('With values:', values);
  
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error selecting data:", err);
      res.status(500).json({ error: "Database query failed", details: err.message });
      return;
    }
    res.json({ success: true, data: results });
  });
}

//Select mobile office by Simplified Chinese display
function selectMobileOfficeBySimplifiedChinese(searchParams, res) {
  let sql =
    "SELECT id, mobile_code, location_sc, address_sc, name_sc, district_sc, open_hour, close_hour, day_of_week_code, latitude, longitude FROM `post_mobile_office` WHERE 1=1";
  const values = [];

  // Add search conditions
  if (searchParams.location !== undefined) {
    sql += " AND (location_en LIKE ? OR location_tc LIKE ? OR location_sc LIKE ?)";
    values.push(`%${searchParams.location}%`);
    values.push(`%${searchParams.location}%`);
    values.push(`%${searchParams.location}%`);
  }

  if (searchParams.district !== undefined) {
    sql += " AND district_en = ?";
    values.push(searchParams.district.trim());
    values.push(searchParams.district.trim());
    values.push(searchParams.district.trim());
  }

  if (searchParams.address !== undefined) {
    sql += " AND (address_en LIKE ? OR address_tc LIKE ? OR address_sc LIKE ?)";
    values.push(`%${searchParams.address.trim()}%`);
    values.push(`%${searchParams.address.trim()}%`);
    values.push(`%${searchParams.address.trim()}%`);
  }

  if (searchParams.openHour !== undefined) {
    sql += " AND open_hour >= ? ";
    values.push(searchParams.openHour);
  }

  if (searchParams.closeHour !== undefined) {
    sql += " AND close_hour <= ? ";
    values.push(searchParams.closeHour);
  }

  console.log('Executing SQL (SC):', sql);
  console.log('With values:', values);
  
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error selecting data:", err);
      res.status(500).json({ error: "Database query failed", details: err.message });
      return;
    }
    res.json({ success: true, data: results });
  });
}

//Initialize file operations to read JSON files and insert data into the database
function initializeFileOperations() {
  fs.readdir("../datasource", (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
    files.forEach((file) => {
      if (file.endsWith(".json")) {
        fs.readFile(`../datasource/${file}`, "utf8", (err, data) => {
          if (err) {
            console.error("Error reading JSON file:", err);
            return;
          }
          try {
            const jsonData = JSON.parse(data);
            const lastUpdateTime = jsonData.lastUpdateTime;
            jsonData.data.forEach((item) => {
              const sql =
                "INSERT INTO `post_mobile_office`( `mobile_code`, `location_tc`, `location_sc`, `location_en`, `address_tc`, `address_sc`, `address_en`, `name_tc`, `name_sc`, `name_en`, `district_tc`, `district_sc`, `district_en`, `open_hour`, `close_hour`, `day_of_week_code`, `latitude`, `longitude`, `seq`,`last_update_time`)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
              const values = [
                mobileCode,
                locationTC,
                locationSC,
                locationEN,
                addressTC,
                addressSC,
                addressEN,
                nameTC,
                nameSC,
                nameEN,
                districtTC,
                districtSC,
                districtEN,
                openHour,
                closeHour,
                dayOfWeekCode,
                latitude,
                longitude,
                seq,
                lastUpdateTime,
              ];
              conn.query(sql, values, (err, results) => {
                if (err) {
                  console.error("Error inserting data:", err);
                  return;
                }
                console.log("Data inserted successfully: ", values);
              });
            });
          } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
          }
        });
      }
    });
  });
}
