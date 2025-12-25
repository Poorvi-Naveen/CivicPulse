# CivicPulse – Citizen Grievance Redressal System

CivicPulse is a full-stack web application designed to streamline citizen grievance registration, tracking, and resolution.  
It provides role-based access for **Citizens**, **Officers**, and **Admins**, ensuring transparency, accountability, and efficient grievance management.

---

## Tech Stack

|      Frontend      |      Backend      |      Other Tools      |
|:-------------------|:------------------|:----------------------|
| <ul><li>Angular</li><li>TypeScript</li><li>HTML, SCSS</li></ul>|<ul><li>Spring Boot</li><li>Spring Security (JWT Authentication)</li><li>JPA / Hibernate</li><li>MySQL</li></ul>|<ul><li>Maven</li><li>Git & GitHub</li><li>PostMan</li></ul>|

---

## Project Structure

civicPulse/<br>
├── backend/ # Spring Boot backend<br>
├── frontend/ # Angular frontend<br>
├── docker-compose.yml<br>
├── README.md<br>
├── .gitignore<br>


---

## Prerequisites

Ensure the following are installed on your system:

- Java 17 or above
- Node.js (LTS recommended)
- Angular CLI
- MySQL
- Maven
- Git

---

## Backend Setup (Spring Boot)

### 1️⃣ Configure Database

- Create a MySQL database:

```sql
CREATE DATABASE civicpulse;
```
- Update database credentials in:
backend/src/main/resources/application.properties

### 2️⃣ Run Backend

From the project root:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend will start at:  http://localhost:8080

## Frontend Setup (Angular)

### 1️⃣ Install Dependencies
```bash
cd frontend/civicpulse-frontend
npm install
```
## 2️⃣ Configure API URL

Edit: frontend/civicpulse-frontend/src/environments/environment.ts

```bash
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```
### 3️⃣ Run Frontend

```bash
ng serve
```
Frontend will be available at: http://localhost:4200

## Authentication & Roles

The application supports role-based access:

- **Citizen** – Register complaints, track status, submit feedback
- **Officer** – View assigned grievances, update status
- **Admin** – Manage users, assign officers, view reports

JWT-based authentication is implemented for secure access.

## Sample API Endpoints

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| POST   | /api/auth/register          | User registration       |
| POST   | /api/auth/login             | User login              |
| POST   | /api/grievances             | Submit grievance        |
| GET    | /api/grievances             | View grievances         |
| PUT    | /api/grievances/{id}/status | Update grievance status |


## Key Features

- Secure authentication using JWT
- Role-based dashboards
- Grievance lifecycle tracking
- Officer assignment workflow
- Feedback system
- Clean, modular architecture

## Author

Poorvi Naveen\
poorvinaveen31@gmail.com\
Full Stack Developer & Infosys Springboard Virtual Internship Intern\
CivicPulse Project
