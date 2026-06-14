# drag-editor

一个基于 React + TypeScript + Redux Toolkit + dnd-kit + Koa 的低代码编辑器练手项目。(doing)

## 当前技术栈

### 前端
- React
- TypeScript
- Vite
- Redux Toolkit
- react-redux
- dnd-kit

### 后端
- Koa
- @koa/router
- koa-body
- tsx

## 目录结构

```text
.
├── frontend/   # React + TypeScript + Vite 前端工程
├── backend/    # Koa + TypeScript 后端工程
├── README.md
└── 低代码编辑器-实操开发清单.md
```

## 安装依赖

### 根目录
```bash
npm install
```

### 前端
```bash
cd frontend
npm install
```

### 后端
```bash
cd backend
npm install
```

## 本地开发

### 从根目录启动

启动前端：
```bash
npm run dev:frontend
```

启动后端：
```bash
npm run dev:backend
```

同时启动前后端：
```bash
npm run dev
```

### 默认端口
- 前端开发服务：`http://localhost:5173`
- 后端开发服务：`http://localhost:3001`

## 联调验证

后端健康检查接口：
```bash
curl http://localhost:3001/api/health
```

预期返回：
```json
{"ok":true,"service":"drag-editor-backend"}
```

前端通过 Vite 代理访问后端：
```bash
curl http://localhost:5173/api/health
```
