# cta [ ![build status](https://git.sami.int.thomsonreuters.com/compass/cta/badges/master/build.svg)](https://git.sami.int.thomsonreuters.com/compass/cta/commits/master) [![coverage report](https://git.sami.int.thomsonreuters.com/compass/cta/badges/master/coverage.svg)](https://git.sami.int.thomsonreuters.com/compass/cta/commits/master)

CTA (Compass Test Automation) Application implementing CTA-OSS Framework

## General Overview

**CTA (Compass Test Automation)** is **_a general purpose_ test platform** that is successfully used by **Thomson Reuters Business Units**.
**CTA** supports **_a wide range of_ tests**, such as _functional testing_, _performance testing_, and _testing live products_ for early detection of incidents.
**The result of the tests** is presented in _detail reports_ and _dashboards_ in **real-time**. 
**Failed tests** for live products **can raise alarms** on _operational dashboards_ for supporters to take any immediate action.
**CTA** has a good level of **self-service** and **the majority of its functionalities** can be operated via its API.

## Audiences

This document provides information for **two types of audiences**.

1. **CTA Application Developers** who would like to learn or to use **CTA Application**.

1. **CTA-OSS Developers** who would like to learn or to implement **CTA-OSS Framework**.

## CTA Application

**CTA Application** has implemented **CTA-OSS Framework** to provide **the test platform**. In this level (application level), we are providing serveral applications as **the test platform**.

## CTA-OSS Framework

**CTA-OSS (CTA Open Source Software) Framework** is an opensource software that provides

### Brick as Component

In **CTA-OSS**, we introduce **Brick** as core component which is **a unit of process reposibility**. The **Brick** _emphasizes_ **the separation of concerns** with respect to the wide-ranging functionality available throughout a specified software system. It _encourages_ **a reuse-based approach** to **defining**, **implementing** and **composing** loosely-coupled independent components into systems.

### Event-Driven Message System

In **CTA-OSS**, components implement **Event-Driven** approach. The components _communicate_ on **event-driven message** with JSON-formatted payloads. The component can **publish**/**subscribe** on message's **topic** and **nature**.

### Configuration-Based System

In **CTA-OSS**, we separate the **definition**, **implementation** and **composition** of processes.

* The **definition**, **_what a component is_**, is defined within **configuration**.
* The **implementation**, **_what a component does_**, is constructed within **Brick**.
* The **composition**, **_how a component does_**, is defined within **configuration**.

The **Brick** provides **implementation** by **Brick's functionalities**. The **configuration** provides **definition** and **composition** by providing _properties_ that **Brick** uses.

## Features

* **Customizable Tests** - Users can design and provide your own test process
* **Manage Instance** - Users can define the instance that is running tests
* **Manage Test Executions** - Users can specify how the tests execute
* **Collect Information & Test Results** - Users can collect the information during the test and test results
* **Manage Notification**: Users can specify how to notify when the test completes

## Contributing

**CTA Application** and **CTA-OSS Framework** are **open source projects**. **We are always looking to receive contributions from our community to make CTA even better than they are today!** There are many ways for you to contribute, from writing tutorials or blog posts, improving the documentation, submitting bug reports and feature requests or writing code which can be incorporated into CTA itself.

## License

All **CTA Applications** and **CTA-OSS Framework** are [**Apache Licensed, version 2.0**](https://www.apache.org/licenses/LICENSE-2.0), (see [LICENSE](LICENSE) file)
