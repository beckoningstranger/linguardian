docker stop $(docker ps -q)
docker rm $(docker ps -aq)
docker image prune -af
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin "$AWS_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
docker-compose -f docker-compose.deploy.yml up -d