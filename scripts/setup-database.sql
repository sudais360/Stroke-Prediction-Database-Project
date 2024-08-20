/* create a project database named stroke, and drop it first if it already exists */
DROP DATABASE IF EXISTS stroke;
CREATE DATABASE stroke;

/* create a database user, called sudais, and drop it first if it already exists */
DROP USER IF EXISTS 'sudais'@'%';
CREATE USER 'sudais'@'%' IDENTIFIED WITH mysql_native_password BY 'sudais22';

/* grant user access to the project data, which was created earlier */
GRANT ALL ON stroke.* TO 'sudais'@'%';

/* only for running in colab, grant user sudais to server related configuration */
GRANT SELECT ON mysql.* TO 'sudais'@'%';
