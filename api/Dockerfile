# Docker Image which is used as foundation
FROM ubuntu:16.04

# installs all python related packages
RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential

#RUN mkdir  -p /usr/src/app
WORKDIR /usr/src/app

# Copies requirements.txt to the Docker environment 
# and then installs them (Flask)
COPY requirements.txt ./
RUN pip install -r requirements.txt

# run the application
ENTRYPOINT [ "flask" ]
CMD [ "run", "--host=0.0.0.0" ]

