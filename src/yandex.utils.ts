export const loadAsyncDynamicScript = async ({
	src,
	id,
}: {
	src: string
	id: string
}): Promise<void> => {
	const existingScript = document.getElementById(
		id,
	) as HTMLScriptElement | null

	if (existingScript) return

	return new Promise<void>((resolve, reject) => {
		const script = document.createElement('script')
		script.src = src
		script.id = id

		script.onload = () => resolve()
		script.onerror = () =>
			reject(new Error(`Failed to load script: ${src}`))

		document.body.appendChild(script)
	})
}
