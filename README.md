![Panenco – Software studio](images/Panenco%20Banner.png)

# Fridge API

**Built during my internship at Panenco (Summer 2025)**

---

## Internship Context (Panenco)

This project was developed individually during my internship at Panenco. Although each intern worked alone, collaboration was encouraged for *questions*, *problem-solving*, and sharing *best practices*. The work followed a standard Git workflow using *feature branches* and *pull requests*, and tests were expected for all key features. A shared deadline at the start of week two ensured that the *core functionality* was completed on time, while interns who finished early could add *optional enhancements*, such as an endpoint that generated recipes with an LLM based on the user’s available items. The main goal of the assignment was to learn how to *properly structure a project* and become familiar with tools and frameworks that would be useful throughout the internship.

## Overview

This repository contains an API for shared refrigerators, created as part of my internship at Panenco in the summer of 2025. The system manages refrigerators located at specific places (e.g., floors), each with a defined capacity. Users can add, remove, and update items; list items by owner, refrigerator, or place; and exchange items between users. An optional extension explores recipe generation from available items via an LLM.

## Key Features

- Item management: create, update, delete, and transfer between users
- Refrigerator management with capacity checks and location grouping
- Query items by owner, refrigerator, and place
- Authentication with JWT and guarded endpoints
- Prisma ORM with PostgreSQL
- Test coverage for handlers and integration flows
- LLM-powered recipe generation from user inventory

## Tech Stack

- NestJS (controllers, modules, guards)
- Express platform adapter
- Prisma + PostgreSQL
- TypeScript
- Mocha + Chai + Supertest for testing

## Project Structure

The project followed Git workflows with branches and pull requests. I tried to put every feature and bug fix in a seperate branch. The branch that contains the final implementation is `improvements`. 

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker (for local PostgreSQL)

### Install dependencies

```bash
cd Fridge
pnpm install
```

### Start PostgreSQL via Docker Compose

The service uses `docker-compose.yml` with environment values from `docker.env`.

```bash
cd Fridge
docker compose up -d
```

### Prepare the database (Prisma)

```bash
cd Fridge
pnpm db:generate
pnpm db:push
# Optional during development:
pnpm db:studio
```

### Run the API

Development (ts-node):

```bash
cd Fridge
pnpm dev
```

Build and start:

```bash
cd Fridge
pnpm build
pnpm start
```


