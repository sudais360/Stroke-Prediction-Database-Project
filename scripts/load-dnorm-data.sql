USE stroke;

DROP TABLE IF EXISTS denormalised;

CREATE TABLE denormalised  (
    PatientID INT,
    Age INT,
    Gender VARCHAR(16),
    Hypertension VARCHAR(3),
    HeartDisease VARCHAR(3),
    MaritalStatus VARCHAR(32),
    WorkType VARCHAR(64),
    ResidenceType VARCHAR(64),
    AverageGlucoseLevel FLOAT,
    BMILevel FLOAT,
    SmokingStatus VARCHAR(32),
    AlcoholIntake VARCHAR(32),
    PhysicalActivity VARCHAR(32),
    StrokeHistory VARCHAR(3),
    FamilyHistoryOfStroke VARCHAR(3),
    DietaryHabits VARCHAR(64),
    StressLevels VARCHAR(32),
    BloodPressureLevels VARCHAR(32),
    CholesterolLevels VARCHAR(32),
    PRIMARY KEY (PatientID)
);

LOAD DATA INFILE '/home/coder/project/suicides/data/stroke_prediction_dataset.csv'
INTO TABLE denormalised
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS (Patient ID, Patient Name, Age, Gender, Hypertension,
       Heart Disease, Marital Status, Work Type, Residence Type,
       Average Glucose Level, Body Mass Index (BMI), Smoking Stats,
       Alcohol Intake, Physical Activity, Stroke History,
       Family History of Stroke, Dietary Habits, Stress Levels,
       Blood Pressure Levels, Cholesterol Levels, Symptoms, Diagnosis)
       
 /*      
       
LOAD DATA INFILE '/home/coder/project/suicides/data/stroke_prediction_dataset.csv'
INTO TABLE stroke.denormalised
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS 
(
    `Patient ID`, `Patient Name`, Age, Gender, Hypertension,
    `Heart Disease`, `Marital Status`, `Work Type`, `Residence Type`,
    `Average Glucose Level`, `Body Mass Index (BMI)`, `Smoking Status`,
    `Alcohol Intake`, `Physical Activity`, `Stroke History`,
    `Family History of Stroke`, `Dietary Habits`, `Stress Levels`,
    `Blood Pressure Levels`, `Cholesterol Levels`, Symptoms, Diagnosis
);

*/