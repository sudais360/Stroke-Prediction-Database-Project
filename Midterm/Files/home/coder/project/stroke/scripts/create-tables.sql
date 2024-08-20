
USE stroke;


-- Drop Table Statements

DROP TABLE IF EXISTS LifeStyles;
DROP TABLE IF EXISTS MedicalHistory;
DROP TABLE IF EXISTS Diagnosis;
DROP TABLE IF EXISTS HealthIssues;
DROP TABLE IF EXISTS Symptoms;
DROP TABLE IF EXISTS Behaviours;
DROP TABLE IF EXISTS HealthReadings;
DROP TABLE IF EXISTS HealthParameters;
DROP TABLE IF EXISTS Patients;
DROP TABLE IF EXISTS WorkTypes;
DROP TABLE IF EXISTS ResidenceTypes;
DROP TABLE IF EXISTS Genders;
DROP TABLE IF EXISTS MaritalStatuses;

-- Table 2: Genders
CREATE TABLE Genders (
    GenderID INT AUTO_INCREMENT PRIMARY KEY,
    Gender VARCHAR(255)
);

-- Table 3: MaritalStatuses
CREATE TABLE MaritalStatuses (
    MaritalStatusID INT AUTO_INCREMENT PRIMARY KEY,
    MaritalStatus VARCHAR(255)
);

-- Table 4: WorkTypes
CREATE TABLE WorkTypes (
    WorkTypeID INT AUTO_INCREMENT PRIMARY KEY,
    WorkType VARCHAR(255)
);

-- Table 5: ResidenceTypes
CREATE TABLE ResidenceTypes (
    ResidenceTypeID INT AUTO_INCREMENT PRIMARY KEY,
    ResidenceType VARCHAR(255)
);

-- Table 1: Patients
CREATE TABLE Patients (
    PatientID INT PRIMARY KEY,
    Age INT,
    GenderID INT,
    MaritalStatusID INT,
    WorkTypeID INT,
    ResidenceTypeID INT,
    FOREIGN KEY (GenderID) REFERENCES Genders(GenderID),
    FOREIGN KEY (MaritalStatusID) REFERENCES MaritalStatuses(MaritalStatusID),
    FOREIGN KEY (WorkTypeID) REFERENCES WorkTypes(WorkTypeID),
    FOREIGN KEY (ResidenceTypeID) REFERENCES ResidenceTypes(ResidenceTypeID)
);

-- Table 6: HealthParameters
CREATE TABLE HealthParameters (
    ParameterID INT AUTO_INCREMENT PRIMARY KEY,
    Parameter VARCHAR(255),
    Unit VARCHAR(255)
);

-- Table 7: HealthReadings
CREATE TABLE HealthReadings (
    ReadingID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT,
    ParameterID INT,
    Reading VARCHAR(255),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (ParameterID) REFERENCES HealthParameters(ParameterID)
);

-- Table 8: Behaviours
CREATE TABLE Behaviours (
    BehaviourID INT AUTO_INCREMENT PRIMARY KEY,
    Behaviour VARCHAR(255)
);

-- Table 9: Symptoms
CREATE TABLE Symptoms (
    SymptomID INT AUTO_INCREMENT PRIMARY KEY,
    Symptom VARCHAR(255)
);

-- Table 10: HealthIssues
CREATE TABLE HealthIssues (
    HealthIssueID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT,
    SymptomID INT,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (SymptomID) REFERENCES Symptoms(SymptomID)
);

-- Table 11: Diagnosis
CREATE TABLE Diagnosis (
    DiagnosisID INT AUTO_INCREMENT PRIMARY KEY,
    Diagnosis VARCHAR(255)
);

-- Table 12: MedicalHistory
CREATE TABLE MedicalHistory (
    MedicalHistoryID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT,
    DiagnosisID INT,
    PreviouslyDiagnosed INT,
    WithFamilyHistory INT,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (DiagnosisID) REFERENCES Diagnosis(DiagnosisID)
);


-- Table: LifeStyles
CREATE TABLE LifeStyles (
    LifeStyleID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT,
    BehaviourID INT,
    Reading VARCHAR(255),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (BehaviourID) REFERENCES Behaviours(BehaviourID)
);

