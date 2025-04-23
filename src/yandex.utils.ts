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

export const YANDEX_CLOUD_VIDEO_ENDPOINT =
	'https://runtime.video.cloud.yandex.net/player/video'

export const YANDEX_CLOUD_VIDEO_EVENTS: YandexCloudVideo.PlayerSdkEvents[] = [
	'CurrentTimeChange',
	'DurationChange',
	'MutedChange',
	'VolumeChange',
	'StatusChange',
]

export const YANDEX_CLOUD_VIDEO_INIT_STATE: YandexCloudVideo.PlayerSdkState = {
	currentTime: 0,
	duration: 0,
	error: null,
	muted: false,
	source: null,
	status: null,
	utcStartTime: null,
	videoType: null,
	volume: 0,
}
