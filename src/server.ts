import './bootstrap'
import './jobs'

import * as http from 'http'
import * as Koa from 'koa'
import * as KoaRouter from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import * as gzip from 'koa-compress'
import * as cors from '@koa/cors'

import { RegisterRoutes } from './routes'
import * as notifications from './notifications'

const port = process.env.PORT || 4000

const app = new Koa()
app.use(cors())
app.use(bodyParser())
app.use(gzip())

app.use(async (ctx, next) => {
  console.log(ctx.request.url, ctx.request.method)

  await next()
})

// tsoa magic
const router = new KoaRouter()
RegisterRoutes(router)

router.post('/notification', notifications.handler)

app.use(router.routes()).use(router.allowedMethods())

process.on('uncaughtException', (err) => {
  console.error(err)
  process.exit(1)
})

const createAndRunServer = (): http.Server => {
  return app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
  })
}

createAndRunServer()
