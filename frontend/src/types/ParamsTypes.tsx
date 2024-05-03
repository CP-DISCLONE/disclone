export interface Params extends Record<string, string | undefined> {
    server_id: string | undefined; // server_id might not be present in the params
}