# Skolkollen
Vi ska utveckla en hemsida med inlärning som fokus, riktad mot gymnasieval för högstadieelever.  
Syftet är att hjälpa niondeklassare att fatta ett välgrundat beslut inför gymnasievalet.




# OBS → You can now start both backend and frontend at once using:
npm run dev


## Project Structure

```
Skolkollen/
│
├── backend/                     # Node.js + Express + Prisma backend
│   ├── controllers/             # Route logic and request handling
│   ├── data/                    # Static or mock data (if applicable)
│   ├── lib/                     # Utility libraries or custom helpers
│   ├── middleware/              # Express middlewares (auth, logging, etc.)
│   ├── prisma/                  # Prisma schema and generated client
│   │   └── schema.prisma
│   ├── routes/                  # Express route definitions
│   ├── scripts/                 # Optional automation or maintenance scripts
│   ├── services/                # Business logic and data access layers
│   ├── sql/                     # SQL schema + seed files (auto-run via Docker)
│   │   ├── 01_schema.sql        # Table definitions (ordered for FKs)
│   │   └── 02_seed.sql          # Default data seeding
│   ├── zodSchema/               # Request validation schemas (Zod)
│   ├── index.js                 # Application entrypoint
│   ├── package.json
│   └── .env                     # Backend environment variables
│
├── frontend/                    # Vue 3 + Vite frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── api/                 # Axios or fetch API utilities
│   │   ├── assets/              # Images, icons, and styles
│   │   ├── components/          # Reusable Vue components
│   │   ├── pages/               # Page views (Login, Quiz, Profile, etc.)
│   │   ├── router/              # Vue Router setup
│   │   └── main.js              # Frontend entrypoint
│   ├── package.json
│   └── .env                     # Frontend environment variables (VITE_*)
│
├── docs/                        # Documentation and developer resources
│   └── postman/                 # Postman collections for testing endpoints
│
├── docker-compose.yml            # Defines MySQL + Adminer containers
├── README.md                     # You’re here!
└── .gitignore


```

##  Setup Instructions

### 1. Clone and install
```bash
git clone https://github.com/Lhlmlund/Skolkollen.git
cd Skolkollen

```
## Backend setup

# OBS never do this in live production!!!
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



## Loading JSON data from file:

npm run import:schools (make sure: docker compose up -d)

By default, the script loads data from:
```bash
backend/scripts/schools.json 

```
(if the file doesn't exist you must create it) 

You can also specify your own path:

```bash
npm run import:schools -- ./path/to/custom-schools.json
```

### Sample JSON file

```bash
[
  {
    "name": "Göteborg Tekniska Gymnasium",
    "city": "Göteborg",
    "website": "https://gtg.example",
    "programIds": [1, 2]
  },
  {
    "name": "Årsta Gymnasium",
    "city": "Stockholm",
    "website": "https://arsta.example"
  },
  {
    "name": "Malmö Fria Läroverk",
    "city": "Malmö",
    "website": "https://mfl.example",
    "programIds": [3]
  }
]

```



### 🧪 API Testing with Postman
You can find ready-to-use Postman requests for Schools and Programs APIs in [`docs/postman/`](docs/postman/README.md).
