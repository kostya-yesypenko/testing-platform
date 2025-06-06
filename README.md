# 🌐 Online Examination Portal

Welcome to the **Online Examination Portal**! This project provides an interactive platform for conducting online exams, built with Spring Boot for the backend, React + Typescript for the frontend, and MySQL as the database.

## 🚀 Features

### Admin User:

- ✨ Add, update, and delete quizzes, categories, and questions.

### Normal User:

- 🎓 Take quizzes based on personal preferences.


## 🔧 Local Setup

Follow these steps to set up the project locally after cloning the repository:

### Backend (Spring Boot):

1. Open `examserver/src/main/resources/application.properties`.
2. Update the MySQL server details:

   ```properties
   spring.datasource.url=jdbc:mysql://[your-sql-server-url]:[your-sql-server-port]/[your-sql-database-name]
   spring.datasource.username=[your-username]
   spring.datasource.password=[your-password]
