import type { Client } from "minio"

export type MinioClientWeakMap = WeakMap<Client, Map<string, any>>;