# User Portal - 3-Tier Containerized Application

This is a 3-tier user registration web application consisting of a frontend UI, a backend API, and a MongoDB database, all containerized using Docker and managed via Docker Compose.

## Project Overview
* **Frontend:** A web interface built with HTML, CSS, and JavaScript, hosted inside an optimized Nginx web server container.
* **Backend:** A Node.js Express API server that processes user requests and logs activities.
* **Database:** A MongoDB instance that securely stores and persists user information.

---

## Docker Hub Image Links
The application images are built using optimized, multi-stage Dockerfiles and are hosted publicly on Docker Hub:
* **Frontend Image:** `sidpram/user-dashboard-frontend:latest`
* **Backend Image:** `sidpram/user-dashboard-backend:latest`

---

## Setup Instructions

### 1. Configure the Environment
Ensure you have a file named `.env` in the root directory of the project with the following configuration:
```ini
FRONTEND_PORT=8080
BACKEND_PORT=3000
MONGO_PORT=27017
MONGO_URI=mongodb://mongodb:27017/user_portal

```
### 2. Start the Application
Run the following single command from the root directory to automatically pull the images from Docker Hub, configure the network links, set up database volumes, and start the entire ecosystem in the background:

Bash
docker compose up -d

### 3. Verify and Access
Frontend Portal: Open your browser and go to http://localhost:8080 to interact with the dashboard.

Backend API Check: Visit http://localhost:3000/api/users to view raw backend records.

Check Running Containers: Run docker compose ps to verify that all three services are up and running cleanly.


#### Command used
cd .\backend\
npm i
npm init -y
npm install
npm install express mongoose cors
node server.js
npm i mongoose
npm install mongodb

 Id     Duration CommandLine
  --     -------- -----------
   1       docker images -a
   2       docker images -a
   3       docker run -d --name user-frontend --network dashboard-net -p 3010:80 user-dashboard-frontend
   4       docker run -d --name user-frontend --network dashboard-net -p 3010:80 user-portal-frontend
   7       docker network ls
   8       docker run -d --name user-backend --network dashboard-net -p 3000:3000 user-portal-backend
   9       docker run -d --name user-backend --network dashboard-net -p 3011:3000 user-portal-backend
  10       docker ps -a
  11       cd C:\Users\Administrator\VS-Code\User-Portal
  12       docker-compose up --build

  to remove: 
  docker rm -f af4f940cf611 314434f40891 ca8692bf1490

  



mongodb+srv://sidpram_db_user:8E1R4P654FX3Ea8V@cluster0.8acfkyw.mongodb.net/?appName=Cluster0
MONGODB_URI="mongodb+srv://sidpram_db_user:RdrnN5mzl8UUjxn6@cluster0.8acfkyw.mongodb.net"


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sidpram_db_user:<db_password>@cluster0.8acfkyw.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


## Kubernetes implementation

1. first create kind cluster : mention in kind dir as kind-congif.yaml file
command>  kind create cluster --name user-portal --config .\kind\kind-config.yaml

