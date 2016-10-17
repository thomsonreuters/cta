# CTA Deployment

** TODO: This was stolen from GitLab but we should have same strategy about deploying easily CTA with docker **

## CTA Docker images

In the following examples we are using the production image of CTA. To use CTA development instead of CTA production, replace the image name to cta/cta-dev:latest.

If you want to use the latest RC image, use cta/cta-prod:rc or cta/cta-dev:rc for CTA Production and CTA Development respectively.

## Run the image

Run the image:

sudo docker run --detach \
    --hostname cta.example.com \
    --publish 443:443 --publish 80:80 --publish 22:22 \
    --name cta \
    --restart always \
    --volume /srv/cta/config:/etc/cta \
    --volume /srv/cta/logs:/var/log/cta \
    --volume /srv/cta/data:/var/opt/cta \
    cta/cta-prod:latest
This will download and start a CTA Production container and publish ports needed to access SSH, HTTP and HTTPS. All CTA data will be stored as subdirectories of /srv/cta/. The container will automatically restart after a system reboot.

You can now login to the web interface as explained in After starting a container.

## Where is the data stored?

The CTA container uses host mounted volumes to store persistent data:

Local location	Container location	Usage
/srv/cta/data	/var/opt/cta	For storing application data
/srv/cta/logs	/var/log/cta	For storing logs
/srv/cta/config	/etc/cta		For storing the GitLab configuration files
You can fine tune these directories to meet your requirements.

## Configure CTA

All configuration files are found under /etc/cta

To access CTA's configuration file, you can start a shell session in the context of a running container. This will allow you to browse all directories and use your favorite text editor:

sudo docker exec -it cta /bin/bash
You can then edit /etc/cta/<a-cta-config-file>.js

sudo docker exec -it cta vi /etc/cta/<a-cta-config-file>.js

To receive e-mails from CTA you have to configure the SMTP settings because the CTA docker image doesn't have an SMTP server installed.

After you make all the changes you want, you will need to restart the container in order to reconfigure CTA:

sudo docker restart cta
Note: CTA will reconfigure itself whenever the container starts.

For more options about configuring CTA please check the corresponding CTA component documentation.

Pre-configure Docker container

You can pre-configure the CTA docker image by adding the needed environment variable CTA_CONFIG_<SETTING> to docker run command. These variable can override any CTA setting.
That way you can easily configure CTA, make any configuration change to CTA template.

Here's an example that sets the external URL and enables LFS while starting the container:

sudo docker run --detach \
    --hostname cta.example.com \
    --env CTA_CONFIG_SMTP="mail.smtpserver.com:1512"
    --publish 443:443 --publish 80:80 --publish 22:22 \
    --name gitlab \
    --restart always \
    --volume /srv/gitlab/config:/etc/gitlab \
    --volume /srv/gitlab/logs:/var/log/gitlab \
    --volume /srv/gitlab/data:/var/opt/gitlab \
    gitlab/gitlab-ce:latest
Note that every time you execute a docker run command, you need to provide the GITLAB_OMNIBUS_CONFIG option. The content of GITLAB_OMNIBUS_CONFIG is not preserved between subsequent runs.

There are also a limited number of environment variables to configure GitLab. They are documented in the environment variables section of the GitLab documentation.

After starting a container

After starting a container you can visit http://localhost/ or http://192.168.59.103 if you use boot2docker. It might take a while before the docker container starts to respond to queries.

Login to GitLab with the following credentials:

username: `root`
password: `5iveL!fe`
Next time, you can just use docker start and stop to run the container.

Upgrade GitLab to newer version

To upgrade GitLab to a new version you have to:

Stop the running container:

sudo docker stop gitlab
Remove existing container:

sudo docker rm gitlab
Pull the new image:

sudo docker pull gitlab/gitlab-ce:latest
Create the container once again with previously specified options:

sudo docker run --detach \
--hostname gitlab.example.com \
--publish 443:443 --publish 80:80 --publish 22:22 \
--name gitlab \
--restart always \
--volume /srv/gitlab/config:/etc/gitlab \
--volume /srv/gitlab/logs:/var/log/gitlab \
--volume /srv/gitlab/data:/var/opt/gitlab \
gitlab/gitlab-ce:latest
On the first run, GitLab will reconfigure and update itself.

Use tagged versions of GitLab

We provide tagged versions of GitLab docker images.

To see all available tags check:

GitLab-CE tags and
GitLab-EE tags
To use a specific tagged version, replace gitlab/gitlab-ce:latest with the GitLab version you want to run, for example gitlab/gitlab-ce:8.4.3.

