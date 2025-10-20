# Skolkollen
Vi ska utveckla en hemsida med inlärning som fokus, riktad mot gymnasieval för högstadieelever.  
Syftet är att hjälpa niondeklassare att fatta ett välgrundat beslut inför gymnasievalet.




# OBS → You can now start both backend and frontend at once using:
npm run dev


## Project Structure

```
Skolkollen/
├─ backend/ # Node.js + Express API
│ ├─ sql/ # Auto-run SQL (schema + seed) for MySQL container
│ ├─ routes/ # API endpoints
│ ├─ services/ # Database logic (MySQL / Prisma)
│ └─ .env # Local DB credentials (ignored in Git)
├─ frontend/ # Vue 3 + Vite
└─ docker-compose.yml # Starts MySQL + Adminer

```

##  Setup Instructions

### 1. Clone and install
```bash
git clone https://github.com/Lhlmlund/Skolkollen.git
cd Skolkollen

```
## Backend setup
Create a *.env* in the backend directory
```.env

DATABASE_URL="mysql://sk_user:sk_pwd@localhost:3306/skolkollen"

MYSQL_HOST=3306
MYSQL_ROOT_PASSWORD:rootpwd
MYSQL_DATABASE:skolkollen
MYSQL_USER:sk_user
MYSQL_PASSWORD:k_pwd


```
replace *** with actual values.

```bash
cd backend
docker compose up
npm install dotenv mysql2
npm run dev:backend
# Backend: http://localhost:3000
# Health check: http://localhost:3000/health


```

# Step 2: Start MySQL + Adminer (auto-initialized)

When in the root of the project in terminal:

```bash

docker compose up -d

```
This will: 

* Start a MySQL container and runs the schema + seed SQL through:

    sql/01_schema.sql → creates tables

    sql/02_seed.sql → inserts example data

* Adminer (a database editor) or (DB UI) runs on http://localhost:8080




# Step 3: Run(use) the backend 

```bash

cd backend
npm install
npm run dev:backend


```



## Frontend setup and run(use)

```bash

cd ../frontend
npm install
npm run dev:frontend

```



# *OBS* All team members only need to run docker compose up -d
for an instantly ready, pre-seeded MySQL database. 

🛑 Stop ( Terminal ) 
Stoppa: Ctrl + C i respektive terminal


📌 Links
GitHub: https://github.com/Lhlmlund/Skolkollen
Trello: https://trello.com/b/2HwHeAad/skolkollen-gruppovning-del-1



# Database & Adminer

The project uses MySQL (via Docker) as the database.
A lightweight admin tool called Adminer is also included for easy access to the data. 

Adminer lets you:

View, edit, and delete records directly in the database

Check that your backend CRUD operations are working

Manually test queries during development

## Accessing Adminer
after 

```bash
docker compose up -d
```

 open http://localhost:8080

Login info:(or the environment variables you choose in .env)

Field	    Value
System	    MySQL
Server	    mysql
Username	sk_user
Password	sk_pwd
Database	skolkollen

### You can:

* View and edit data directly

* Verify CRUD operations

* Run custom SQL queries for debugging


## Test backend health and database connectivity - US2

cd backend
npm run dev
Test in browser:

http://localhost:3000/health → OK

http://localhost:3000/health/db → { "db": "OK" } 



