// /**
//  * GENERATED CODE - DO NOT MODIFY
//  */
// import {
//   Client as XrpcClient,
//   ServiceClient as XrpcServiceClient,
// } from '@atproto/xrpc'
// import { schemas } from './lexicons'
// import { CID } from 'multiformats/cid'

// export class AtpBaseClient {
//   xrpc: XrpcClient = new XrpcClient()

//   constructor() {
//     this.xrpc.addLexicons(schemas)
//   }

//   service(serviceUri: string | URL): AtpServiceClient {
//     return new AtpServiceClient(this, this.xrpc.service(serviceUri))
//   }
// }

// export class AtpServiceClient {
//   _baseClient: AtpBaseClient
//   xrpc: XrpcServiceClient

//   constructor(baseClient: AtpBaseClient, xrpcService: XrpcServiceClient) {
//     this._baseClient = baseClient
//     this.xrpc = xrpcService
//   }

//   setHeader(key: string, value: string): void {
//     this.xrpc.setHeader(key, value)
//   }
// }
