export type DataStoreReference = {};
export interface DataStore {
    timestamp(): any;
    add<T extends { [key: string]: any }>(data: T, path: string, ...pathSegments: string[]): Promise<DataStoreReference>;
}