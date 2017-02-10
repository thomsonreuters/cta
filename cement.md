# CTA Framework

** TODO: 
  - Introduce the concept : visualize flow of data to understand the system
  - Introduce the bricks and the data contract between them
  - Introduce the cement that helps building modules by linking bricks 
**

## Concept

In CTA, we decided to go with building manufacturer terminology

To build a wall, a manufacturer would basically need some bricks, cement and some tools.

![brick, cement & tools](/images/brick-cement-tools.jpg)

In order to build an application in CTA you'll also need Bricks, Cement and Tools.

### Bricks

CTA is composed of many applications. Bricks are the main elements that hold a CTA application.
 
A Brick is a javascript Class with a Configuration that is the most important part of it.

It is a JSON file that defines Brick's properties (eg. PORT number), dependencies with Tools (dependency injection) and some contracts (relationships) with other Bricks in the same application.

Thus, viewing Bricks configurations is enough to understand how a CTA application work.

### Tools

Tools are modules required by Bricks in order to work properly. A Tool is a javascript Class with a configuration that defines its properties and dependencies with other Tools.

Unlike Bricks, Tools are stand-alone modules that have no relationships with other modules.

### Cement

Cement is a javascript Framework that bootstraps a CTA application.

It validates Bricks and Tools configurations, injects their dependencies to modules and ensures the flow control of data between Bricks.

