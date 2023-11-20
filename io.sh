#!/bin/bash

deploy() {
  local environment="$1"

  # Change to the desired directory
  cd /workspaces/blakemulnix-io

  case "$environment" in
  local)
    # Deploy locally to localhost:3000
    echo "Deploying locally..."
    cd frontend/
    yarn dev
    ;;

  test | prod)
    # Deploy to the specified environment
    echo "Executing steps to deploy to $environment..."

    # Build NextJS Static Site
    echo "Building NextJS Static Site..."
    cd /workspaces/blakemulnix-io
    cd frontend/
    yarn build

    # Deploy via SST
    echo "Deploying via SST..."
    npx sst deploy --stage $environment
    ;;

  *)
    echo "Invalid environment: $environment"
    exit 1
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
