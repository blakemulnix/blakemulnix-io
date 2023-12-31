# blakemulnix.io

This website showcases my software engineering skills and tells who I am (as well as a website can).

## Project Overview

This website serves as an online portfolio to highlight my software engineering expertise, projects, and professional background. It includes the following key features:

- **Frontend**: The frontend is built using [TypeScript](https://www.typescriptlang.org) and [React](https://react.dev), providing an interactive and responsive user interface and leveraging the [Next.js](https://nextjs.org) framework for static site generation. [Tailwind CSS](https://tailwindcss.com) is used for styling, ensuring a modern and visually appealing design.

- **Infrastructure**: The website is deployed on AWS using various services:
  - Amazon S3: Static assets and content are hosted in an S3 bucket.
  - Amazon CloudFront: Content is distributed through CloudFront, enhancing performance with edge caching.
  - Amazon Route 53: Custom domain routing is managed using Route 53.
  - AWS ACM: SSL/TLS certificates are managed using AWS Certificate Manager for secure communication.

- **SST**: The infrastructure provisioning is automated using [SST](https://sst.dev), a framework for building serverless applications.

- **Bash scripting**: I have automated the tasks for deploying locally and deploying to the web using the `io.sh` bash script.

- **Github Codespaces**: I am using Github Codespaces along with the `.devcontainer` folder in my repository to easily and automatically set up a development environment to work on this project.

## Contact

Feel free to reach out if you have any questions or feedback about this project by emailing me at blakemulnix@gmail.com
