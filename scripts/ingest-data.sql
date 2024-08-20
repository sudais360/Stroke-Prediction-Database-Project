USE stroke;  -- Assuming your database is named "stroke"

-- Clear existing data in normalized tables
TRUNCATE TABLE HealthInfo;
TRUNCATE TABLE HealthBehaviours;
TRUNCATE TABLE Symptoms;
TRUNCATE TABLE Diagnoses;
TRUNCATE TABLE Patients;
TRUNCATE TABLE Genders;
TRUNCATE TABLE WorkTypes;
TRUNCATE TABLE ResidenceTypes;
TRUNCATE TABLE LifeStyles;
TRUNCATE TABLE VitalSigns;

-- Insert data into normalized tables from denormalized data
INSERT INTO Genders (Gender)
    SELECT DISTINCT Gender
    FROM denormalised;

INSERT INTO WorkTypes (WorkType)
    SELECT DISTINCT WorkType
    FROM denormalised;

INSERT INTO ResidenceTypes (ResidenceType)
    SELECT DISTINCT ResidenceType
    FROM denormalised;

INSERT INTO Patients (PatientName, Age, Gender, Martialstatus, WorkTypeID, ResidenceTypeID)
    SELECT DISTINCT PatientName, Age, Gender, Martialstatus, WorkTypeID, ResidenceTypeID
    FROM denormalised;

INSERT INTO HealthInfo (PatientID, AverageGlucoseLevel, BodyMassIndex, SmokingStatus, AlcoholIntake, PhysicalActivity, VitalSignsID, HealthBehaviourID, LifeStyleID)
    SELECT PatientID, AverageGlucoseLevel, BodyMassIndex, SmokingStatus, AlcoholIntake, PhysicalActivity, VitalSignsID, HealthBehaviourID, LifeStyleID
    FROM denormalised;

INSERT INTO HealthBehaviours (SmokingStatus, AlcoholIntake, PhysicalActivity)
    SELECT SmokingStatus, AlcoholIntake, PhysicalActivity
    FROM denormalised;

INSERT INTO VitalSigns (BloodPressureLevels, CholesterolLevels)
    SELECT BloodPressureLevels, CholesterolLevels
    FROM denormalised;

INSERT INTO Symptoms (Symptoms)
    SELECT Symptoms
    FROM denormalised;

INSERT INTO Diagnoses (PatientID, Diagnosis)
    SELECT PatientID, Diagnosis
    FROM denormalised;

INSERT INTO LifeStyles (DietaryHabits, StressLevels)
    SELECT DietaryHabits, StressLevels
    FROM denormalised;
