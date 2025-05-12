import { Hono } from 'hono'
import { createClient } from 'redis'

const app = new Hono()
const redis = createClient({ url: 'redis://redis:6379' })

await redis.connect()

// Ruta principal
app.get('/', async (c) => {
  const count = await redis.incr('visits')
  return c.text(`Hola! Esta página ha sido visitada ${count} veces.`)
})

// Agregar clave/valor a Redis
app.get('/add/:key/:value', async (c) => {
  const { key, value } = c.req.param()
  await redis.set(key, value)
  return c.text(`Se guardó: ${key} = ${value}`)
})

// Obtener valor de una clave
app.get('/get/:key', async (c) => {
  const { key } = c.req.param()
  const value = await redis.get(key)
  if (value === null) {
    return c.text(`La clave "${key}" no existe.`)
  }
  return c.text(`${key} = ${value}`)
})

// Mostrar todas las claves y valores
app.get('/all', async (c) => {
  const keys = await redis.keys('*')
  const result = {}
  for (const key of keys) {
    const value = await redis.get(key)
    result[key] = value
  }
  return c.json(result)
})

// Reset del contador
app.get('/reset', async (c) => {
  await redis.set('visits', 0)
  return c.text('Contador reiniciado.')
})

export default app
