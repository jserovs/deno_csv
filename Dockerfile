FROM hayd/ubuntu-deno:latest

RUN apt-get update
RUN apt-get -y install git

WORKDIR /js
RUN git clone https://github.com/jserovs/deno_csv
WORKDIR /js/deno_csv

USER deno

EXPOSE 8083

CMD ["run", "--allow-net", "upload_server.ts"]