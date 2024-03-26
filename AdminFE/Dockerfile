FROM nginx:alpine

COPY /build ./var/www/build

ADD nginx.conf /etc/nginx/conf.d/default.conf

CMD [ "nginx", "-g", "daemon off;"]