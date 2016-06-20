# CTA Data

** TODO: 
   - Detail the schema of all data we store in the system
   - list all data type
   - list all properties of a data type
   - highlight the links between data types 
 
 **
 
## User

Every User using the system is recorded in the system. Here are the informations kept about the user:

- fist  : First name of the user, i.e.: John
- last  : Last name of the user, i.e : Doe
- email : E-mail of the user, i.e.: john.doe@somewhere.com
- uid   : User IDentifier
- name  : Display name
- groups : IDs of the user's groups

## Group

Groups can be created to gather users and give them restricted permissions

- name : Group name
- description : Group description
- _id  : Group ID

## Machines

- hostName : Host name of the test machine
- ip : IP adress of the test machine
- properties : Properties of the test machine
``
[ 
   {
      "name" : "propertyName",
      "value": "propertyValue"
   }
]
``

## Configuration

A configuration targets (a) test machine(s) that will execute scenario and define how to execute the scenario
(single mode, collaborative mode, etc...)

- name  : Name of the configuration
- properties : Properties of the test machine(s) to target
``
[ 
   {
      "name" : "propertyName",
      "value": "propertyValue"
   }
]
``
- executionMode : how the test is run
   - mono : execution is sent to the the first machine matching
   - group : execution is sent to a group of machine so the first available treats it
   - stress : execution is sent to all machines in a group so all perform the test at the same time
   - parallell : execution scenario is decomposed in series of tests so all machines split/share the work together

## Test

- type : type of test, default : command-line
- testSuiteID

Additional properties can be defined per type of test

### Command Line

- run-cmd
- stop-cmd
- timeout

## TestSuite

- application : application tests
- 

## Scenario

Collection of test scenario associating a testsuite and a configuration 
and conditionning the scenario overall result to trigger actions and/or other scenarios

## Execution

Collection of all executions of scenarios

## Statuses

Collection of all results of executions

### Command Line