# CTA Services

CTA is composed of different services (database, message broker, 3rd parties, ...) which are used 
to store data, exchange events throughout the system and more.

## Database

CTA has been built upon a full Javascript task; as such it uses a MongoDB database to store its configuration and data.

### Deployment 

MongoDB can be configured in different ways

#### Single instance

One single MongoDB instance can store and handle all CTA data information.
This is the default setup for development.

#### Shards

A MongoDB database can be spread across a number of shards. In such case, each shard handle queries the part of data 
it handles itself. Shards are especially useful as the volume of data increases so you can scale your database horizontally.

#### Replicaset

A MongoDB replicaset will requires a minimum of 3 instances with 1 instance being the master handling
all DB operations and the 2 other instances getting a replica of everything happening on the master.
Should the master disappear, one of those instance will be elected primary and take over the work to do.
Such setup should be configured to ensure resiliency of your CTA configuration in production.

Note that you can also have a replicaset for every shard to have a full scaling and resilient solution.

### Collections

CTA data is spread across different collections

#### User

Collection of all users of the system

#### Group

Collection of all groups of users

#### Machines

Collection of all machines (physical or virtual) registered on CTA to run tests

#### Test

Collection of all test run by CTA

#### Configuration

Collection of all the configurations targetting machines on which to run tests

#### TestSuite

Collection of all testsuites composed of tests ... ?and testsuites?

#### Scenario

Collection of test scenario associating a testsuite and a configuration 
and conditionning the scenario overall result to trigger actions and/or other scenarios

#### Execution

Collection of all executions of scenarios

#### Statuses

Collection of all results of executions

## Message Broker

All communication within CTA is events based with payloads formatted in JSON. All such events
are exchanged in-process but also out-process by using message brokers.

### RabbitMQ

A message broker provider for RabbitMQ has been implemented using NodeJS [amqplib](https://github.com/squaremo/amqp.node) module.

### Kafka

A message broker provider for Kafka has been implemented using NodeJS [Prozess](https://github.com/cainus/Prozess) module.

### Machine queue

Each machine has a dedicated queue on which are pushed executions to be run by this given machine

### Group queue

A queue is created for each execution to be handled by a group of machines

### Machine registration queue

A dedicated queue receives every registration of machines (physical or virtual) which happen once such machine starts the CTA agent

### Tests states queue

A dedicated queue receives every state event indicating the state of an execution for a given machine (Running/Acked/Cancelled/Finished)

### Tests results queue

A dedicated queue receives every test status event indicating the result of an execution of a test for a given machine (OK, Failed, Inconclusive, Partial)

## 3rd Parties

Many Third Party can integrate with CTA either to:
- trigger tests
- be notified of tests results
- provide tests
- gather tests results
- anything else you wish to contribute

### Continuous Integration

Continuous Integration tools such as GitLab CI, Jenkins/Hudson can trigger tests and be notified of their results.

#### GitLab CI

<TODO complete with example of triggering and notification>

#### Jenkins

<TODO complete with example of triggering and notification>

### Repositories / ObjectStorage

Tests and their Results can be pulled from repositories and/or ObjectStorage and their results push back to them.

To this end, one can 