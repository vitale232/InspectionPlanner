FROM python:3.7-slim-buster

RUN apt-get update \
    && apt-get dist-upgrade -y

RUN apt-get install -y \
    apt-utils \
    binutils libproj-dev gdal-bin \
    libcurl4-gnutls-dev libssl-dev gcc python3.7-dev

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYCURL_SSL_LIBRARY nss

COPY requirements.txt /usr/src/app
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /usr/src/app/

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
