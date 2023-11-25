#!/bin/bash

deploy() {
  local app="$1"
  local environment="$2"

  # Change to the desired directory
  cd /workspaces/blakemulnix-io

  case "$app" in
  portfolio | blog)
    case "$environment" in
    local)
      # Deploy locally to localhost:3000
      echo "Deploying locally for $app..."
      cd $app/
      yarn dev
      ;;

    dev | test | prod)
      # Deploy to the specified environment
      echo "Executing steps to deploy $app to $environment..."

      # Build NextJS Static Site
      # echo "Building NextJS Static Site for $app..."
      cd /workspaces/blakemulnix-io
      cd $app/
      # yarn build

      # Deploy via SST
      echo "Deploying $app via SST..."
      npx sst deploy --stage $environment
      ;;

    *)
      echo "Invalid environment: $environment"
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
