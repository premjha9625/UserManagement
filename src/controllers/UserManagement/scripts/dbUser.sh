#!/bin/bash


# MongoDB connection details
MONGO_HOST="$1"
MONGO_PORT="27017"
DATABASE_NAME="$2"

# MongoDB authentication details
DB_USER="admin"
DB_PASSWORD="Admin@1212"
AUTH_DATABASE="admin"

# User details
USERNAME="$3"
PASSWORD="$4"


# role need to be received from the UI readWrite

# Connect to MongoDB and add the user
mongosh --host $MONGO_HOST --port $MONGO_PORT -u $DB_USER -p $DB_PASSWORD --authenticationDatabase $AUTH_DATABASE <<EOF
use $DATABASE_NAME
db.createUser({
  user: "$USERNAME",
  pwd: "$PASSWORD",
  roles: [{ role: "$5", db: "$DATABASE_NAME" }]
})
EOF
