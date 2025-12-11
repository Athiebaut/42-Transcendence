FROM owasp/modsecurity-crs:nginx

USER root

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY modsecurity/modsecurity.conf /etc/nginx/modsecurity/modsecurity.conf
COPY modsecurity/crs-setup.conf /etc/nginx/modsecurity/crs-setup.conf
COPY modsecurity/rules /etc/nginx/modsecurity/rules

CMD ["nginx", "-g", "daemon off;"]