Run GitLab CE on public IP address

You can make Docker to use your IP address and forward all traffic to the GitLab CE container by modifying the --publish flag.

To expose GitLab CE on IP 1.1.1.1:

sudo docker run --detach \
    --hostname gitlab.example.com \
    --publish 1.1.1.1:443:443 \
    --publish 1.1.1.1:80:80 \
    --publish 1.1.1.1:22:22 \
    --name gitlab \
    --restart always \
    --volume /srv/gitlab/config:/etc/gitlab \
    --volume /srv/gitlab/logs:/var/log/gitlab \
    --volume /srv/gitlab/data:/var/opt/gitlab \
    gitlab/gitlab-ce:latest
You can then access your GitLab instance at http://1.1.1.1/ and https://1.1.1.1/.

Expose GitLab on different ports

If you want to use a different port than 80 (HTTP) or 443 (HTTPS), you need to add a separate --publish directive to the docker run command.

For example, to expose the web interface on port 8929 and the SSH service on port 2289, use the following docker run command:

sudo docker run --detach \
    --hostname gitlab.example.com \
    --publish 8929:8929 --publish 2289:22 \
    --name gitlab \
    --restart always \
    --volume /srv/gitlab/config:/etc/gitlab \
    --volume /srv/gitlab/logs:/var/log/gitlab \
    --volume /srv/gitlab/data:/var/opt/gitlab \
    gitlab/gitlab-ce:latest
You then need to appropriately configure gitlab.rb:

Set external_url:

# For HTTP
external_url "http://gitlab.example.com:8929"

# For HTTPS
external_url "https://gitlab.example.com:8929"
Set gitlab_shell_ssh_port:

gitlab_rails['gitlab_shell_ssh_port'] = 2289
Diagnose potential problems

Read container logs:

sudo docker logs gitlab
Enter running container:

sudo docker exec -it gitlab /bin/bash
From within the container you can administer the GitLab container as you would normally administer an Omnibus installation

Install GitLab using docker-compose

With Docker compose you can easily configure, install, and upgrade your Docker-based GitLab installation.

Install Docker Compose
Create a docker-compose.yml file (or download an example):

web:
  image: 'gitlab/gitlab-ce:latest'
  restart: always
  hostname: 'gitlab.example.com'
  environment:
    GITLAB_OMNIBUS_CONFIG: |
      external_url 'https://gitlab.example.com'
      # Add any other gitlab.rb configuration here, each on its own line
  ports:
    - '80:80'
    - '443:443'
    - '22:22'
  volumes:
    - '/srv/gitlab/config:/etc/gitlab'
    - '/srv/gitlab/logs:/var/log/gitlab'
    - '/srv/gitlab/data:/var/opt/gitlab'
Make sure you are in the same directory as docker-compose.yml and run docker-compose up -d to start GitLab

Read "Pre-configure Docker container" to see how the GITLAB_OMNIBUS_CONFIG variable works.

Below is another docker-compose.yml example with GitLab running on a custom HTTP and SSH port. Notice how the GITLAB_OMNIBUS_CONFIG variables match the ports section:

web:
  image: 'gitlab/gitlab-ce:latest'
  restart: always
  hostname: 'gitlab.example.com'
  environment:
    GITLAB_OMNIBUS_CONFIG: |
      external_url 'http://gitlab.example.com:9090'
      gitlab_rails['gitlab_shell_ssh_port'] = 2224
  ports:
    - '9090:9090'
    - '2224:22'
  volumes:
    - '/srv/gitlab/config:/etc/gitlab'
    - '/srv/gitlab/logs:/var/log/gitlab'
    - '/srv/gitlab/data:/var/opt/gitlab'
Update GitLab using Docker compose

Provided you installed GitLab using docker-compose, all you have to do is run docker-compose pull and docker-compose up -d to download a new release and upgrade your GitLab instance.

Troubleshooting

500 Internal Error

When updating the docker image you may encounter an issue where all paths display the infamous 500 page. If this occurs, try to run sudo docker restart gitlab to restart the container and rectify the issue.

Permission problems

When updating from older GitLab Docker images you might encounter permission problems. This happens due to a fact that users in previous images were not preserved correctly. There's script that fixes permissions for all files.

To fix your container, simply execute update-permissions and restart the container afterwards:

sudo docker exec gitlab update-permissions
sudo docker restart gitlab
Help improve our documentation! Edit this file on GitLab.com.