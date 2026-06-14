import { createApp } from './app.js'

const port = Number(process.env.PORT ?? 3001)
const app = createApp()

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`)
})
