const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const mustacheExpress = require('mustache-express');
const env = require('dotenv').config();

const app = express();
const port = 3000;

// Define a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: env.parsed.HOST,
    user: env.parsed.USER_NAME,
    password: env.parsed.PASSWORD,
    database: env.parsed.DATABASE
});

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', './templates');
app.use(bodyParser.urlencoded({ extended: true }));


//---------------HOME-----------------
app.get('/home', function (req, res) {
    res.render('home');
});



//---------------stroke-risk-analysis-1-----------------
app.get('/stroke-risk-analysis-1', function (req, res) {
    const queryHealthy = `
SELECT
    G.Gender,
    COALESCE(COUNT(*), 0) AS 'PatientsCount',
    (COALESCE(COUNT(*), 0) / 15000.0) * 100 AS 'PercentageOfTotal'
FROM Patients P
LEFT JOIN Genders G ON P.GenderID = G.GenderID
LEFT JOIN LifeStyles LS1 ON P.PatientID = LS1.PatientID
    AND LS1.BehaviourID IN (SELECT BehaviourID FROM Behaviours WHERE Behaviour = 'Smoking Status' AND LS1.Reading = 'Non-smoker')
LEFT JOIN LifeStyles LS2 ON P.PatientID = LS2.PatientID
    AND LS2.BehaviourID IN (SELECT BehaviourID FROM Behaviours WHERE Behaviour = 'Alcohol Intake' AND LS2.Reading = 'Never')
LEFT JOIN LifeStyles LS3 ON P.PatientID = LS3.PatientID
    AND LS3.BehaviourID IN (SELECT BehaviourID FROM Behaviours WHERE Behaviour = 'Physical Activity' AND LS3.Reading = 'High')
LEFT JOIN MedicalHistory MH ON P.PatientID = MH.PatientID
    AND MH.DiagnosisID = (SELECT DiagnosisID FROM Diagnosis WHERE Diagnosis = 'Stroke')
WHERE LS1.BehaviourID IS NOT NULL AND LS2.BehaviourID IS NOT NULL AND LS3.BehaviourID IS NOT NULL AND MH.DiagnosisID IS NOT NULL
GROUP BY G.Gender
UNION
SELECT
    'Total' AS Gender,
    COALESCE(COUNT(*), 0) AS 'PatientsCount',
    (COALESCE(COUNT(*), 0) / 15000.0) * 100 AS 'PercentageOfTotal'
FROM Patients P
LEFT JOIN Genders G ON P.GenderID = G.GenderID
LEFT JOIN LifeStyles LS1 ON P.PatientID = LS1.PatientID
    AND LS1.BehaviourID IN (SELECT BehaviourID FROM Behaviours WHERE Behaviour = 'Smoking Status' AND LS1.Reading = 'Non-smoker')
LEFT JOIN LifeStyles LS2 ON P.PatientID = LS2.PatientID
    AND LS2.BehaviourID IN (SELECT BehaviourID FROM Behaviours WHERE Behaviour = 'Alcohol Intake' AND LS2.Reading = 'Never')
LEFT JOIN LifeStyles LS3 ON P.PatientID = LS3.PatientID
    AND LS3.BehaviourID IN (SELECT BehaviourID FROM Behaviours WHERE Behaviour = 'Physical Activity' AND LS3.Reading = 'High')
LEFT JOIN MedicalHistory MH ON P.PatientID = MH.PatientID
    AND MH.DiagnosisID = (SELECT DiagnosisID FROM Diagnosis WHERE Diagnosis = 'Stroke')
WHERE LS1.BehaviourID IS NOT NULL AND LS2.BehaviourID IS NOT NULL AND LS3.BehaviourID IS NOT NULL AND MH.DiagnosisID IS NOT NULL`;
    
    const queryUnhealthy = `
SELECT
    G.Gender,
    COALESCE(COUNT(*), 0) AS 'PatientsCount',
    (COALESCE(COUNT(*), 0) / 15000.0) * 100 AS 'PercentageOfTotal'
FROM Patients P
LEFT JOIN Genders G ON P.GenderID = G.GenderID
LEFT JOIN LifeStyles LS1 ON P.PatientID = LS1.PatientID
    AND LS1.BehaviourID IN (SELECT BehaviourID FROM Behaviours WHERE Behaviour = 'Smoking Status' AND LS1.Reading = 'Currently Smokes')
LEFT JOIN LifeStyles LS2 ON P.PatientID = LS2.PatientID
    AND LS2.BehaviourID IN (SELECT BehaviourID FROM Behaviours WHERE Behaviour = 'Alcohol Intake' AND LS2.Reading = 'Frequent Drinker')
LEFT JOIN LifeStyles LS3 ON P.PatientID = LS3.PatientID
    AND LS3.BehaviourID IN (SELECT BehaviourID FROM Behaviours WHERE Behaviour = 'Physical Activity' AND LS3.Reading = 'Low')
LEFT JOIN MedicalHistory MH ON P.PatientID = MH.PatientID
    AND MH.DiagnosisID = (SELECT DiagnosisID FROM Diagnosis WHERE Diagnosis = 'Stroke')
WHERE LS1.BehaviourID IS NOT NULL AND LS2.BehaviourID IS NOT NULL AND LS3.BehaviourID IS NOT NULL AND MH.DiagnosisID IS NOT NULL
GROUP BY G.Gender
UNION
SELECT
    'Total' AS Gender,
    COALESCE(COUNT(*), 0) AS 'PatientsCount',
    (COALESCE(COUNT(*), 0) / 15000.0) * 100 AS 'PercentageOfTotal'
FROM Patients P
LEFT JOIN Genders G ON P.GenderID = G.GenderID
LEFT JOIN LifeStyles LS1 ON P.PatientID = LS1.PatientID
    AND LS1.BehaviourID IN (SELECT BehaviourID FROM Behaviours WHERE Behaviour = 'Smoking Status' AND LS1.Reading = 'Currently Smokes')
LEFT JOIN LifeStyles LS2 ON P.PatientID = LS2.PatientID
    AND LS2.BehaviourID IN (SELECT BehaviourID FROM Behaviours WHERE Behaviour = 'Alcohol Intake' AND LS2.Reading = 'Frequent Drinker')
LEFT JOIN LifeStyles LS3 ON P.PatientID = LS3.PatientID
    AND LS3.BehaviourID IN (SELECT BehaviourID FROM Behaviours WHERE Behaviour = 'Physical Activity' AND LS3.Reading = 'Low')
LEFT JOIN MedicalHistory MH ON P.PatientID = MH.PatientID
    AND MH.DiagnosisID = (SELECT DiagnosisID FROM Diagnosis WHERE Diagnosis = 'Stroke')
WHERE LS1.BehaviourID IS NOT NULL AND LS2.BehaviourID IS NOT NULL AND LS3.BehaviourID IS NOT NULL AND MH.DiagnosisID IS NOT NULL`;

    pool.query(queryHealthy, function (error, healthyResults) {
        if (error) throw error;

        pool.query(queryUnhealthy, function (error, unhealthyResults) {
            if (error) throw error;

            res.render('stroke-risk-analysis-1', { 
                healthy: healthyResults, 
                unhealthy: unhealthyResults 
            });
        });
    });
});

