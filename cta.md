# Compass Test Automation

# Features

Compass Test Automation (CTA) is a successful general purpose test platform that is being adopted by various TR Business Units. 
It supports a wide range of tests from functional testing, to performance testing, to testing live products for
early detection of incidents. The result of the tests are presented in near real-time in detailed reports and dashboards. 
Failing tests for live products can raise alarms on operational dashboards for support staff to take immediate
action. CTA has a good level of selfservice and the majority of its functionality can be driven
via its API.

Please check the [feature guide](features.md) for a list of all features provided by CTA.

# Deployment

CTA can be deployed using docker as one docker image containing all CTA components and required services.
For more complex deployments, one can deploy a set of docker images to ensure resiliency of all the
different components and services offered by CTA.

Please follow the [deployment guide](deployment.md) for instructions on how to deploy CTA.

# Contributing

CTA is an open source project and we are always looking to receive contributions from our community to make CTA even better than it is today! 
There are many ways for you to contribute, from writing tutorials or blog posts, improving the documentation, submitting bug reports and feature requests or 
writing code which can be incorporated into CTA itself.

Please follow the [contributing guide](contributing.md) for instructions on how to contribute to CTA.

# Services and Components

CTA is composed of a rich set of components taking care of scheduling tests, running tests, managing tests, alerting/reacting on results of tests
and more.

Please follow the [services guide](services.md) for a detailled description of each services.

Please follow the [components guide](components.md) for a detailled description of each components.

# Event Driven

All communication within CTA is events based with payloads formatted in JSON.

Such decision allow for the incorporation and extension of CTA with any combination of languages and technologies.

Please follow the [events guide](events.md) for a list and description of events exchanged thoughout the system.

# Data Schema

A lot of Data is handled and configured by and for CTA.

- Configuration Data : to define tests, test suites, test configurations and scenario of tests.
- Audit Data : to track configuration changes
- Test Data : to gather results of tests

Please follow the [data guide](data.md) for a description of the data schema used by CTA.

# Cement and Bricks

A best way to understand the mechanic and logic of a project is to look at the flow of data. 
Nevertheless, such flow of data is often hidden in the source code of a system.
To ease readability of such flows, CTA created a framework to track via configuration files
which data flows to which elements (bricks) of the system.
All the transmission of data between bricks being managed (cemented) by a manager (cement).

Please follow the [cement and bricks guide](cement.md) for a description of this framework.