# Task Backend (Node.js + Express + PostgreSQL)

## Setup
1. Install Node.js and PostgreSQL.
2. Create the database:
   ```
   psql -U postgres -c "CREATE DATABASE taskdb;"
   ```
3. Install dependencies and configure env:
   ```
   npm install
   cp .env.example .env     # then edit DB_PASSWORD etc.
   ```
4. Create the `tasks` table:
   ```
   npm run db:init
   ```
5. Start the server:
   ```
   npm run dev      # auto-reload (nodemon)
   npm start        # normal
   ```

## Table: tasks
| Column      | Type         | Notes                                   |
|-------------|--------------|-----------------------------------------|
| id          | SERIAL PK    | auto                                    |
| title       | VARCHAR(255) | required                                |
| description | TEXT         | optional                                |
| status      | VARCHAR(20)  | pending (default) / in-progress / completed |
| created_at  | TIMESTAMP    | auto                                    |
| updated_at  | TIMESTAMP    | auto on update                          |

## API Endpoints (base: http://localhost:5000)
| Method | URL              | Description                    |
|--------|------------------|--------------------------------|
| POST   | /api/tasks       | Create a task                  |
| GET    | /api/tasks       | Get all tasks (`?status=pending`) |
| GET    | /api/tasks/:id   | Get one task                   |
| PUT    | /api/tasks/:id   | Update a task (partial allowed)|
| DELETE | /api/tasks/:id   | Delete a task                  |

## Postman examples
**POST /api/tasks** (Body → raw → JSON)
```json
{ "title": "Finish report", "description": "Due Friday", "status": "pending" }
```
**PUT /api/tasks/1**
```json
{ "status": "completed" }
```

## For the frontend teammate
Use `http://<YOUR_LAPTOP_IP>:5000/api/tasks` (find IP with `ipconfig` / `ifconfig`).
Both laptops must be on the same network, and port 5000 must be allowed through the firewall.
