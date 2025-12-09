FROM alpine:3.21

# cadvisor installation
RUN apk update && apk upgrade && apk add libc6-compat curl
RUN wget https://github.com/google/cadvisor/releases/download/v0.49.1/cadvisor-v0.49.1-linux-amd64 && \
    chmod +x cadvisor-v0.49.1-linux-amd64 && \
    mv cadvisor-v0.49.1-linux-amd64 /usr/local/bin/cadvisor

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/cadvisor", "-port=9100"]
