USE stroke;

DROP TABLE IF EXISTS denormalised;
CREATE TABLE denormalised (
    PatientID INT,
    Age INT,
    Gender VARCHAR(255),
    Hypertension INT,
    HeartDisease INT,
    MaritalStatus VARCHAR(255),
    WorkType VARCHAR(255),
    ResidenceType VARCHAR(255),
    AverageGlucoseLevel FLOAT,
    BodyMassIndex FLOAT,
    SmokingStatus VARCHAR(255),
    AlcoholIntake VARCHAR(255),
    PhysicalActivity VARCHAR(255),
    StrokeHistory INT,
    FamilyHistoryOfStroke INT,
    DietaryHabits VARCHAR(255),
    StressLevels VARCHAR(255),
    BloodPressureLevels VARCHAR(255),
    CholesterolLevels VARCHAR(255),
    Symptoms VARCHAR(255),
    Diagnosis VARCHAR(255)
);

-- Load data into denormalised table
LOAD DATA INFILE "/home/coder/project/stroke/data/main_stroke_record.csv"
INTO TABLE denormalised
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

