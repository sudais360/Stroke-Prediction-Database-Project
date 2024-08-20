USE stroke;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Behaviours;
TRUNCATE TABLE Diagnosis;
TRUNCATE TABLE Genders;
TRUNCATE TABLE HealthParameters;
TRUNCATE TABLE HealthReadings;
TRUNCATE TABLE MaritalStatuses;
TRUNCATE TABLE MedicalHistory;
TRUNCATE TABLE Patients;
TRUNCATE TABLE LifeStyles;
TRUNCATE TABLE ResidenceTypes;
TRUNCATE TABLE Symptoms;
TRUNCATE TABLE HealthIssues;

TRUNCATE TABLE WorkTypes;
SET FOREIGN_KEY_CHECKS = 1;


-- Insert data into normalized tables from denormalized data
-- Insert into Genders
INSERT INTO Genders (Gender)
    SELECT DISTINCT Gender
    FROM denormalised;

-- Insert into WorkTypes
INSERT INTO WorkTypes (WorkType)
    SELECT DISTINCT WorkType
    FROM denormalised;

-- Insert into ResidenceTypes
INSERT INTO ResidenceTypes (ResidenceType)
    SELECT DISTINCT ResidenceType
    FROM denormalised;

-- Insert into MaritalStatuses
INSERT INTO MaritalStatuses (MaritalStatus)
    SELECT DISTINCT MaritalStatus
    FROM denormalised;

-- Insert into Patients
INSERT INTO Patients (PatientID, Age, GenderID, MaritalStatusID, WorkTypeID, ResidenceTypeID)
    SELECT DISTINCT PatientID, Age, G.GenderID, M.MaritalStatusID, W.WorkTypeID, R.ResidenceTypeID
    FROM denormalised D
    INNER JOIN Genders G ON D.Gender = G.Gender
    INNER JOIN MaritalStatuses M ON D.MaritalStatus = M.MaritalStatus
    INNER JOIN WorkTypes W ON D.WorkType = W.WorkType
    INNER JOIN ResidenceTypes R ON D.ResidenceType = R.ResidenceType;


INSERT INTO HealthParameters (Parameter, Unit)
VALUES
    ('Average Glucose Level', 'mg/dL'),
    ('Body Mass Index', 'kg/m^2'),
    ('Blood Pressure Levels', 'mmHg'),
    ('Cholesterol Levels', ''),
    ('Hypertension', ''),
    ('Heart Disease', '');


INSERT INTO HealthReadings (PatientID, ParameterID, Reading)
SELECT
    D.PatientID,
    P.ParameterID,
    CASE
        WHEN P.Parameter = 'Average Glucose Level' THEN NULLIF(D.AverageGlucoseLevel, '')
        WHEN P.Parameter = 'Body Mass Index' THEN NULLIF(D.BodyMassIndex, '')
        WHEN P.Parameter = 'Blood Pressure Levels' THEN NULLIF(D.BloodPressureLevels, '')
        WHEN P.Parameter = 'Cholesterol Levels' THEN NULLIF(D.CholesterolLevels, '')
        WHEN P.Parameter = 'Hypertension' THEN NULLIF(D.Hypertension, '')
        WHEN P.Parameter = 'Heart Disease' THEN NULLIF(D.HeartDisease, '')
    END AS Reading
FROM
    denormalised D
JOIN
    HealthParameters P ON P.Parameter IN ('Average Glucose Level', 'Body Mass Index', 'Blood Pressure Levels', 'Cholesterol Levels','Hypertension','Heart Disease');

-- Inserting sample behaviours
INSERT INTO Behaviours (Behaviour) VALUES
    ('Smoking Status'),
    ('Alcohol Intake'),
    ('Physical Activity'),
    ('Dietary Habits');

-- Inserting data into LifeStyles
INSERT INTO LifeStyles (PatientID, BehaviourID, Reading)
SELECT
    D.PatientID,
    B.BehaviourID,
    CASE
        WHEN B.Behaviour = 'Smoking Status' THEN NULLIF(D.SmokingStatus, '')
        WHEN B.Behaviour = 'Alcohol Intake' THEN NULLIF(D.AlcoholIntake, '')
        WHEN B.Behaviour = 'Physical Activity' THEN NULLIF(D.PhysicalActivity, '')
        WHEN B.Behaviour = 'Dietary Habits' THEN NULLIF(D.DietaryHabits, '')
    END AS Reading
FROM
    denormalised D
JOIN
    Behaviours B ON B.Behaviour IN ('Smoking Status', 'Alcohol Intake', 'Physical Activity', 'Dietary Habits');

INSERT INTO Symptoms (Symptom)
SELECT DISTINCT NULLIF(Symptoms, '')
FROM denormalised;


INSERT INTO HealthIssues (PatientID, SymptomID)
SELECT
    D.PatientID,
    S.SymptomID
FROM
    denormalised D
JOIN
    Symptoms S ON D.Symptoms = S.Symptom;

INSERT INTO Diagnosis  (Diagnosis)
    SELECT DISTINCT Diagnosis
    FROM denormalised;

-- Insert data into MedicalHistory table, avoiding duplicate key violations
INSERT INTO MedicalHistory (PatientID, DiagnosisID, PreviouslyDiagnosed, WithFamilyHistory)
SELECT DISTINCT
    D.PatientID,
    DMD.DiagnosisID,
    MAX(D.StrokeHistory) AS PreviouslyDiagnosed,
    MAX(D.FamilyHistoryOfStroke) AS WithFamilyHistory
FROM
    denormalised D
JOIN
    Diagnosis DMD ON D.Diagnosis = DMD.Diagnosis
GROUP BY D.PatientID, DMD.DiagnosisID;
