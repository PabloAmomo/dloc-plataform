# DLOC Plataform

This project is a robust and efficient server designed to receive and process GPS messages from GF-07, GF-09, GF-11, GF-21, and GF-22 models. It is a comprehensive solution that facilitates the collection and management of real-time location data, providing a solid foundation for GPS tracking applications, security, and fleet management.

## DLOC Server
Server to receive information from GPS Devices.

### Configure GPS Device to send data to server
-- pending --

## DLOC Api
Simple API for consuming data produced by the DLOC-SERVER

## DLOC Front End
Front end example for using the DLOC Platform (React App)

# Database

The project employs a MySQL database. Within the 'dloc-database-backup' file, you'll find a backup of the data structure needed by the server. To get started, simply restore this backup into a database (e.g., 'dloc') and configure the connection details in the '.env.example' file (rename it to '.env'), located in the 'dloc-server' directory. This setup ensures smooth integration and operation with the database.

# Docker

The project features a Docker Compose setup to seamlessly launch both the server and its database. Configuration is managed through .env files, which are provided in the project as .env.example. To get started, simply rename these to .env. This approach streamlines the initial setup process, ensuring a quick and efficient deployment.
