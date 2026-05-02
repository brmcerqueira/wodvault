import * as log from "$std/log/mod.ts";
import { sprintf } from "$std/fmt/printf.ts";
import { LevelName } from "$std/log/mod.ts";

await log.setup({
    handlers: {
        default: new log.ConsoleHandler("NOTSET", {
            formatter: rec => `${rec.levelName} [${rec.datetime.toISOString()}] ${
                rec.args.length > 0 ? sprintf(rec.msg, ...rec.args.map(arg => { 
                    switch (typeof arg) {
                        case "object":
                            return JSON.stringify(arg);
                        case "undefined":
                            return "undefined";    
                        default:
                            return arg;
                    }
                })): rec.msg}`
        }),
    },
    loggers: {
        default: {
            level: (Deno.env.get("LOG_LEVEL") || "DEBUG") as LevelName,
            handlers: ["default"],
        }
    },
});

export const logger = log.getLogger();