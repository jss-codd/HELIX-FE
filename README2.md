# HelixSense Web application
## Clone this project
`git clone https://github.com/anhba817/mern-helix-sense.git`
## Install needed Python modules
- These python modules are needed to run the prediction script:
  - Django
  - boto3
  - pystan==2.19.1.1
  - prophet
  - numpy
  - pandas
- Verify if you are able to run the prediction script:
`python store_prediction.py "01-aa-bb-cc-dd-03-02-01" "2021-08-19T" "2021-08-21T"`
## Install MongoDB
Follow [this](https://docs.mongodb.com/manual/administration/install-community/) instruction to install MongoDB on your machine.
(Or you can use MongoDB Atlas)
## Install Keycloak server
Download and the start the keycloak server on your machine: [link](https://www.keycloak.org/getting-started/getting-started-zip).
We need to keep this server running to serve the authentication.

Follow this [docs](https://docs.google.com/document/d/1qDYSYOOsGtUI1DdgmyVyOK7FvcjT49d5r1opIEZjX_c/edit#heading=h.tzcz83ebzn9l) to configure keycloak server.

When you have finished the configuration, download the web client config file (Keycloak OIDC JSON) and put it in `mern-helix-sense/helix-app/public` folder:

<img src="https://i.imgur.com/JF0TxSD.png">

## Start the NodeJS server
### Update .env file
- Create a .env file inside `mern-helix-sense/server` folder
- Check the example file at `mern-helix-sense/server/server_env` and give needed information.
- For the Keycloak public key, you can find it in you Keyclaok server Admin page: Realm Setting --> Keys --> rsa-generated Public key
### Start the server
- Change the working directory to `mern-helix-sense/server`
- Install node modules: `npm install`
- Start server: `npm start`
## Start React app
### Update .env file
- Similarly, create a .env file inside `mern-helix-sense/helix-app` with the example `mern-helix-sense/helix-app/client_env`
### Start React app
- Change the working directory to `mern-helix-sense/helix-app`
- Install node modules: `yarn install`
- Start server: `yarn dev-start`
- Open the web app at `http://localhost:3010`
# Deployment on production server
## Prerequisites
- Python modules as above section installed
- MongoDB installed
- serve and pm2 packages installed globally.

You can install serve and pm2 by:
`npm install -g serve
npm install -g pm2`
## Deploy NodeJs server
- Clone the project to the server: `git clone https://github.com/anhba817/mern-helix-sense`
- Change working directory to mern-helix-sense/server and install node modules: `cd mern-helix-sense/server && npm install`
- Make sure the .env file exist and contains correct values.
- Start the pm2 service: `pm2 start npm --name node_server -- start`
## Build and deploy React
- Change working directory to helix-app: `cd mern-helix-sense/helix-app`
- Install needed node packages: `yarn install`
- Make sure the .env file exist and contains correct values.
- Build the React app: `npx webpack --progress`
- When the build finish, you will see a directory named `dist/` that contains the compiled and packaged React app.
- Copy the public folder to dist: `cp -r public/ dist/`
- Copy the right keycloak.json to dist/public: `cp ~/iot_server_anik/helix-app/public/keycloak.json dist/public/`
- Serve the React app on port 3010: `pm2 serve dist 3010 --spa`
## Deploy Keycloak server
- Steps to start keycloak server
- Keycloak server is running using docker container.
- First we need to find the docker container id using the command below.
- `docker ps -a`
- You can see the list of container. Copy the id of keycloak_working_2 container id.
- Run the docker using the container id copied.
- `docker start id`
##MongoDB 
- Devlopment server  MongoDB connection Url : `mongodb://<username>:<password>@<host>:<port>/<database_name>?-authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`
- Production Server : `mongodb://<username>:<password>@<host>:<port>/<database_name>?-authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`
## postgres 
- postgres connection
- databasename : `<database_name>`
- username : <username>
- password `<password>`
- host:<host>
- port : `<port>`
- connect server  by psql from local machnine
- psql -h <host> -d <databsase_name> -U  <username> -p <port>
- if connection is not estabilshed run command : `sudo nano /etc/postgresql/12/main/pg_hba.conf` on server machine
 # IPv4 local connections:
- host    all             all             `your_ip`            md5 
- change port of postgres server
- use command `sudo nano /etc/postgresql/12/main/postgresql.conf`  and restart the  postgres server

- save  and restart  the server  by commands
- `sudo systemctl restart postgresql.service`
- `sudo systemctl status  postgresql.service`

## Keycloack roles  and gropus
 - create Group `Admin`,`Customer`,`Sub Customer`,`Sub User`,`User`
 - create roles("permissions") like `Add IFC`,`View IFC`,`View Dashboad`,`Download Cobie`,`Add Sensor`,`Edit Sensor` `Delete Sensor` etc
 - map the roles  to groups of users
 - for  more  information in details you refer keyclock documentation