//---------------stroke-risk-analysis-2-----------------
app.get('/stroke-risk-analysis-2', function (req, res) {
    const queryAnalysisTwo = `
SELECT
    'Family got stroke but patient doesn''t have a stroke' AS \`Group\`,
    COUNT(*) AS 'PatientsCount',
    (COUNT(*) / (SELECT COUNT(*) FROM Patients)) * 100 AS 'Percentage'
FROM Patients P
LEFT JOIN MedicalHistory MH ON P.PatientID = MH.PatientID
WHERE MH.WithFamilyHistory = 1 AND MH.DiagnosisID = 2

UNION

SELECT
    'Family doesn''t have a stroke, but the patient has a stroke' AS \`Group\`,
    COUNT(*) AS 'PatientsCount',
    (COUNT(*) / (SELECT COUNT(*) FROM Patients)) * 100 AS 'Percentage'
FROM Patients P
LEFT JOIN MedicalHistory MH ON P.PatientID = MH.PatientID
WHERE MH.WithFamilyHistory = 0 AND MH.DiagnosisID = 1

UNION

SELECT
    'Both family and patient don''t have a stroke' AS \`Group\`,
    COUNT(*) AS 'PatientsCount',
    (COUNT(*) / (SELECT COUNT(*) FROM Patients)) * 100 AS 'Percentage'
FROM Patients P
LEFT JOIN MedicalHistory MH ON P.PatientID = MH.PatientID
WHERE MH.WithFamilyHistory = 0 AND MH.DiagnosisID = 2

UNION

SELECT
    'Both family and patient have a stroke' AS \`Group\`,
    COUNT(*) AS 'PatientsCount',
    (COUNT(*) / (SELECT COUNT(*) FROM Patients)) * 100 AS 'Percentage'
FROM Patients P
LEFT JOIN MedicalHistory MH ON P.PatientID = MH.PatientID
WHERE MH.WithFamilyHistory = 1 AND MH.DiagnosisID = 1;`;

    pool.query(queryAnalysisTwo, function (error, results) {
        if (error) throw error;

        res.render('stroke-risk-analysis-2', { data: results });
    });
});

