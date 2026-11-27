import { generateVapidKey } from "webpush";

const privateKey = await generateVapidKey();
console.log("private key ->", JSON.stringify(privateKey));
