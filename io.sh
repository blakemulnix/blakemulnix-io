#!/bin/bash

deploy() {
  local app="$1"
  local env="$2"

  # Change to the desired directory
  cd /workspaces/blakemulnix-io

  case "$app" in
  portfolio | blog)
    case "$env" in
    local)
      # Deploy locally to localhost:3000
      echo "Deploying locally for $app..."
      cd $app/
      yarn dev
      ;;

    dev | test | prod)
      # Deploy to the specified env
      echo "Executing steps to deploy $app to $env..."
      cd /workspaces/blakemulnix-io
      cd $app/

      # Build and deploy via SST
      echo "Deploying $app to $env via SST..."
      npx sst deploy --stage $env
      ;;

    *)
      echo "Invalid env: $env"
      exit 1
      ;;
    esac
    ;;

  *)
    echo "Invalid app: $app"
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
