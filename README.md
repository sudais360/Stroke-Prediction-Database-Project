# Stroke Prediction Database Project

## Overview
This project involves the design and implementation of a relational database system for predicting stroke risk based on a comprehensive dataset. The database is structured to store and analyze patient demographic information, health metrics, and medical history, facilitating the identification of stroke risk factors through SQL-based analysis and a web application interface.

## Project Structure
- **Database Report**: A detailed report that documents the database design, including the Entity-Relationship (E/R) model, table schemas, data ingestion process, and reflections on the database performance.
- **SQL Scripts**: SQL files used to create the database tables, load the data, and perform queries for data analysis.
- **Web Application**: A Node.js-based web application that provides interactive analysis of stroke risk factors, with various analytical views for users to explore data insights.
- **Data**: The dataset used for this project is sourced from Kaggle's Stroke Prediction Dataset, which includes demographic and medical information of patients.

## Key Components

### 1. Database Design
- **E/R Model**: A structured design consisting of lookup tables, patient information, and health-related data tables, ensuring data normalization and referential integrity.
- **Table Schemas**: Defined tables for storing patient demographics, health metrics (e.g., BMI, glucose levels), and diagnoses, linked through foreign keys.

### 2. Data Ingestion and Transformation
- **Denormalized Table**: An initial staging table for importing raw data from CSV files, which is then processed and inserted into the normalized tables.
- **Normalization Process**: Data is cleaned, transformed, and organized into specific tables to maintain data integrity and enable efficient querying.

### 3. SQL Analysis
- **Query Examples**: SQL queries designed to answer critical questions about stroke risk, including the impact of age, health conditions, BMI, and lifestyle factors.
- **Data Insights**: The analysis provides insights into high-risk profiles and correlations between different health metrics and stroke incidence.

### 4. Web Application
- **User Interface**: A web-based application built with Node.js and Express, allowing users to explore stroke data through interactive visualizations and analysis.
- **Routing and Data Handling**: The application interfaces with the database to execute queries and render data-driven insights on various stroke risk factors.

## Installation and Usage
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/stroke-prediction-database.git
   cd stroke-prediction-database
