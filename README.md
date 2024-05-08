![Test Workflow](https://github.com/Weyn/backstage-teamcity/actions/workflows/main.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/Weyn/backstage-teamcity/badge.svg?branch=main)](https://coveralls.io/github/Weyn/backstage-teamcity?branch=main)

# Backstage teamcity plugin

Welcome to the teamcity plugin for Backstage!

## Getting started
Install via yarn
```
yarn add --cwd packages/app backstage-plugin-teamcity
```

In: packages\app\src\components\catalog\EntityPage.tsx file add:
```
import { isTeamcityAvailable, EntityTeamcityContent } from 'backstage-plugin-teamcity';
```

Then under cicdContent block in the EntityPage.tsx file paste:
```
    <EntitySwitch.Case if={isTeamcityAvailable}>
        <Grid item sm={12}>
            <EntityTeamcityContent/>
        </Grid>
    </EntitySwitch.Case>
```

As a final step add the proxy to the app-config.local.yaml or prod depending on the env.

```
proxy:
  '/teamcity-proxy/':
    target: 'http://localhost:8111'
    headers:
      Authorization: 'Basic BASIC_AUTH'
      Accept: 'application/json'
```

# Project catalog flag requirement
```
  annotations:
    teamcity/project-id: TEAMCITY_NAME
```

# Screenshots
![error](https://github.com/Weyn/backstage-teamcity/blob/main/assets/sample.jpg)
![error](https://github.com/Weyn/backstage-teamcity/blob/main/assets/history.jpg)
![error](https://github.com/Weyn/backstage-teamcity/blob/main/assets/log.jpg)

# Developing

## Installing packages
Run `yarn install`

## Running tests

To run tests execute `yarn test a`

# Future plans
* More tests
* Run button