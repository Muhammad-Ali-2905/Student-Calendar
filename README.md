# Student Calendar — Full-Stack Web App (MSSQL · Express · React)

A complete web application to organize a student’s academic life: **courses, events, assignments, exams**, and **role-based access** for **Admin** and **Student** users.  
Front end: **React (Vite)** · Back end: **Node.js/Express** · Database: **Microsoft SQL Server**.

---

## ✨ Features

### Authentication & Roles
- Secure login endpoint with role routing.
- **Admin** and **Student** dashboards with different capabilities.

### Admin Portal
- **Students**: list, add, edit, delete.
- **Courses**: create, edit, delete; view instructor, schedule, description.
- **Events**: calendar CRUD with categories (Lectures, Labs, etc.).
- **Event Categories**: full CRUD for custom labels.

### Student Portal
- **Calendar**: month view + **Today’s Events** panel.
- **Assignments**: list with due date & status; detail view.
- **Exams**: schedule with date/time/location/materials; detail view.
- **Courses**: quick course list with modal details.

> All data is persisted in **SQL Server** and accessed via REST APIs.

---

## 🧱 Tech Stack

- **Front End**: React + Vite, React Router, CSS modules
- **Back End**: Node.js, Express, `mssql` (SQL Server driver)
- **Database**: Microsoft SQL Server (T-SQL)


