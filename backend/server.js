import express from "express";
import mysql from "mysql2";
import fs from "fs";

const server = express();

// CORS middleware - must be before other middleware
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// JSON middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const conn = mysql.createConnection({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "awd",
});

server.listen(8080, function () {
  console.log("server started");
  initializeFileOperations();
});

conn.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Insert mobile office
server.post("/api/insertMobilePostOffice", (req, res) => {});

// Delete mobile office by officeID
server.delete("/api/deleteMobilePostOffice", (req, res) => {});

// Update mobile office by officeID
server.put("/api/updateMobilePostOffice", (req, res) => {});

//select mobile office
server.get("/api/selectMobilePostOffice", (req, res) => {
  const searchParams = req.query ? req.query : "";
  selectMobilePostOffice(searchParams, res);
});

//Select mobile office by ID
server.get("/api/selectMobilePostOfficeByID", (req, res) => {
  const searchParams = req.query ? req.query : "";
  selectMobilePostOfficeByID(searchParams, res);
});

//Select mobile office name
server.get("/api/selectMobilePostOfficeName", (req, res) => {
  selectMobilePostOfficeName(res);
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
  if (values.includes(undefined) || values.includes("")) {
    res.status(444).json({
      error: "Missing or invalid parameters",
      details: "All fields are required",
      message: "Please provide valid values for all parameters",
    });
    return;
  } else {
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
        return;
      }
      console.log("Data inserted successfully: ", values);
    });
  }
}

// Delete mobile office by officeID
function deleteMobilePostOffice(officeID) {
  const sql = "DELETE FROM `post_mobile_office` WHERE id = ?";
  const values = [officeID];
  conn.query(sql, values, (err, res) => {
    if (officeID === undefined || officeID.trim() === "") {
      res.status(444).json({
        details: "officeID",
        message: "Please provide a valid value for the officeID parameter",
        error: "Missing officeID parameter",
      });
      return;
    }
    if (err) {
      console.error("Error deleting data:", err);
      return;
    }
    res.json({
      success: true,
      details: officeID,
      message: "Data deleted successfully for officeID: " + officeID,
    });
    console.log("Data deleted successfully for officeID: ", officeID);
  });
}

// Update mobile office by officeID
function updateMobilePostOffice(officeID, officeInfo) {}

//Select mobile office
function selectMobilePostOffice(searchParams, res) {
  let sql = "SELECT * FROM `post_mobile_office` WHERE 1=1 ";
  const values = [];
  const errParams = [];

  // Add search conditions
  if (searchParams.location !== undefined) {
    if (searchParams.location.trim() === "") {
      errParams.push("location");
    } else {
      sql +=
        " AND (location_en LIKE ? OR location_tc LIKE ? OR location_sc LIKE ?)";
      values.push(`%${searchParams.location}%`);
      values.push(`%${searchParams.location}%`);
      values.push(`%${searchParams.location}%`);
    }
  }

  if (searchParams.district !== undefined) {
    if (searchParams.district.trim() === "") {
      errParams.push("district");
    } else {
      sql += " AND district_en = ?";
      values.push(searchParams.district.trim());
    }
  }

  if (searchParams.address !== undefined) {
    if (searchParams.address.trim() === "") {
      errParams.push("address");
    } else {
      sql +=
        " AND (address_en LIKE ? OR address_tc LIKE ? OR address_sc LIKE ?)";
      values.push(`%${searchParams.address.trim()}%`);
      values.push(`%${searchParams.address.trim()}%`);
      values.push(`%${searchParams.address.trim()}%`);
    }
  }

  if (searchParams.openHour !== undefined) {
    if (searchParams.openHour.trim() === "") {
      errParams.push("openHour");
    } else {
      sql += " AND open_hour <= ? ";
      values.push(searchParams.openHour);
    }
  }

  if (searchParams.closeHour !== undefined) {
    if (searchParams.closeHour.trim() === "") {
      errParams.push("closeHour");
    } else {
      sql += " AND close_hour >= ? ";
      values.push(searchParams.closeHour);
    }
  }

  console.log("Executing SQL:", sql);
  console.log("With values:", values);

  if (errParams.length > 0) {
    res.status(444).json({
      error: "Missing or invalid search parameters",
      details: errParams,
      message:
        "Please provide valid values for the listed parameters: " +
        errParams.join(", "),
    });
    return;
  } else {
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error selecting data:", err);
        res.status(500).json({
          error: "Database query failed",
          details: err.message,
          message: "Selected Error",
        });
        return;
      }
      res.json({
        success: true,
        data: results,
        message: "Selected records " + results.length,
      });
    });
  }
}

