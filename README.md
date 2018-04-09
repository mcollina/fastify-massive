# fastify-massive

[Massive.js][massive] plugin for Fastify.

## Install

npm i fastify-massive

## Usage

```js
'use strict'

const Fasstify = require('fastify')
const massive = require('fastify-massive')
const fastify = Fastify()
fastify.register(massive, {
  massive: connInfo,
  async onLoad(db) {
    // DB is massive isntance
    // use this hook to set up your database
    // if it is needed.
    // We will reload the meta-info after
    // this is completed.
  }
})

fastify.post('/', async (request, reply) => {
  // pages is a table provided by massive.js
  const { pages } = fastify.massive

  // findDoc is a massive.js API to work
  // with documents
  const root = await pages.findDoc({
    title: 'root'
  })

  const toSave = {
    title: 'root',
    body: request.body
  }

  // perform an upsert
  if (root.length > 0) {
    toSave.id = root[0].id
  }

  await pages.saveDoc(toSave)

  reply.code(204)

  return ''
})
```

## License

MIT

[massive]: https://github.com/dmfay/massive-js
