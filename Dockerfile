# syntax=docker/dockerfile:1

# Versions
FROM dunglas/frankenphp:1-php8.4 AS frankenphp_upstream

# Base FrankenPHP image
FROM frankenphp_upstream AS frankenphp_base

WORKDIR /app

VOLUME /app/var/

# persistent / runtime deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    acl \
    file \
    gettext \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN set -eux; \
    install-php-extensions \
        @composer \
        apcu \
        intl \
        opcache \
        zip

ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PHP_INI_SCAN_DIR=":$PHP_INI_DIR/app.conf.d"

# > recipes
# > doctrine/doctrine-bundle
RUN install-php-extensions pdo_mysql
# < doctrine/doctrine-bundle
# < recipes

COPY frankenphp/conf.d/10-app.ini $PHP_INI_DIR/app.conf.d/
COPY frankenphp/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
COPY frankenphp/Caddyfile /etc/caddy/Caddyfile

ENTRYPOINT ["docker-entrypoint"]

HEALTHCHECK --start-period=60s CMD curl -f http://localhost:2019/metrics || exit 1
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]

# Dev FrankenPHP image
FROM frankenphp_base AS frankenphp_dev

ENV APP_ENV=dev XDEBUG_MODE=off

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

RUN set -eux; \
    install-php-extensions xdebug

COPY frankenphp/conf.d/20-app.dev.ini $PHP_INI_DIR/app.conf.d/

CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile", "--watch"]

# Prod FrankenPHP image
FROM frankenphp_base AS frankenphp_prod

ENV APP_ENV=prod
ENV FRANKENPHP_CONFIG="import worker.Caddyfile"

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY frankenphp/conf.d/20-app.prod.ini $PHP_INI_DIR/app.conf.d/
COPY frankenphp/worker.Caddyfile /etc/caddy/worker.Caddyfile

# 🔁 Copie tout le projet
COPY . ./

# Supprime les fichiers inutiles
RUN rm -Rf frankenphp/

# Installe les dépendances Symfony
RUN set -eux; \
    composer install --no-cache --prefer-dist --no-progress; \
    mkdir -p var/cache var/log; \
    composer dump-env prod; \
    composer run-script post-install-cmd; \
    chmod +x bin/console; \
    composer clear-cache; \
    composer install --no-dev --no-cache --prefer-dist --no-progress; \
    composer dump-autoload --classmap-authoritative --no-dev; \
    sync

# ✅ Ajout du script d'attente pour MySQL
COPY docker/wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

CMD ["wait-for-it.sh", "database", "3306", "--", "frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
