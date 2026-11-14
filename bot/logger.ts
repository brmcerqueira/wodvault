import { ConsoleHandler, getLogger, LevelName, setup } from "@std/log";
import { sprintf } from "@std/fmt/printf";

setup({
  handlers: {
    default: new ConsoleHandler("NOTSET", {
      formatter: (rec) =>
        `${rec.levelName} [${rec.datetime.toISOString()}] ${
          rec.args.length > 0
            ? sprintf(
              rec.msg,
              ...rec.args.map((arg) => {
                switch (typeof arg) {
                  case "object":
                    return JSON.stringify(arg);
                  case "undefined":
                    return "undefined";
                  default:
                    return arg;
                }
              }),
            )
            : rec.msg
        }`,
    }),
  },
  loggers: {
    default: {
      level: (Deno.env.get("LOG_LEVEL") || "DEBUG") as LevelName,
      handlers: ["default"],
    },
  },
});

export const logger = getLogger();