//---------------stroke-risk-analysis-3-----------------
app.get('/stroke-risk-analysis-3', function (req, res) {
    const queryDietaryHabits = `
    SELECT
        'Dietary Habit' AS 'Group',
        LS.Reading AS 'Dietary Habit',
        COALESCE(COUNT(*), 0) AS 'TotalPatients',
        COALESCE(SUM(CASE WHEN MH.DiagnosisID = (SELECT DiagnosisID FROM Diagnosis WHERE Diagnosis = 'Stroke') THEN 1 ELSE 0 END), 0) AS 'StrokePatients',
        (COALESCE(SUM(CASE WHEN MH.DiagnosisID = (SELECT DiagnosisID FROM Diagnosis WHERE Diagnosis = 'Stroke') THEN 1 ELSE 0 END), 0) / COALESCE(COUNT(*), 0)) * 100 AS 'PercentageOfStrokePatients'
    FROM Patients P
    LEFT JOIN LifeStyles LS ON P.PatientID = LS.PatientID
        AND LS.BehaviourID IN (SELECT BehaviourID FROM Behaviours WHERE Behaviour = 'Dietary Habits')
    LEFT JOIN MedicalHistory MH ON P.PatientID = MH.PatientID
    GROUP BY 'Dietary Habit', LS.Reading;`;

    pool.query(queryDietaryHabits, function (error, results) {
        if (error) throw error;

        res.render('stroke-risk-analysis-3', { data: results });
    });
});

//---------------stroke-risk-analysis-4-----------------

