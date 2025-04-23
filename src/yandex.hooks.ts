import {
	RefObject,
	useCallback,
	useEffect,
	useState,
	useRef,
	CSSProperties,
} from 'react'
import { useYandexCloudVideoSdk } from './yandex.context.tsx'
import {
	YANDEX_CLOUD_VIDEO_ENDPOINT,
	YANDEX_CLOUD_VIDEO_EVENTS,
	YANDEX_CLOUD_VIDEO_INIT_STATE,
} from '~yandex.utils.ts'

export type UseYandexCloudVideoPlayer = YandexCloudVideo.PlayerSdkInitConfig & {
	ref: RefObject<HTMLDivElement>
	seekRange: YandexCloudVideo.Seconds
}
export const useYandexCloudVideoPlayer = ({
	ref,
	source,
	hiddenControls,
	muted,
	volume,
	autoplay,
	seekRange = 10,
}: UseYandexCloudVideoPlayer) => {
	const { ya, isReady } = useYandexCloudVideoSdk()

	const [state, setState] = useState<YandexCloudVideo.PlayerSdkState>(
		YANDEX_CLOUD_VIDEO_INIT_STATE,
	)
	const [resource, setResource] = useState<string | undefined>(source)

	const playerRef = useRef<YandexCloudVideo.PlayerSdkApi | null>(null)

	useEffect(() => {
		setResource(source)
	}, [source])

	useEffect(() => {
		if (!isReady || !ya || !resource || !ref.current) return

		if (playerRef.current) return

		playerRef.current = ya.playerSdk.init({
			element: ref.current,
			source: resource,
			autoplay,
			muted,
			volume,
			hiddenControls,
		})

		const updateState = () => setState(playerRef.current?.getState())

		YANDEX_CLOUD_VIDEO_EVENTS.forEach(event =>
			playerRef.current?.on(event, updateState),
		)

		updateState()

		return () => {
			YANDEX_CLOUD_VIDEO_EVENTS.forEach(event =>
				playerRef.current?.off(event, updateState),
			)
		}
	}, [ya, resource, isReady, ref.current])

	const play = useCallback(() => playerRef.current?.play(), [])

	const pause = useCallback(() => playerRef.current?.pause(), [])

	const playback = useCallback(() => {
		const current = playerRef.current
		if (current) {
			const status = current.getState().status
			status === 'play' ? current.pause() : current.play()
		}
	}, [])

	const seek = useCallback(
		(time: YandexCloudVideo.Seconds) => playerRef.current?.seek(time),
		[],
	)

	const forward = useCallback(() => {
		const newTime = Math.min(state.currentTime + seekRange, state.duration)
		seek(newTime)
	}, [state, seekRange, seek])

	const backward = useCallback(() => {
		const newTime = Math.max(state.currentTime - seekRange, 0)
		seek(newTime)
	}, [state, seekRange, seek])

	const setMuted = useCallback((muted: boolean) => {
		playerRef.current?.setMuted(muted)
	}, [])

	const toggleMuted = useCallback(() => {
		playerRef.current?.setMuted(!state.muted)
	}, [state.muted])

	const setVolume = useCallback((volume: number) => {
		playerRef.current?.setVolume(volume)
	}, [])

	const setSource = useCallback((sourceConfig: string) => {
		playerRef.current?.setSource(
			`${YANDEX_CLOUD_VIDEO_ENDPOINT}/${sourceConfig}`,
		)
	}, [])

	const setVideoStyle = useCallback((css: CSSProperties) => {
		playerRef.current['store']['playerApi']['setVideoStyle'](css)
	}, [])

	const getState = useCallback(() => playerRef.current?.getState(), [])

	const destroy = useCallback(() => {
		setResource(undefined)
		playerRef.current?.destroy()
		playerRef.current = null
		setState(YANDEX_CLOUD_VIDEO_INIT_STATE)
	}, [])

	const off = useCallback(
		(
			eventName: YandexCloudVideo.PlayerSdkEvents,
			callback: YandexCloudVideo.PlayerSdkEventHandlers[YandexCloudVideo.PlayerSdkEvents],
		) => playerRef.current?.on(eventName, callback),
		[],
	)

	const on = useCallback(
		(
			eventName: YandexCloudVideo.PlayerSdkEvents,
			callback: YandexCloudVideo.PlayerSdkEventHandlers[YandexCloudVideo.PlayerSdkEvents],
		) => playerRef.current?.off(eventName, callback),
		[],
	)

	const once = useCallback(
		(
			eventName: YandexCloudVideo.PlayerSdkEvents,
			callback: YandexCloudVideo.PlayerSdkEventHandlers[YandexCloudVideo.PlayerSdkEvents],
		) => playerRef.current?.once(eventName, callback),
		[],
	)

	return {
		player: playerRef.current,
		play,
		pause,
		playback,
		forward,
		backward,
		seek,
		setMuted,
		toggleMuted,
		setVolume,
		setSource,
		off,
		on,
		once,
		destroy,
		getState,
	}
}
