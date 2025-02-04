# Onboarding Web

This project is a part of a fully dynamic and configurable onboarding solution to make user registration and onbording easy to new products.

## Technical Overview

We have used Next, React, React-Redux, Thunk in this project.
We just handled the forms using [react-hook-form](https://react-hook-form.com/) although you might not be able to find the forms example in the project because they will generate in run-time.
This project contains a set of states and combination the mentioned states to manage the routes and protect the pages and handle the form submits, so we decided to use a state-machine to handle to states and have proper actions and services based on the states and be able to config the all of theme just using a json. the state-machine we have use is [XState](https://xstate.js.org/docs/).

Minimum compatible node Version: 10.18.1

## Contact Info

Project started at July 12 2020 and created by [Arian Rahimi](mailto:a.rahimi@kian.digital).

Current Project maintainers are:

- [Arian Rahimi](mailto:a.rahimi@kian.digital)
- [Hossein Shafieyan](mailto:h.shafieyan@kian.digital)
- [Sajjad Mousavi](mailto:s.mousavi@kian.digital)

## Environment variables

|         key         |                   default                    | description                                       | stage |
| :-----------------: | :------------------------------------------: | ------------------------------------------------- | :---: |
|   PORTAL_ADDRESS    |              http://saya.credit              | the address of project portal(landing or website) |  \*   |
|   SERVER_ADDRESS    |          http://localhost:5000/api           | the backend address in development mode           |  DEV  |
| FILE_SERVER_ADDRESS | https://sit.kiandigital.com/glusterproxy/api | the file bucket address in development mode       |  DEV  |

## Proxy Paths

Most of the above env variables are useful for dev mode and you can't rely on them in prod mode because we are using proxy paths on the main origin to call backend and file buckets. Here is the list of proxy paths:

|     path     |   target application   | required |
| :----------: | :--------------------: | :------: |
| /server/api  | onboarding-wrapper-app |   true   |
| /server/file |        gLuster         |   true   |

## Test Coverage

|    type     |   script    | coverage (last registered) |
| :---------: | :---------: | :------------------------: |
|    unit     |  yarn test  |             0%             |
| integration |      -      |             0%             |
|     e2e     | yarn cy:run |             0%             |

## Available Scripts

**NOTICE:** All of the following commands must be run in the project directory

### Run in dev mode

```
yarn dev
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### Build for production

```
yarn build;
yarn start;
```

Now you have run the project in production mode. Please make sure you have set the environment variables correctly.

| Required Env Variables |
| :--------------------: |
|           -            |
