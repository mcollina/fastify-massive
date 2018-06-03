# fastify-massive

[Massive.js][massive] plugin for [Fastify](https://www.fastify.io/).

## Install

`npm i fastify-massive`

## Usage

```js
'use strict'

const Fastify = require('fastify')
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

fastify.get('/', async (req, res) => {
  // list available tables
  return fastify.massive.listTables()
})

fastify.post('/', async (request, reply) => {
  // pages is a document table provided by massive.js
  const { pages } = fastify.massive

  // findDoc is a massive.js API to work
  // with documents
  const root = await pages.findDoc({
    title: 'root'
  })
  
  if (!root) {
    root = {}
  }
  
  root.body = request.body

  // saveDoc performs an upsert to create or update
  // the document as appropriate
  await pages.saveDoc(root)

  reply.code(204)

  return ''
})
```

## License

MIT

[massive]: https://github.com/dmfay/massive-js
