# https://docs.docker.com/develop/develop-images/multistage-build/#stop-at-a-specific-build-stage
# https://docs.docker.com/compose/compose-file/#target


# https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG NODE_VERSION=18

# "common" stage
FROM node:${NODE_VERSION}-alpine AS builder_base

EXPOSE 3001

WORKDIR /srv/app

ENV NEXT_TELEMETRY_DISABLED 1

# prevent the reinstallation of node modules at every changes in the source code
COPY package.json yarn.lock ./
RUN yarn


COPY . ./

VOLUME /srv/app/node_modules


# "development" stage
# depends on the "common" stage above
FROM builder_base AS dev

ENV API_PLATFORM_CLIENT_GENERATOR_OUTPUT .
RUN yarn global add @api-platform/client-generator


CMD ["yarn", "dev"]


# "build" stage
# depends on the "common" stage above
FROM builder_base AS prod

ENV NODE_ENV production
ARG NEXT_PUBLIC_ENTRYPOINT

RUN set -eux; \
	yarn build

CMD ["yarn", "start"]
