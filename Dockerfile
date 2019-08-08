FROM python:3.7-slim-buster

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    binutils libproj-dev gdal-bin

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /usr/src/app
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /usr/src/app/

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
