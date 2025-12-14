FROM alpine:3.21

#prometheus installation
RUN apk update && apk upgrade && apk add libc6-compat curl openssl
RUN wget https://github.com/prometheus/prometheus/releases/download/v3.6.0/prometheus-3.6.0.linux-amd64.tar.gz && \
    tar xvfz prometheus-3.6.0.linux-amd64.tar.gz && \
    mv prometheus-3.6.0.linux-amd64 /prometheus && \
    rm prometheus-3.6.0.linux-amd64.tar.gz


RUN openssl req -x509 -newkey rsa:4096 -keyout /prometheus/prometheus.key -out /prometheus/prometheus.crt -days 365 -nodes -subj "/CN=localhost"

RUN chmod 777 /prometheus/prometheus.crt /prometheus/prometheus.key

COPY prometheus.yml /prometheus.yml
COPY alert_rules.yml /alert_rules.yml
COPY web-config.yml /web-config.yml

WORKDIR /prometheus

ENTRYPOINT ["./prometheus", "--config.file=/prometheus.yml", "--web.config.file=/web-config.yml"]
