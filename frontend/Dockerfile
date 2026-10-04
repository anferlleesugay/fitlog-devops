FROM nginx:1.27-alpine
ARG BUILD_NUMBER=dev
COPY src /usr/share/nginx/html
RUN sed -i "s/BUILD_TAG_PLACEHOLDER/${BUILD_NUMBER}/g" /usr/share/nginx/html/index.html
EXPOSE 80