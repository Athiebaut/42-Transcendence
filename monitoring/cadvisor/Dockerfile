FROM alpine:3.21
ARG VER="54.1"

# cadvisor installation
RUN apk update && apk upgrade && apk add libc6-compat curl
RUN wget https://github.com/google/cadvisor/releases/download/v0.$VER/cadvisor-v0.$VER-linux-amd64 && \
    chmod +x cadvisor-v0.$VER-linux-amd64 && \
    mv cadvisor-v0.$VER-linux-amd64 /usr/local/bin/cadvisor

ENTRYPOINT ["/usr/local/bin/cadvisor"]
