# CTA Features

Compass Test Automation is a general purpose test platform.
It allows you to easily on-board your tests, run them and get their results.
It supports a wide range of tests from functional testing, to performance testing with many features.

## Test Framework Agnostic

How can I test my code?

CTA allows you to easily on-board your tests, run them and get their results
All it will take is for your test framework to use one of the existing adapter to send status to CTA or to develop one that will benefit others

Please follow the [test framework integration guide](cta-agent-integration.md) **TODO** 

## Test Machine Onboarding

CTA allows you to onboard your own test machines to run your tests

To that effect, any machine installing the CTA Agent is automatically registered on the system and can then be
targetted as a test machine on which to run tests.

# Visualize near real-time test results
 
How can I know how the tests went?

CTA provides you with a visual and near real-time report of your results
Access to all logs and dumped data your tests produced is available from CTA

# Run your tests against different OS and software versions
 
How can I test my code against different OS/Software configurations?

CTA offers you the ability to test on multiple combinations of OS/softwares at once
To that end you can easily target test machine with the needed OS or software version required to run your tests.

# Add CTA to your continuous integration

How can I integrate testing in my continuous integration?

CTA integrates with your CI system through a REST API to launch tests.

Please follow the [continuous integration guide](ci-guid.md) for example of integration with GitLab, GitHub, Jenkins and more.
 
# Synchronize tests on many test machines
 
How can I load test my application?

CTA allows tests to be launched synchronously to load test applications. It will provide description of master machine and counterparts
to integrate easily with performance testing frameworks.
It will then execute your test simultaneously on all those machines at the desired time.
If needed, a load test can also be interrupted or ended at once against all machines.

# Create pools of test machines

How can I run my tests on pool of machines?

CTA can run your test on dedicated machines but also on group of machines asking them to collaborate in running your scenarios 
This ensures you to spread scenarios against all available test machines optimizing their usage.

# Run your tests faster than ever

How can I execute my tests faster?

CTA can share your test across group of machines asking them to collaborate in running your tests 
This will provide you with the ability to run your tests in a fraction of the time used to get results before

# Get statistics on your tests

How many tests did you run until now ?

CTA can provide you with statistics of all the tests run by your group monthly and since you started using CTA