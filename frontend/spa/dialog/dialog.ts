import { createRef } from "react";
import { DialogBody } from "./dialogBody.ts";
import { DialogModal } from "./dialogModal.tsx";

export const dialogRef = createRef<DialogModal>();

export async function dialog<T>(body: DialogBody<T>): Promise<T> {
    return await dialogRef.current!.show(body);
}