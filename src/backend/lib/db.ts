import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Declare global interface to avoid 'any'
declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Re-fetch from global in case it was reset or undefined
  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }
  const currentCache = global.mongoose;

  if (currentCache.conn) {
    return currentCache.conn;
  }

  if (!currentCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    currentCache.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        return mongoose;
      }) as any;
  }
  currentCache.conn = await currentCache.promise;
  return currentCache.conn;
}

export default dbConnect;
