import express from "express";
import mysql from "mysql2";
import fs from "fs";
// import https from "https";

const server = express();

const conn = mysql.createConnection({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "awd",
});

server.listen(8888, function () {
  console.log("server started");
});

conn.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

function createPostMobileOffice(officeInfo, updateTime) {
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
  if (updateTime == null || updateTime === undefined || updateTime == "") {
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
      console.log("Data inserted successfully");
    });
  } else {
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
      updateTime,
    ];
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
        return;
      }
      console.log("Data inserted successfully");
    });
  }
}

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
            createPostMobileOffice(item, lastUpdateTime);
          });
        } catch (parseErr) {
          console.error("Error parsing JSON:", parseErr);
        }
      });
    }
  });
});

server.use(express.json());
