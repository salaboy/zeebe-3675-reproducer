const zb = require("zeebe-node");
const uuid = require("uuid");

const NUM_MSGS = 1500;
const zbc = new zb.ZBClient();

const instanceId = uuid.v4();

async function main() {
  zbc.createWorker(null, "add-content", (job, complete) => {
    const content = job.variables.content || [];
    complete.success({
      content: [...content, job.customHeaders.type]
    });
  });

  const _ = zbc.createWorkflowInstanceWithResult("issue-3675", {
    instanceId
  });

  for (let i = 0; i < NUM_MSGS; i++) {
    console.log(`Publishing ${i} of ${NUM_MSGS}...`);
    const msg = {
      name: "CONTENT_2_EVENT",
      correlationKey: instanceId,
      variables: {},
      timeToLive: 3
    };
    await zbc.publishMessage(msg);
  }
  await zbc.publishMessage({
    name: "CONTENT_3_EVENT",
    correlationKey: instanceId,
    variables: {},
    timeToLive: 3
  });
  await new Promise(resolve => setTimeout(() => resolve(), 300));
  await zbc.publishMessage({
    name: "PROJECTION_COMPLETE",
    correlationKey: instanceId,
    variables: {},
    timeToLive: 3
  });
  return _.then(outcome => console.log(outcome));
}

async function awaiter() {
  await zbc.deployWorkflow("./process.bpmn");
  await main();
}

awaiter();
