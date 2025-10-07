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
Create a *.env* in the backend directory
```.env
MYSQL_HOST= ***
MYSQL_ROOT_PASSWORD: ***
MYSQL_DATABASE: ***
MYSQL_USER: ***
MYSQL_PASSWORD: ***
```
replace *** with actual values.

```bash
cd backend
docker compose up
npm install dotenv mysql
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


🛑 Start/Stop ( Terminal ) 

Starta frontend: npm run dev (i frontend/)
Starta backend: npm run dev (i backend/)
Stoppa: Ctrl + C i respektive terminal


📌 Links

GitHub: https://github.com/Lhlmlund/Skolkollen
Trello: https://trello.com/b/2HwHeAad/skolkollen-gruppovning-del-1
