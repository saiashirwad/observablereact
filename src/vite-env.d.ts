/// <reference types="vite/client" />

interface ImportMetaHot {
	data: Record<string, any>
	dispose(cb: (data: Record<string, any>) => void): void
	accept(): void
}

interface ImportMeta {
	hot?: ImportMetaHot
}