//Select mobile office by ID
function selectMobilePostOfficeByID(searchParams, res) {
  const sql = "SELECT * FROM `post_mobile_office` WHERE id = ?";
  const values = [searchParams.id];
  conn.query(sql, values, (err, results) => {
    if (values[0] === undefined || values[0].trim() === "") {
      res.status(444).json({
        error: "Missing search parameter",
        details: "ID",
        message: "Please provide a valid value for the ID parameter",
      });
      return;
    }
    if (err) {
      console.error("Error selecting data by ID:", err);
      res.status(500).json({
        error: "Database query failed",
        details: err.message,
        message: "Select ID Not Exist",
      });
      return;
    }
    res.json({
      success: true,
      data: results,
      message: "Selected record success",
    });
  });
}

//Select mobile office name
function selectMobilePostOfficeName(res) {
  const sql =
    "SELECT mobile_code, name_tc, name_sc, name_en FROM `post_mobile_office` GROUP BY name_tc, name_sc, name_en";
  conn.query(sql, (err, results) => {
    if (err) {
      console.error("Error selecting mobile office names:", err);
      res
        .status(500)
        .json({ error: "Database query failed", details: err.message });
      return;
    } else {
      res.json({
        success: true,
        data: results,
        message: "Selected office names success",
      });
    }
  });
}

//Initialize file operations to read JSON files and insert data into the database
function initializeFileOperations() {
  conn.query("DROP TABLE IF EXISTS `post_mobile_office`", (err, results) => {
    if (err) {
      console.error("Error deleting existing data:", err);
      return;
    }
    console.log("Existing database deleted successfully.");
  });

  fs.readFile(
    "../Information/create_mobile_office_table.sql",
    "utf8",
    (err, sql) => {
      if (err) {
        console.error("Error reading SQL file:", err);
        return;
      }
      conn.query(sql, (err, results) => {
        if (err) {
          console.error("Error creating table:", err);
          return;
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
                  const lastUpdateTime = jsonData.lastUpdateDate;
                  jsonData.data.forEach((item) => {
                    const sql =
                      "INSERT INTO `post_mobile_office`( `mobile_code`, `location_tc`, `location_sc`, `location_en`, `address_tc`, `address_sc`, `address_en`, `name_tc`, `name_sc`, `name_en`, `district_tc`, `district_sc`, `district_en`, `open_hour`, `close_hour`, `day_of_week_code`, `latitude`, `longitude`, `seq`,`last_update_time`)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    const values = [
                      item.mobileCode,
                      item.locationTC,
                      item.locationSC,
                      item.locationEN,
                      item.addressTC,
                      item.addressSC,
                      item.addressEN,
                      item.nameTC,
                      item.nameSC,
                      item.nameEN,
                      item.districtTC,
                      item.districtSC,
                      item.districtEN,
                      item.openHour,
                      item.closeHour,
                      item.dayOfWeekCode,
                      item.latitude,
                      item.longitude,
                      item.seq,
                      lastUpdateTime,
                    ];
                    conn.query(sql, values, (err, results) => {
                      if (err) {
                        console.error("Error inserting data:", err);
                        return;
                      }
                      // console.log("Data inserted successfully: ", values);
                    });
                  });
                } catch (parseErr) {
                  console.error("Error parsing JSON:", parseErr);
                }
              });
            }
          });
        });
      });
    }
  );
}
