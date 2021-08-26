'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const massive = require('.')

const connInfo = 'postgres://postgres:postgres@localhost/postgres'

test('connect, save and load a doc', async (t) => {
  const fastify = Fastify()
  fastify.register(massive, {
    massive: connInfo,
    async onLoad (db) {
      t.pass('onLoad called')

      try {
        await db.query('DELETE FROM pages')
      } catch (err) {
      }

      await db.saveDoc('pages', {
        title: 'root',
        body: { original: 'body' }
      })
    }
  })

  t.teardown(fastify.close.bind(fastify))

  fastify.post('/', async (request, reply) => {
    t.pass('post called')
    const root = await fastify.massive.pages.findDoc({
      title: 'root'
    })
    const toSave = {
      title: 'root',
      body: request.body
    }
    if (root.length > 0) {
      toSave.id = root[0].id
    }

    await fastify.massive.pages.saveDoc(toSave)

    reply.code(204)

    // this would be a redirect in practice
    return ''
  })

  fastify.get('/', async (request, reply) => {
    t.pass('get called')
    const root = await fastify.massive.pages.findDoc({
      title: 'root'
    })
    return root[0].body
  })

  const seedRes = await fastify.inject({
    url: '/',
    method: 'GET'
  })

  t.equal(seedRes.statusCode, 200)
  t.same(seedRes.json(), {
    original: 'body'
  })

  const postRes = await fastify.inject({
    url: '/',
    method: 'POST',
    payload: {
      something: 'else'
    }
  })

  t.equal(postRes.statusCode, 204)

  const getRes = await fastify.inject({
    url: '/',
    method: 'GET'
  })

  t.equal(getRes.statusCode, 200)
  t.same(getRes.json(), {
    something: 'else'
  })
})
