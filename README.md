CTA opensource main repository
==============================


# Development Environment

## Prepare your workspace

1. Clone this repository
2. Run `npm install` inside cloned folder
3. In your preferred IDE set your wour working directory as `./src/node_modules` (see why we work inside node_modules in next sections)
 
## How does it work

Running `npm install` command will do the following:

* autoupdate cta main repository (important when next time you run `npm install` to get last cta repositories)
* clone all known cta opensource repositories (defined in `./config`) into folder `./src/node_modules`
* install npm dependencies of all cta opensource repositories into shared folder `./node_modules`

## All inside node_modules

If you work on CTA repositories A, B and C.

C requires A and B.

B requires A.

Your local changes on A will be automatically visible for B and C, and local changes on B will be automatically visible for C.