docker stop $(docker ps -q)
docker rm $(docker ps -aq)
docker image prune -af
docker-compose -f docker-compose.deploy.yml up -d