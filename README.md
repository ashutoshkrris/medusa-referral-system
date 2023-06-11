# <Tutorial Name>

This repository is the codebase of tutorial [Medusa Referral System](tutorial-link).

[Medusa Documentation](https://docs.medusajs.com/) | [Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Medusa Version

This tutorial uses Medusa v1.12.0. It is not guaranteed that it will work with future releases.

## Prerequisites

- [Node.js at least v16](https://docs.medusajs.com/tutorial/set-up-your-development-environment#nodejs)
- [Git](https://docs.medusajs.com/tutorial/set-up-your-development-environment/#git)
- [Medusa CLI](https://docs.medusajs.com/tutorial/set-up-your-development-environment#medusa-cli)
- [Redis](https://docs.medusajs.com/tutorial/set-up-your-development-environment/#redis)
- [PostgreSQL](https://docs.medusajs.com/development/backend/prepare-environment#postgresql)

## How to Install

_You may change these steps per your article._

1. Clone this repository:

```bash
git clone https://github.com/ashutoshkrris/medusa-referral-system.git
```

2. Navigate to the `medusa-referral-system` directory:

   ```bash
   cd medusa-referral-system
   ```

3. Navigate to the `my-medusa-store` directory and install all the dependencies:

   ```bash
   cd my-medusa-store
   npm install
   ```

4. Run the following command to create a `.env` file:

   ```bash
   mv .env.template .env
   ```

5. Migrate, seed the data and run the server:

   ```bash
   medusa migrations run
   medusa seed -f ./data/seed.json
   medusa develop
   ```

6. Navigate to the `my-medusa-storefront` directory and install all the dependencies:

   ```bash
   cd ../my-medusa-storefront
   npm install
   ```

7. Run the following command to create a `.env` file:

   ```bash
   mv .env.template .env.local
   ```

8. Run the storefront:
   ```bash
   npm run dev
   ```

