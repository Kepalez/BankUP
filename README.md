# BankUP official repository

## How to run this project?
### 1. Clone this repository
Using this command: 
```bash
 git clone https://github.com/Kepalez/BankUP.git
```
On a safe folder

### 2. Start the backend
You will need to install docker to do this step.
Go into the backend folder you will find an example of a .env with the keys of the mock up database
```bash
 cd ./BackendModule
```
Pueden configurar POSTGRES_USER, POSTGRES_PASSWORD y POSTGRES_DB en el archivo **.env**

#### Start container
```bash
docker-compose up -d
```

#### Drop container (not necessary)
```bash
docker-compose down --volumes --remove-orphans
```

#### You can tryout the database to make sure it is up and running (optional)
```bash
docker exec -it postgres_db psql -U postgres -d postgres_db
```
### 3. Start the frontend
Get out of the backend fold and get in the frontend folder
```bash
cd ../FrontendModule
```
#### Install all necessary dependencies
Using this command: 
```bash
 npm install
```
Also install the dependencies on the server folder
```bash
cd server
```
```bash
 npm install
```

#### Run the server
After installing all dependencies now you can run:
```bash
 npm run dev
```
This should get the front end running on localhost:8081
