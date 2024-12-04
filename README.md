# Mentality Project: backend

## Description

A progressive [Node.js](http://nodejs.org) framework for building efficient and scalable server-side applications. [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

You can view the live application at [mentality-back.onrender.com](mentality-back.onrender.com).

## Project setup

```bash
yarn install
```

## Compile and run the project

```bash
# development
$ yarn start

# watch mode
$ yarn dev

# production mode
$ yarn prod
```

## Eslint & Prettier

Use linter to format the code:

```bash
yarn lint
yarn fix

yarn prettier
yarn format
```

## Run tests

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Commitlint Rules

This project follows specific commit message rules enforced by **commitlint** . Below are the configured rules:

### `type-enum`

Specifies the types of changes allowed in the commit message. These types help categorize commits and maintain a clean history.

- **feat** : New feature
- **fix** : Bug fix
- **docs** : Documentation changes
- **style** : Changes that do not affect the meaning of the code (e.g., white-space, formatting)
- **refactor** : Code changes that neither fix a bug nor add a feature
- **perf** : Performance improvement
- **test** : Adding missing tests or correcting existing tests
- **build** : Changes that affect the build system or external dependencies (e.g., npm)
- **ci** : Changes to CI configuration files and scripts
- **chore** : Other changes that don't modify`src` or`test` files
- **revert** : Reverts a previous commit

### `scope-enum`

Defines the allowed scopes of changes. Scopes are used to specify the area of the project affected by the commit.

- **setup** : Project setup
- **config** : Configuration files
- **deps** : Dependency updates
- **feature** : Feature-specific changes
- **bug** : Bug fixes
- **docs** : Documentation
- **style** : Code style/formatting
- **refactor** : Code refactoring
- **test** : Tests
- **build** : Build scripts or configuration
- **ci** : Continuous integration
- **release** : Release-related changes
- **other** : Other changes

### Example Commit Message

#### Message Writing Pattern

`<type-enum>(<optionally: scope-enum>): <short description>`

#### Examples for a Valid Commit Message

- `feat(navbar): added ability to sort items`
- `feat(setup): add commitlint for commit message validation`

Ensure all commit messages adhere to these rules to maintain consistency and improve project traceability.

## Deployment

### Step 1: Prepare Your Project

#### 1. Install Production Dependencies

Ensure all required dependencies are installed:

```bash
yarn install --production
```

#### 2. Configure Environment Variables

- Create a `.env` file for local development, but ensure sensitive environment variables are added in the **[Render Dashboard](https://dashboard.render.com/)** .
- Example:

```bash
      DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<db_name>
      PORT=3000
```

#### 3. Build Your Application

Compile the NestJS application into production-ready JavaScript:

```bash
yarn build
```

#### 4. Update `package.json`

Ensure the `start` script runs the compiled app:

```bash
"scripts": {
  "start": "node dist/main",
  "build": "nest build"
}
```

---

### Step 2: Set Up Render.com

#### 1. Log in to Render.com

Create an account at [Render.com](https://render.com) and log in.

#### 2. Create a New Web Service

- Go to the Render dashboard and select**"New Web Service"** .
- Connect your GitHub or GitLab repository.

#### 3. Configure Deployment Settings

- **Environment:** Select **Node.js** .
- **Build Command:**

  ```bash
  yarn install && yarn build
  ```

- **Start Command:**

  ```bash
  yarn start
  ```

- **Environment Variables:** Add all necessary variables (e.g., `DATABASE_URL`, `PORT`).

#### 4. Select Deployment Plan

Choose the desired service plan based on your application’s requirements (Free, Starter, etc.).

---

### Step 3: Deploy the Application

1. Once configured, Render will automatically:
   - Install dependencies.
   - Build your application.
   - Run the`start` script.
2. Monitor the deployment logs to ensure there are no errors.

---

### Step 4: Verify the Deployment

1. Once the deployment completes, Render will provide a URL for your application.
2. Visit the URL to confirm the application is running.
3. Test all endpoints to ensure everything works as expected.

---

### Optional: Configure Automatic Deployments

Enable **automatic deploys** in Render so that every push to the main branch triggers a new deployment.

---

### Resources

- Official Render documentation:[Render.com Documentation]()
- NestJS deployment guide:[NestJS Deployment Docs](https://docs.nestjs.com/deployment)

This process ensures that your NestJS application is deployed reliably and efficiently on Render.com.

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
