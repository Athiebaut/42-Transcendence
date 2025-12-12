FROM owasp/modsecurity-crs:nginx

USER root

RUN rm -f /docker-entrypoint.d/93-update-proxy-ssl-config.sh
RUN rm -f /etc/nginx/templates/nginx.conf.template
RUN rm -f /etc/nginx/templates/conf.d/default.conf.template
RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY modsecurity/modsecurity.conf /etc/nginx/modsecurity/modsecurity.conf
COPY modsecurity/crs-setup.conf /etc/nginx/modsecurity/crs-setup.conf
COPY modsecurity/rules /etc/nginx/modsecurity/rules

CMD ["nginx", "-g", "daemon off;"]
