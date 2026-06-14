import { useState } from 'react'
import { fetchHealth, type HealthResponse } from '@/services/api/health'
import '@/styles/app.css'

type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

function App() {
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [result, setResult] = useState<HealthResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleCheckBackend = async () => {
    try {
      setStatus('loading')
      setErrorMessage('')

      const data = await fetchHealth()

      setResult(data)
      setStatus('success')
    } catch (error) {
      setResult(null)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  return (
    <main className="app-shell">
      <section className="panel">
        <p className="eyebrow">Phase 0</p>
        <h1>低代码编辑器初始化工程</h1>
        <p className="description">
          当前页面用于验证前端 React 工程、Vite 代理和后端 Koa 服务是否已经打通。
        </p>

        <div className="actions">
          <button type="button" className="primary-button" onClick={handleCheckBackend}>
            {status === 'loading' ? '检查中...' : '检查后端健康状态'}
          </button>
        </div>

        <div className="result-card">
          <p className="result-label">当前状态</p>
          <p className={`status status-${status}`}>{status}</p>

          {result ? (
            <pre className="result-content">{JSON.stringify(result, null, 2)}</pre>
          ) : null}

          {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
        </div>
      </section>
    </main>
  )
}

export default App