2. Now create all the Kubernetes yaml files in k8 dir.
    kubectl get nodes
    kubectl get all

    a. Namespace.yaml file. 
    cd .\k8s\
    kubectl apply -f .\namespace.yaml
    kubectl get namespace

    Id     Duration CommandLine
  --     -------- -----------
   1        0.399 docker images -a
   2        3.991 docker images -a
   3        6.923 docker run -d --name user-frontend --network dashboard-net -p 3010:80 user-dashboard-frontend
   4        4.092 docker run -d --name user-frontend --network dashboard-net -p 3010:80 user-portal-frontend
   5        0.179 docker network ls -a
   6        0.142 docker network ls a
   7        0.295 docker network ls
   8        1.611 docker run -d --name user-backend --network dashboard-net -p 3000:3000 user-portal-backend
   9        0.611 docker run -d --name user-backend --network dashboard-net -p 3011:3000 user-portal-backend
  10        0.663 docker ps -a
  11        0.616 cd C:\Users\Administrator\VS-Code\User-Portal
  12  1:54:34.157 docker-compose up --build
  13        3.496 d
  14        1.459 docker images
  15        0.283 history
  16        3.697 kind --version
  17        0.225 kind create cluster --name user-portal --config \kind\kind-config.yaml
  18     3:58.265 kind create cluster --name user-portal --config .\kind\kind-config.yaml
  19        0.368 kubectl get nodes
  20        0.678 kubectl get all
  21        0.591 cd k8
  22        0.205 ls
  23        0.036 cd .\k8s\
  24        0.587 kubectl apply -f .\namespace.yaml
  25        0.693 kubectl get namespace
  26        1.102 kubectl apply -f .\learnings\pod.yaml
  27        0.263 kubectl get po
  28        0.255 kubectl get pods -n user-portal
  29        0.732 kubectl get pods -o wide -n user-portal
  30        0.739 kubectl get nodes -o wide
  31        2.430 kubectl delete po nginx-pod -n user-portal
  32        0.256 kubectl get nodes -o wide
  33        0.239 kubectl get pods -n user-portal
  34        0.319 kubectl get pods -o wide -n user-portal
  35        0.586 docker version
  36        0.407 docker images
  37        0.261 cd..
  38        0.843 ls
  39        0.044 cd .\backend\
  40        0.017 cd..
  41        4.270 docker build -t user-portal-frontend:v1
  42        9.341 docker build -t user-portal-frontend:v1 ./frontend
  43        0.416 docker images -a
  44        2.252 docker rmi -f sidpram/user-dashboard-backend
  45        0.163 docker rmi -f sidpram/user-dashboard-fronntend
  46        0.777 docker rmi -f sidpram/user-dashboard-frontend
  47        0.367 docker images -a
  48        5.164 docker build -t user-portal-backend:v1 ./backendend
  49     1:05.386 docker build -t user-portal-backend:v1 ./backend
  50        2.126 docker images -a
  51        1.831 docker tag user-portal-frontend:v1 sidpram/user-dashboard-frontend:v1
  52        0.364 docker tag user-portal-backend:v1 sidpram/user-dashboard-backend:v1
  53        0.349 docker images -a
  54        2.566 docker login
  55     1:06.477 docker push sidpram/user-dashboard-frontend:v1
  56       52.833 docker push sidpram/user-dashboard-backend:v1
  57        0.374 docker images -a
  58        1.003 kubectl get deployments
  59        0.301 kubectl get deployments -n user-portal
  60        4.245 kubectl apply -f k8s/frontend/deployment.yaml
  61        1.119 kubectl get deployments -n user-portal
  62        0.666 kubectl get deployments -n user-portal -a
  63        1.006 kubectl get deployments -n user-portal -o wide
  64        0.971 kubectl get nodes
  65        0.379 kubectl get pods -o wide -n user-portal
  66        4.679 kubectl apply -f k8s/frontend/deployment.yaml
  67        0.384 kubectl get deployments -n user-portal -a
  68        0.605 kubectl get deployments -n user-portal -o wide
  69        0.748 kubectl get pods -o wide -n user-portal
  70        1.360 kubectl get deployments -n user-portal -o wide
  71        0.845 kubectl get pods -o wide -n user-portal
  72        0.887 kubectl get rs -n user-portal
  73        0.629 kubectl get pods --show-labels -n user-portal
  74        0.972 kubectl apply -f k8s/frontend/service.yaml
  75        0.546 kubectl get srv
  76        0.264 kubectl get services
  77        0.360 kubectl get services -o wide
  78        0.284 kubectl get services -o wide -n user-portal
  79        0.324 kubectl describe service frontend-service
  80        0.310 kubectl describe services frontend-service
  81        0.327 kubectl describe svc frontend-service -n user-portal
  82        0.670 kubectl apply -f k8s/backend/deployment.yaml
  83        1.582 kubectl apply -f k8s/backend/service.yaml
  84        0.957 kubectl get services -o wide -n user-portal
  85        5.303 kubectl get pods -n user-portal -o wide
  86        0.505 kubectl get pods -n user-portal -o wide
  87        6.319 kubectl describe po backend-deployment-7d979dff-2nxx8 -n user-portal
  88        0.249 kubectl get pods -n user-portal -o wide
  89        0.289 kubectl get services -o wide -n user-portal
  90        0.261 kubectl get rs -n user-portal
  91        0.320 kubectl get nodes
  92        1.818 kubectl get nodes
  93        1.481 docker images -a
  94        0.818 kubectl get pods
  95        0.337 kubectl get pods -n user-portal -o wide
  96        0.455 kubectl describe pod backend-deployment-7d979dff-2nxx8 -n user-portal
  97        0.399 kubectl get pods -n user-portal -o wide
  98        0.950 kubectl logs backend-deployment-7d979dff-2nxx8 -n user-portal --previous
  99        0.175 cd .\backend\
 100       32.503 docker build -t sidpram/user-dashboard-backend:v1 .
 101       13.841 docker build -t sidpram/user-dashboard-backend:v1 .
 102        7.462 docker build -t sidpram/user-dashboard-backend:v2 .
 103       10.633 docker push sidpram/user-dashboard-backend:v2
 104        0.042 cd..
 105        0.650 kubectl apply -f k8s/backend/deployment.yaml
 106        0.294 kubectl get pods
 107        0.300 kubectl get pods -n user-portal -o wide
 108        0.609 kubectl get images
 109        0.468 kubectl get images -n user-portal
 110        0.356 kubectl get services -o wide -n user-portal
 111        0.150 docker get images
 112        0.439 kubectl logs backend-deployment-779dc985d8-8sxn7 -n user-portal
 113        0.286 kubectl get storageclass
 114        2.428 kubectl get storageclass
 115        0.629 kubectl get storageclass -o wide
 116        0.853 kubectl describe storageclass standard
 117        1.017 kubectl apply -f k8s/mongodb/pvc.yaml
 118        0.285 kubectl get pv
 119        0.301 kubectl get pv -n user-portal
 120        0.406 kubectl get pvc -n user-portal
 121        0.234 kubectl get pv
 122        0.429 kubectl apply -f .\k8s\mongodb\service.yaml
 123        0.290 kubectl get svc -o wide
 124        0.296 kubectl get svc -n user-portal
 125        0.336 kubectl describe svc mongodb -n user-portal
 126        0.559 kubectl get pods -n user-portal -o wide
 127        1.037 kubectl apply -f .\k8s\mongodb\statefulset.yaml
 128        0.573 kubectl get pods -n user-portal -o wide
 129        1.305 kubectl get pods -n user-portal -o wide
 130        0.717 kubectl get pods -n user-portal -o wide
 131        3.517 kubectl describe pod mongodb-0 -n user-portal
 132        0.889 kubectl get pods -n user-portal -o wide
 133        0.310 kubectl get pods -n user-portal -o wide
 134        0.475 kubectl get pods -n user-portal -o wide
 135        0.640 kubectl describe pod backend-deployment-779dc985d8-9xv9k -n user-portal
 136        0.314 kubectl get pods -n user-portal -o wide
 137        0.392 kubectl logs backend-deployment-779dc985d8-9xv9k -n user-portal --previous
 138        0.528 kubectl get pods -n user-portal
 139        0.377 kubectl logs backend-deployment-779dc985d8-9xv9k -n user-portal
 140        0.280 kubectl describe svc mongodb -n user-portal
 141        0.235 kubectl logs backend-deployment-779dc985d8-9xv9k -n user-portal
 142        0.481 kubectl get pods -n user-portal
 143        0.261 kubectl get pvc -n user-portal
 144        0.334 kubectl get pv

    
          