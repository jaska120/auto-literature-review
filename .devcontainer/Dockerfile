FROM mcr.microsoft.com/devcontainers/javascript-node

COPY .nvmrc /tmp/.nvmrc

RUN su node -c "\
  source /usr/local/share/nvm/nvm.sh \
  && nvm install $(cat /tmp/.nvmrc) \
  && nvm use $(cat /tmp/.nvmrc)"