app.get('/stroke-risk-analysis-4', function (req, res) {
    const queryHealthParameters = `
SELECT
    'Systolic Blood Pressure' AS 'Health Parameter',
    AVG(CAST(SUBSTRING_INDEX(Reading, '/', 1) AS DECIMAL(10, 2))) AS Mean,
    STDDEV(CAST(SUBSTRING_INDEX(Reading, '/', 1) AS DECIMAL(10, 2))) AS 'Standard Deviation'
FROM HealthReadings
WHERE ParameterID = (SELECT ParameterID FROM HealthParameters WHERE Parameter = 'Blood Pressure Levels')

UNION


SELECT
    'Diastolic Blood Pressure' AS 'Health Parameter',
    AVG(CAST(SUBSTRING_INDEX(Reading, '/', -1) AS DECIMAL(10, 2))) AS Mean,
    STDDEV(CAST(SUBSTRING_INDEX(Reading, '/', -1) AS DECIMAL(10, 2))) AS 'Standard Deviation'
FROM HealthReadings
WHERE ParameterID = (SELECT ParameterID FROM HealthParameters WHERE Parameter = 'Blood Pressure Levels')

UNION


SELECT
    'HDL Cholesterol Level' AS 'Health Parameter',
    AVG(CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(Reading, 'HDL: ', -1), ',', 1) AS DECIMAL(10, 2))) AS Mean,
    STDDEV(CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(Reading, 'HDL: ', -1), ',', 1) AS DECIMAL(10, 2))) AS 'Standard Deviation'
FROM HealthReadings
WHERE ParameterID = (SELECT ParameterID FROM HealthParameters WHERE Parameter = 'Cholesterol Levels')

UNION


SELECT
    'LDL Cholesterol Level' AS 'Health Parameter',
    AVG(CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(Reading, 'LDL: ', -1), ',', -1) AS DECIMAL(10, 2))) AS Mean,
    STDDEV(CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(Reading, 'LDL: ', -1), ',', -1) AS DECIMAL(10, 2))) AS 'Standard Deviation'
FROM HealthReadings
WHERE ParameterID = (SELECT ParameterID FROM HealthParameters WHERE Parameter = 'Cholesterol Levels')

UNION


SELECT
    'Average Glucose Level' AS 'Health Parameter',
    AVG(CAST(SUBSTRING_INDEX(Reading, ':', -1) AS DECIMAL(10, 2))) AS Mean,
    STDDEV(CAST(SUBSTRING_INDEX(Reading, ':', -1) AS DECIMAL(10, 2))) AS 'Standard Deviation'
FROM HealthReadings HR
WHERE ParameterID = (SELECT ParameterID FROM HealthParameters WHERE Parameter = 'Average Glucose Level')
    AND PatientID IN (SELECT PatientID FROM MedicalHistory WHERE DiagnosisID = (SELECT DiagnosisID FROM Diagnosis WHERE Diagnosis = 'Stroke'));`;

    pool.query(queryHealthParameters, function (error, results) {
        if (error) throw error;

        res.render('stroke-risk-analysis-4', { data: results });
    });
});

//---------------stroke-risk-analysis-5-----------------

