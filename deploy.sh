cd ~/linguardian
docker-compose -f docker-compose.deploy.yml down
docker rmi 977099010577.dkr.ecr.eu-central-1.amazonaws.com/linguardian:frontend-latest 977099010577.dkr.ecr.eu-central-1.amazonaws.com/linguardian:backend-latest
docker-compose -f docker-compose.deploy.yml up -d