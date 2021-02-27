const MongoClient = require("mongodb").MongoClient;
const BigNumber = require("bignumber.js");
const cron = require("node-cron");
const { wsCache } = require("../ws/cache");

const {
  MONGO_URL,
  MONGO_DB,
  MONGO_OPTIONS,
  EXPIRE_1M,
  EXPIRE_24H,
  EXPIRE_48H,
  EXPIRE_1W,
  TOTAL_CONFIRMATIONS_COLLECTION,
  TOTAL_CONFIRMATIONS_KEY_24H,
  TOTAL_CONFIRMATIONS_KEY_48H,
  TOTAL_NANO_VOLUME_COLLECTION,
  TOTAL_NANO_VOLUME_KEY_24H,
  TOTAL_NANO_VOLUME_KEY_48H,
  LARGE_TRANSACTIONS,
  CONFIRMATIONS_PER_SECOND,
} = require("../constants");
const { rawToRai } = require("../utils");

let db;
MongoClient.connect(MONGO_URL, MONGO_OPTIONS, (_err, client) => {
  if (_err) {
    throw _err;
  }

  db = client.db(MONGO_DB);

  db.collection(LARGE_TRANSACTIONS).createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: EXPIRE_1W },
  );
  db.collection(CONFIRMATIONS_PER_SECOND).createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: EXPIRE_1M },
  );
  db.collection(TOTAL_CONFIRMATIONS_COLLECTION).createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: EXPIRE_48H },
  );
  db.collection(TOTAL_NANO_VOLUME_COLLECTION).createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: EXPIRE_48H },
  );
});

cron.schedule("*/3 * * * * *", async () => {
  if (!db) return;

  db.collection(CONFIRMATIONS_PER_SECOND)
    .aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - EXPIRE_1M * 1000),
          },
        },
      },
      { $group: { _id: null, confirmationsPerSecond: { $sum: "$value" } } },
    ])
    .toArray((_err, [{ confirmationsPerSecond = 0 } = {}] = []) => {
      wsCache.set(
        CONFIRMATIONS_PER_SECOND,
        new BigNumber(confirmationsPerSecond).dividedBy(EXPIRE_1M).toFormat(2),
      );
    });
});

cron.schedule("*/10 * * * * *", async () => {
  if (!db) return;

  db.collection(TOTAL_CONFIRMATIONS_COLLECTION)
    .aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - EXPIRE_24H * 1000),
          },
        },
      },
      { $group: { _id: null, totalConfirmations: { $sum: "$value" } } },
    ])
    .toArray((_err, [{ totalConfirmations = 0 } = {}] = []) => {
      wsCache.set(TOTAL_CONFIRMATIONS_KEY_24H, totalConfirmations);
    });

  db.collection(TOTAL_CONFIRMATIONS_COLLECTION)
    .aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - EXPIRE_48H * 1000),
          },
        },
      },
      { $group: { _id: null, totalConfirmations: { $sum: "$value" } } },
    ])
    .toArray((_err, [{ totalConfirmations = 0 } = {}] = []) => {
      wsCache.set(TOTAL_CONFIRMATIONS_KEY_48H, totalConfirmations);
    });

  db.collection(TOTAL_NANO_VOLUME_COLLECTION)
    .aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - EXPIRE_24H * 1000),
          },
        },
      },
      { $group: { _id: null, totalNanoVolume: { $sum: "$value" } } },
    ])
    .toArray((_err, [{ totalNanoVolume = 0 } = {}] = []) => {
      wsCache.set(TOTAL_NANO_VOLUME_KEY_24H, rawToRai(totalNanoVolume));
    });

  db.collection(TOTAL_NANO_VOLUME_COLLECTION)
    .aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - EXPIRE_48H * 1000),
          },
        },
      },
      { $group: { _id: null, totalNanoVolume: { $sum: "$value" } } },
    ])
    .toArray((_err, [{ totalNanoVolume = 0 } = {}] = []) => {
      wsCache.set(TOTAL_NANO_VOLUME_KEY_48H, rawToRai(totalNanoVolume));
    });
});
