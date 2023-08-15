#!/bin/bash

deploy() {
  local environment="$1"

  # Change to the desired directory
  cd /workspaces/personal-website

  case "$environment" in
  local)
    echo "Deploying locally..."
    cd frontend/
    yarn dev
    ;;
  public)
    echo "Executing steps to deploy to the web..."
    echo "Building Terraform Infra..."
    # Build infra
    cd infra/
    terraform plan
    terraform apply
    cd ../frontend
    echo "Building frontend..."
    yarn build
    echo "Deploying frontend to S3..."
    yarn deploy
    ;;
  esac
}

main() {
  local command="$1"
  shift

  case "$command" in
  deploy)
    deploy "$@"
    ;;
  # Add other commands here
  *)
    echo "Invalid command: $command"
    exit 1
    ;;
  esac
}

# Call the main function with provided arguments
main "$@"
