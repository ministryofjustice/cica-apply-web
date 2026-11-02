# Follow-up: multi-stage Dockerfile to remove npm/build tooling from the runtime image

> Scratch note for a follow-up PR. Safe to delete once the work is tracked in a ticket.

## Problem

The current runtime image ships npm's entire global install tree (npm → node-gyp →
undici, brace-expansion, ip-address, tar, picomatch, postcss-selector-parser, etc.).
None of this tooling is needed to *run* the app — it's only used at install/build
time. Because it's physically present in the final image, Snyk's container scan sees
it and flags it, which is why `.snyk` carries a growing list of "build-time tool only /
build-CLI tooling only" ignores.

Current `Dockerfile` makes this worse by downgrading npm:

```dockerfile
FROM node:24.22.1-trixie-slim as base
USER root
RUN npm install -g npm@11.18.0      # downgrades from the image's bundled 11.19.1
...
CMD [ "npm", "start" ]              # keeps npm in the runtime path
```

### Consequences
- Every `.snyk` entry tagged "build-time only" exists *solely* because this tooling is
  in the runtime image. They are version-pinned to Snyk vuln IDs, so they go stale
  whenever npm's bundled tree shifts (already seen: npm 11.18.0 → 11.19.1 changed the
  undici 6.27.0 → 6.28.0 cluster and produced a whole new set of IDs to re-ignore).
- All current `.snyk` ignores expire `2026-11-09`, so this is on a renewal treadmill.
- `npm start` in `CMD` keeps npm and its lifecycle-script path in the runtime attack
  surface for no runtime benefit.

## Proposed solution

Adopt a multi-stage build that keeps build tooling in a builder stage and ships only
the pruned app + production `node_modules` in the runtime stage, then strips npm/npx
from the final image. Model it on the pattern already used in
`cica-review-case-documents`:
https://github.com/ministryofjustice/cica-review-case-documents/blob/main/Dockerfile

### Sketch (to be adapted for this repo)

```dockerfile
# --- Stage 1: builder ---
FROM node:24-trixie-slim@sha256:<pin-digest> AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# this repo has no sass/build step today; add build commands here if introduced
RUN npm prune --omit=dev

# --- Stage 2: runtime ---
FROM node:24-trixie-slim@sha256:<pin-digest>

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

# RDS CA bundle (currently ADD'd in the single-stage Dockerfile)
ADD --chown=dc_user https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem ./ca/rds-combined-ca-bundle.pem

# remove npm/npx from the runtime image so the container scan's "lib" project
# (npm's global install) disappears entirely
RUN rm -rf /usr/local/lib/node_modules/npm && \
    rm -f /usr/local/bin/npm /usr/local/bin/npx

RUN groupadd -g 1014 dc_user && useradd -rm -d /usr/src/app -u 1015 -g dc_user dc_user
RUN chown -R dc_user:dc_user /usr/src/app

USER 1015

EXPOSE 3100

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# run node directly instead of `npm start` to drop npm from the runtime path
CMD ["node", "./bin/www"]
```

### Notes / decisions to confirm
- **Drop the `npm install -g npm@11.18.0` downgrade.** It pins the older node-gyp/undici
  6.27.0 tree. The builder stage can just use the image's bundled npm; nothing in the
  runtime stage needs npm at all.
- **Pin the base image by digest** (`@sha256:...`) in both stages, as the reference does,
  for reproducible builds.
- **`CMD` → `node ./bin/www`** matches the existing `start` script (`node ./bin/www`),
  so behaviour is unchanged.
- **CI impact:** the `snyk container test ... --severity-threshold=high --policy-path=.snyk`
  step should see far fewer (ideally zero) "lib" findings once npm is gone. After the
  change, prune `.snyk` of the now-unnecessary build-tooling ignores
  (undici 6.x, brace-expansion, ip-address, tar, picomatch, postcss-selector-parser).
- **Out of scope for this note:** base-OS findings (`SNYK-DEBIAN13-*` zlib/attr/acl) are
  separate — they come from the base image, not npm, and a multi-stage build won't
  remove them. Those still need a base-image bump when Debian publishes fixes.
- **This does NOT replace the `overrides.undici` pin.** That pin governs the *runtime*
  undici (7.x via cheerio), which stays in the image regardless. Different concern.
```