app.get('/stroke-risk-analysis-5', function (req, res) {
    const queryConditionPrevalence = `
    SELECT
        'Hypertension' AS \`Condition\`,
        G.Gender,
        SUM(CASE WHEN HP.Parameter = 'Hypertension' AND HR.Reading = '1' THEN 1 ELSE 0 END) AS \`Count\`,
        TP.\`Total_Patients\` AS \`Total_Patients\`,
        (SUM(CASE WHEN HP.Parameter = 'Hypertension' AND HR.Reading = '1' THEN 1 ELSE 0 END) / TP.\`Total_Patients\`) * 100 AS \`Prevalence\`
    FROM Patients P
    LEFT JOIN HealthReadings HR ON P.PatientID = HR.PatientID
    LEFT JOIN HealthParameters HP ON HR.ParameterID = HP.ParameterID
    LEFT JOIN Genders G ON P.GenderID = G.GenderID
    LEFT JOIN (
        SELECT G.Gender, COUNT(*) AS \`Total_Patients\`
        FROM Patients P
        LEFT JOIN Genders G ON P.GenderID = G.GenderID
        GROUP BY G.Gender
    ) AS TP ON G.Gender = TP.Gender
    WHERE HP.Parameter = 'Hypertension'
    GROUP BY \`Condition\`, G.Gender, TP.\`Total_Patients\`

    UNION ALL

    SELECT
        'Heart Disease' AS \`Condition\`,
        G.Gender,
        SUM(CASE WHEN HP.Parameter = 'Heart Disease' AND HR.Reading = '1' THEN 1 ELSE 0 END) AS \`Count\`,
        TP.\`Total_Patients\` AS \`Total_Patients\`,
        (SUM(CASE WHEN HP.Parameter = 'Heart Disease' AND HR.Reading = '1' THEN 1 ELSE 0 END) / TP.\`Total_Patients\`) * 100 AS \`Prevalence\`
    FROM Patients P
    LEFT JOIN HealthReadings HR ON P.PatientID = HR.PatientID
    LEFT JOIN HealthParameters HP ON HR.ParameterID = HP.ParameterID
    LEFT JOIN Genders G ON P.GenderID = G.GenderID
    LEFT JOIN (
        SELECT G.Gender, COUNT(*) AS \`Total_Patients\`
        FROM Patients P
        LEFT JOIN Genders G ON P.GenderID = G.GenderID
        GROUP BY G.Gender
    ) AS TP ON G.Gender = TP.Gender
    WHERE HP.Parameter = 'Heart Disease'
    GROUP BY \`Condition\`, G.Gender, TP.\`Total_Patients\`

    UNION ALL

    SELECT
        'Family History of Stroke' AS \`Condition\`,
        G.Gender,
        SUM(CASE WHEN MH.WithFamilyHistory = 1 THEN 1 ELSE 0 END) AS \`Count\`,
        COUNT(*) AS \`Total_Patients\`,
        (SUM(CASE WHEN MH.WithFamilyHistory = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS \`Prevalence\`
    FROM Patients P
    LEFT JOIN MedicalHistory MH ON P.PatientID = MH.PatientID
    LEFT JOIN Genders G ON P.GenderID = G.GenderID
    GROUP BY \`Condition\`, G.Gender

    UNION ALL

    SELECT
        'Stroke History' AS \`Condition\`,
        G.Gender,
        SUM(CASE WHEN MH.PreviouslyDiagnosed = 1 THEN 1 ELSE 0 END) AS \`Count\`,
        COUNT(*) AS \`Total_Patients\`,
        (SUM(CASE WHEN MH.PreviouslyDiagnosed = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS \`Prevalence\`
    FROM Patients P
    LEFT JOIN MedicalHistory MH ON P.PatientID = MH.PatientID
    LEFT JOIN Genders G ON P.GenderID = G.GenderID
    GROUP BY \`Condition\`, G.Gender

    UNION ALL

    SELECT
        'Stroke Diagnosis' AS \`Condition\`,
        G.Gender,
        SUM(CASE WHEN MH.DiagnosisID = 2 THEN 1 ELSE 0 END) AS \`Count\`,
        COUNT(*) AS \`Total_Patients\`,
        (SUM(CASE WHEN MH.DiagnosisID = 2 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS \`Prevalence\`
    FROM Patients P
    LEFT JOIN MedicalHistory MH ON P.PatientID = MH.PatientID
    LEFT JOIN Genders G ON P.GenderID = G.GenderID
    GROUP BY \`Condition\`, G.Gender;`;

    pool.query(queryConditionPrevalence, function (error, results) {
        if (error) throw error;

        res.render('stroke-risk-analysis-5', { data: results });
    });
});

//---------------stroke-risk-analysis-6-----------------

app.get('/stroke-risk-analysis-6', function (req, res) {
    const queryDemographicStroke = `
    SELECT
        AgeGroup,
        Gender,
        MaritalStatus,
        COUNT(*) AS TotalPatients,
        SUM(CASE WHEN DiagnosisID = 1 THEN 1 ELSE 0 END) AS StrokePatients,
        (SUM(CASE WHEN DiagnosisID = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS StrokePrevalence
    FROM (
        SELECT
            CASE
                WHEN Age < 18 THEN '0-17'
                WHEN Age BETWEEN 18 AND 34 THEN '18-34'
                WHEN Age BETWEEN 35 AND 49 THEN '35-49'
                WHEN Age BETWEEN 50 AND 64 THEN '50-64'
                ELSE '65+'
            END AS AgeGroup,
            G.Gender,
            M.MaritalStatus,
            MH.DiagnosisID
        FROM Patients P
        LEFT JOIN Genders G ON P.GenderID = G.GenderID
        LEFT JOIN MaritalStatuses M ON P.MaritalStatusID = M.MaritalStatusID
        LEFT JOIN MedicalHistory MH ON P.PatientID = MH.PatientID
    ) AS Demographics
    GROUP BY AgeGroup, Gender, MaritalStatus
    ORDER BY AgeGroup, Gender, MaritalStatus;`;

    pool.query(queryDemographicStroke, function (error, results) {
        if (error) throw error;

        res.render('stroke-risk-analysis-6', { data: results });
    });
});





app.listen(port, function () {
    console.log('The app is listening at http://localhost:' + port + '.');
});
