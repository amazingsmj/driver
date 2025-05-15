FROM node:20.18.3

WORKDIR /apps/frontend

COPY ./apps/frontend .

RUN npm install

CMD [ "npm", "run", "deploy" ]