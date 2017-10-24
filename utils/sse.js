const http = require('http')
/**
 * Server-Sent Event Server
 * @author DNA
 * @version 1.0
 * @description A simple Server-sent Event server with wild cross-origin support
 */
const server = http.createServer((request, response) => {
  // headers of SSE(Server-sent Event) & CORS(Cross Origin Resources Sharing)
  response.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  // options
  const options = {
    port: 3003,
    intervalTime: 3000,
    interval: null,
    events: ['connected', 'event1', 'event2', 'event3']
  }
  // SSE content
  response.write(`retry: ${options.interValTime}\n`)
  response.write(`event: ${options.events[0]}\n`)
  response.write(`data: ${new Date().toISOString()}\n\n`)

  options.interval = setInterval(function () {
    // send events randomly
    const index = Math.floor(Math.random() * 3) + 1
    response.write(`event: ${options.events[index]}\n`)
    response.write(`data: ${new Date().toISOString()}\n\n`)
  }, 3000)
  // close
  request.connection.addListener('close', function () {
    clearInterval(options.interval)
    response.end()
  }, false)
})

server.listen(3003)
