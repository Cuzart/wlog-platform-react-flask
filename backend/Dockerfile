# Docker Image which is used as foundation
FROM python:3.7-alpine


WORKDIR /usr/src/app

# Copies requirements.txt to the Docker environment 
# and then installs them
COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

# run the application
ENTRYPOINT [ "flask" ]
CMD [ "run", "--host=0.0.0.0" ]

