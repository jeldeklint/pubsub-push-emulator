import { PubSub } from "@google-cloud/pubsub";

(async () => {
  const projectId = process.env.PROJECT_ID;
  const topics = process.env.TOPICS.split(",");

  const subscriptions = process.env.SUBSCRIPTIONS.split(",").map((s) => {
    const [name, topic, endpoint] = s.split("|");
    return {
      name,
      topic,
      endpoint,
    };
  });

  const pubsub = new PubSub({
    projectId: projectId,
  });

  for await (const topic of topics) {
    await pubsub.createTopic(topic);
    console.log(`Topic ${topic} created.`);
    for await (const subscription of subscriptions.filter(
      (s) => s.topic === topic
    )) {
      const options = {};
      if (subscription.endpoint) {
        options.pushConfig = {
          pushEndpoint: subscription.endpoint,
        };
      }
      await pubsub.topic(topic).createSubscription(subscription.name, options);
      if (subscription.endpoint) {
        console.log(
          `Subscription ${subscription.name} created with push to ${subscription.endpoint}.`
        );
      } else {
        console.log(`Subscription ${subscription.name} created.`);
      }
    }
  }
})();
