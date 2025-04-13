export class YandexCloudVideoService {
	public static readonly YANDEX_RUNTIME_ID = 'yandex-cloud-player'
	public static readonly YANDEX_RUNTIME_URL =
		'https://runtime.video.cloud.yandex.net/player/js/player-sdk.js'

	static get isReady() {
		return YandexCloudVideoService.ya !== null
	}

	static get ya() {
		return window.Ya ?? null
	}

	static destroy() {
		const s = document.getElementById(
			YandexCloudVideoService.YANDEX_RUNTIME_ID,
		)
		s.remove()
	}
}
