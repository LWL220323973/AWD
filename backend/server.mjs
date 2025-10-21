import express from "express";
import mysql from "mysql2";
import fs from "fs";

const server = express();

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

server.use(express.json());

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
server.get("/api/selectMobileOfficeByEnglish", (req, res) => {});

// Select mobile office by Traditional Chinese display
server.get("/api/selectMobileOfficeByTraditionalChinese", (req, res) => {});

// Select mobile office by Simplified Chinese display
server.get("/api/selectMobileOfficeBySimplifiedChinese", (req, res) => {});

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
function selectMobileOfficeByEnglish(officeInfo) {}

//Select mobile office by Traditional Chinese display
function selectMobileOfficeByTraditionalChinese(officeInfo) {}

//Select mobile office by Simplified Chinese display
function selectMobileOfficeBySimplifiedChinese(officeInfo) {}

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
