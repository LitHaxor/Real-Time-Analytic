#!/bin/bash

# Function to display usage instructions
usage() {
  echo "Usage: $0 {start|stop|build|logs} [dev|prod]"
  echo "Commands:"
  echo "  start [dev|prod]    Start the application in the specified environment"
  echo "  stop [dev|prod]     Stop the application in the specified environment"
  echo "  build [dev|prod]    Build the application in the specified environment"
  echo "  logs [dev|prod]     View logs for the application in the specified environment"
  exit 1
}

# Check if the correct number of arguments is provided
if [ "$#" -lt 2 ]; then
  usage
fi

# Determine the command and environment
COMMAND=$1
ENV=$2

# Validate the environment argument
if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
  usage
fi

# Set the appropriate docker-compose files based on the environment
COMPOSE_FILES="-f docker-compose.base.yml -f docker-compose.$ENV.yml"

# Execute the command based on the input
case $COMMAND in
  start)
    echo "Starting application in $ENV environment..."
    docker-compose $COMPOSE_FILES up -d
    ;;
  stop)
    echo "Stopping application in $ENV environment..."
    docker-compose $COMPOSE_FILES down
    ;;
  build)
    echo "Building application in $ENV environment..."
    docker-compose $COMPOSE_FILES build
    ;;
  logs)
    echo "Viewing logs for application in $ENV environment..."
    docker-compose $COMPOSE_FILES logs -f
    ;;
  *)
    usage
    ;;
esac
