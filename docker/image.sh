#!/bin/bash
set -e

docker run -p 3000-3020:3000-3020/tcp -p 5672:5672 -p 15672:15672 -p 27017:27017 --name ctademo -d cta
