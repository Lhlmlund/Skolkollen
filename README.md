# Skolkollen
Vi ska utveckla en hemsida med inlärning som fokus, riktad mot gymnasieval för högstadieelever.



## Project Structure

Skolkollen/
├─ backend/     # Node.js + Express API
├─ frontend/    # Vue 3 + Vite
└─ .gitignore   # Ignores node_modules, dist, env, etc.


##  Setup Instructions

### 1. Clone and install
```bash
git clone https://github.com/Lhlmlund/Skolkollen.git
cd Skolkollen

```
## Backend setup

```bash
cd backend
npm install
npm run dev
# Backend: http://localhost:3000
# Health check: http://localhost:3000/health

```

## Frontend setup

```bash

cd ../frontend
npm install
npm run dev

```


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

```bash
docker compose up -d
```

And after open http://localhost:8080

Login info:

Field	    Value
System	    MySQL
Server	    mysql
Username	sk_user
Password	sk_pwd
Database	skolkollen


## Test backend health and database connectivity - US2

cd backend
npm run dev
Test in browser:

http://localhost:3000/health → OK

http://localhost:3000/health/db → { "db": "OK" } 



