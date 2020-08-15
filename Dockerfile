FROM node:alpine AS baseJetBuild

RUN \
  mkdir -p /usr/src/ui/web \
  && mkdir -p /usr/src/ui/src \
  && mkdir -p /usr/src/ui/scripts \
  && chmod -R a+rwx /usr/src/ui \
  && cd /usr/src/ui \
  && npm install -g @oracle/ojet-cli@8.0.0 \
  && npm install @oracle/oraclejet@8.0.0 \
  && npm install @oracle/oraclejet-tooling@8.0.0

WORKDIR /usr/src/ui

FROM nginx:alpine AS nginxContainer

RUN \
  rm -v /etc/nginx/nginx.conf \
  && mkdir -p /usr/share/nginx/html/capgemini/skills-tracker/v1 \ 
  && chmod -R a+rwx /usr/share

FROM baseJetBuild AS buildContainer

COPY scripts /usr/src/ui/scripts/

COPY oraclejetconfig.json /usr/src/ui/

COPY src /usr/src/ui/src/

RUN ojet build --release

FROM nginxContainer

EXPOSE 8080 8091

WORKDIR /usr/share/nginx/html/capgemini/skills-tracker/v1

COPY nginx.conf /etc/nginx/

COPY container-entrypoint.sh /usr/share/nginx/html/capgemini/skills-tracker/v1

COPY --from=buildContainer /usr/src/ui/web /usr/share/nginx/html/capgemini/skills-tracker/v1

COPY package.json /usr/share/nginx/html/capgemini/skills-tracker/v1

CMD ["sh","container-entrypoint.sh"]