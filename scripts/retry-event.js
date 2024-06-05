const { webhookSvc } = require("../services/webhook");
const { PrismaClient } = require("@prisma/client");
const { EVENT_STATUS } = require("../utils/constans");

const prisma = new PrismaClient();

async function run() {
  const failedEventLogs = await prisma.eventLog.findMany({
    where: {
      OR: [{ status: EVENT_STATUS.FAILED }],
    },
    orderBy: {
      created_at: "asc",
    },
    take: 1,
  });

  for (const log of failedEventLogs) {
    printLog(`trigger ${log.id}`)
    try {
      await prisma.eventLog.update({
        where: {
          id: log.id,
        },
        data: {
          status: EVENT_STATUS.ON_PROCESS,
        },
      });
      await webhookSvc(log.data, log.client_id);
      let retry = log.retry;
      retry++;
      await prisma.eventLog.update({
        where: {
          id: log.id,
        },
        data: {
          status: EVENT_STATUS.SUCCESS,
          retry
        },
      });
    } catch (error) {
      const message =
        error.response && error.response.data
          ? error.response.data.error_description || error.message
          : error.message;

      // max retry is 3
      if (log.retry >= 3) {
        await prisma.eventLog.update({
          where: {
            id: log.id,
          },
          data: {
            status: EVENT_STATUS.FAILED,
          },
        });
        return;
      }

      const currentErrors = log.errors || [];
      currentErrors.push({
        message,
        date: new Date(),
      });

      let retry = log.retry;
      retry++;
      await prisma.eventLog.update({
        where: {
          id: log.id,
        },
        data: {
          status: EVENT_STATUS.FAILED,
          errors: currentErrors,
          retry,
        },
      });
    }
  }
  await prisma.$disconnect();
}

function printLog(message) {
    const timestamp = new Date().toISOString();
    const prefix = `${timestamp} runner:`;
    // let m = typeof formattedMessage === "object" ? JSON.stringify(formattedMessage) : formattedMessage;
    // console.log(m);
    console.log(prefix, message)
}

(async () => {
  let infinite = true
  while(infinite) {
    try {
        // eslint-disable-next-line no-constant-condition
        await run();
      } catch (error) {
        // infinite = false;
        printLog("Error to run the script:" + error);
      }
  }
})();
