# Reproducer for Issue 3675

This is a reproducer for [#3675](https://github.com/zeebe-io/zeebe/issues/3675).

## To Run

```
git clone https://github.com/jwulf/zeebe-3675-reproducer
npm i
docker-compose up -d 
node index.js
```

You will see the broker throw error 13:

```
(node:89540) UnhandledPromiseRejectionWarning: Error: 13 INTERNAL: Unexpected error occurred during the request processing
```


