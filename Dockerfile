# lets start from an image that already has nodejs installed
# https://snyk.io/blog/choosing-the-best-node-js-docker-image/

# Single source of truth for the base image so both build stages stay in lockstep.
# Dependabot (docker ecosystem) bumps the digest on this one line; both FROMs inherit it.
# Keep the full tag@sha256 default here — Dependabot only tracks ARG-based FROMs when
# the pinned value is the ARG's default.
ARG BASE_IMAGE=node:24-trixie-slim@sha256:54f84b4cf8432b21aaffd5d3ce8d41e12cea0d10d33c09d2f3c9879d49d6b446

# --- Stage 1: builder ---
FROM ${BASE_IMAGE} AS builder

WORKDIR /usr/src/app

# Install all dependencies (including devDependencies) needed to build assets
# A wildcard ensures both package.json AND package-lock.json are copied
COPY package.json package-lock.json ./
RUN npm ci

# Bundle app source and build static assets (sass + babel + webpack)
COPY . .
RUN npm run sass && npm run build

# Drop devDependencies now that the build is complete
RUN npm prune --omit=dev

# --- Stage: dev (local docker-compose hot-reload only) ---
# Used by q-dev-utilities/docker-compose/docker-compose-dev.yml via `target: dev`.
# Unlike `builder`, this stage keeps devDependencies (nodemon, webpack, sass,
# babel) and never prunes them, so `npm run start:dev` works. It runs as root
# and is overlaid by a bind mount of the host source at runtime, so it is NOT
# suitable for production. CI/prod build the `production` target and are unaffected.
# Re-declare ARG after FROM resets build args between stages.
ARG BASE_IMAGE
FROM ${BASE_IMAGE} AS dev

WORKDIR /usr/src/app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Install all dependencies, including devDependencies, and do not prune.
COPY package.json package-lock.json ./
RUN npm ci

# Bundle source. At runtime the compose bind mount overlays this with the live
# host checkout, and `start:dev` rebuilds assets and watches via nodemon.
COPY . .

EXPOSE 3000
# 9229 is the Node inspector port exposed by start:dev (--inspect=0.0.0.0:9229)
EXPOSE 9229

CMD ["npm", "run", "start:dev"]

# --- Stage 2: runtime (production) ---
# Named `production` to match reusable-container.yml's `build-target` default,
# which runs `docker build --target production`.
# Re-declare ARG after FROM resets build args between stages; it inherits the
# global default above unless overridden at build time.
ARG BASE_IMAGE
FROM ${BASE_IMAGE} AS production

WORKDIR /usr/src/app

# Copy the built application (production deps + compiled assets) from the builder
COPY --from=builder /usr/src/app .

# Remove npm/npx to reduce the runtime attack surface.
# This also clears the Snyk container "lib" project findings: Snyk scans
# npm's own bundled dependency tree at /usr/local/lib/node_modules, which
# carries vulns (undici, brace-expansion, etc.) unrelated to this app.
# Deleting npm here removes that scan target entirely. Do not re-add npm
# to the runtime image.
RUN rm -rf /usr/local/lib/node_modules/npm && \
    rm -f /usr/local/bin/npm /usr/local/bin/npx

RUN groupadd -g 1014 dc_user && useradd -rm -d /usr/src/app -u 1015 -g dc_user dc_user
RUN chown -R dc_user:dc_user /usr/src/app

USER 1015

EXPOSE 3000

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Use node directly instead of npm start to reduce runtime attack surface
# and avoid npm lifecycle-script execution path in production containers.
# Note: running node directly means npm does not set npm_package_version, so the
# app reads its version from package.json itself (see app.js and templateEngine/index.js).
CMD ["node", "./bin/www"]


