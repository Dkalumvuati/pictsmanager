# pictsmanager

## Usage of docker

You will find a Makefile in the root of the repository. Instead of running the
all time docker-compose, you can run the following command:

```
# for running the development environment
make up-dev 

# OR
docker-compose -f docker-compose.yml up --build

# for stopping the development environment
make down-dev

#OR 
docker-compose -f docker-compose.yml down

# for cleaning the development environment with image and volumes 
make clean 

# OR 
sh remove-all-docker.sh
```

## TRAEFIK

>http://localhost:8080/

## API

Swagger is used to generate the API documentation. and the way to access it is
through this link: Have to use traefik to find the url

...

## Database - phpmyadmin

Phpmyadmin is used to manage the database. And the way to access it is through
this link: Have to use traefik to find the url

...
