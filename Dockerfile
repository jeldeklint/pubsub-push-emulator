FROM google/cloud-sdk:alpine

RUN apk --update add openjdk8-jre nodejs npm && gcloud components install beta pubsub-emulator

COPY setup.js .
COPY package*.json .
RUN npm ci --only=production

COPY entrypoint.sh .

EXPOSE 8681
ENV PUBSUB_EMULATOR_HOST=localhost:8681
ENTRYPOINT ["./entrypoint.sh"]