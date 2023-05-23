# atproto starter kit

Use this as a template repo. Requires Node 18+. Add your bluesky username and password to `.env` then run your app with `npm run start` or `ts-node index.ts`.

API documentation can be found here: [https://github.com/bluesky-social/atproto/tree/main/packages/api](https://github.com/bluesky-social/atproto/tree/main/packages/api)

This is then deployed onto fly.io, which you can find instructions for here: https://fly.io/docs/getting-started/. Unfortunately I had to modify my generated Docker file to get it to build correctly since I was having issues properly running `ts-node` on fly.io (it now compiles and then runs the compiled javascript using normal node).

To get started, you can copy this repo, replace your bot logic with your own, fill out `.env` with the appropriate user credentials and then run `fly launch` and `fly deploy`. You will have to add the environment variables into fly.io using `fly secrets set` (see the fly.io docs for more info).
