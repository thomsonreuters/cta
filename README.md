CTA opensource main repository
==============================


# Development Environment

## Prepare your workspace

1. Clone this repository
2. Run `npm install` inside cloned folder
3. In your preferred IDE set your working directory as `./src/node_modules` (see why we work inside node_modules in next sections)

At any time, you can run:

* `npm install` again to clone new CTA repositories, update existing, install npm dependencies
* `npm run pull` to update existing CTA repositories
* `npm run test` to run mocha tests over all CTA repositories
 
## How does it work?

Running `npm install` command will do the following:

* autoupdate CTA main repository
* clone all known CTA opensource repositories (defined in `./config`) into folder `./src/node_modules`
* install npm dependencies of all CTA opensource repositories into shared folder `./node_modules`

## All inside node_modules

CTA repositories are cloned inside a `node_modules` folder for a reason:

If you work on CTA repositories A, B and C.

C requires A and B.

B requires A.

Your local changes on A will be automatically visible for B and C, and local changes on B will be automatically visible for C.