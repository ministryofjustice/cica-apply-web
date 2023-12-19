# Cica Web
[![GitHub repo size](https://img.shields.io/github/repo-size/CriminalInjuriesCompensationAuthority/cica-web)](https://github.com/CriminalInjuriesCompensationAuthority/cica-web)
[![GitHub repo version](https://img.shields.io/github/package-json/v/CriminalInjuriesCompensationAuthority/cica-web)](https://github.com/CriminalInjuriesCompensationAuthority/cica-web/releases/latest)
[![GitHub repo npm version](https://img.shields.io/badge/npm_version->=9.5.0-blue)](https://github.com/CriminalInjuriesCompensationAuthority/cica-web/blob/master/package.json#L5)
[![GitHub repo node version](https://img.shields.io/badge/node_version->=18.16.1-blue)](https://github.com/CriminalInjuriesCompensationAuthority/cica-web/blob/master/package.json#L6)
[![GitHub repo contributors](https://img.shields.io/github/contributors/CriminalInjuriesCompensationAuthority/cica-web)](https://github.com/CriminalInjuriesCompensationAuthority/cica-web/graphs/contributors)
[![GitHub repo license](https://img.shields.io/github/package-json/license/CriminalInjuriesCompensationAuthority/cica-web)](https://github.com/CriminalInjuriesCompensationAuthority/cica-web/blob/master/LICENSE)


Cica-Web is a front-facing web app that allows applicants to apply for compensation. Front-facing web app for the [Apply](https://claim-criminal-injuries-compensation.service.justice.gov.uk/apply/) service. A consumer of the [Data Capture Service API](https://github.com/CriminalInjuriesCompensationAuthority/data-capture-service).


## Prerequisites
* Windows machine running docker desktop.
* You have Node Version Manager (NVM) installed globally. <sup>(_recommended, not required_)</sup>
* You have NPM `">=9.5.0"` installed globally.
* You have Node `">=18.16.1"` installed globally.
* You have the Postgres `create-tables.sql` file in a sibling directory named `postgres-scripts` (this mapping is defined in the `docker-compose.yml` file)

## Installing Cica-Web

Make sure that this repo is installed in a sibling directory to the Data Capture Service API. This directory structure is already configured in the `docker-compose.yml` file that are used to run the containers.

Clone the Cica-Web repo, and `npm install`

## Using Cica-Web
In order to fully run and use the web app, you will need to clone and install the [Data Capture Service API](https://github.com/CriminalInjuriesCompensationAuthority/data-capture-service). The neccessary `docker-compose.yml` file is found in the dev-utilities repo.

This Docker Compose configuration will assume that there is a cica-web, and data-capture-service directory, both with the respective installed repos in them for it to run correctly.

> Full instructions on the required directory structure and configuration is found in the `Docker-compose-setup-for-CW,-DCS,-Postgres` Utilities Wiki article <sup>(_private repo_)</sup>.

To build and run the web app, run these commands:
* `docker-compose -f docker-compose.dev build`
* `docker-compose -f docker-compose.dev up`

Once it is built and running, navigate to http://localhost:3000/apply to use the web app.

## Contributors
Thanks to the following people who have contributed to this project:
* [@armoj](https://github.com/armoj)
* [@neil-stephen-mcgonigle](https://github.com/neil-stephen-mcgonigle)
* [@BarryPiccinni](https://github.com/BarryPiccinni)
* [@sinclairs](https://github.com/sinclairs)
* [@stephenjmcneill1971](https://github.com/stephenjmcneill1971)
* [@tjbburton](https://github.com/tjbburton)


## License
This project uses the following license: MIT.
