import { RefObject, useCallback, useEffect, useState } from 'react'
import { useYandexCloudVideoSdk } from './yandex.context.tsx'

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
	const { ya } = useYandexCloudVideoSdk()

	const [element, setElement] =
		useState<YandexCloudVideo.Nullable<HTMLDivElement>>(null)
	const [player, setPlayer] =
		useState<YandexCloudVideo.Nullable<YandexCloudVideo.PlayerSdkApi>>(null)

	const [state, setState] = useState<YandexCloudVideo.PlayerSdkState>({
		currentTime: 0,
		duration: 0,
		error: null,
		muted: false,
		source: null,
		status: null,
		utcStartTime: null,
		videoType: null,
		volume: 0,
	})

	useEffect(() => {
		setElement(ref.current)
	}, [ref.current])

	useEffect(() => {
		if (!ya || !element) return

		const instance = ya.playerSdk.init({
			element,
			source,
			autoplay,
			muted,
			volume,
			hiddenControls,
		})

		if (!instance) return

		setPlayer(instance)

		const updateState = () => setState(instance.getState())

		instance.on('CurrentTimeChange', updateState)
		instance.on('DurationChange', updateState)
		instance.on('MutedChange', updateState)
		instance.on('VolumeChange', updateState)
		instance.on('StatusChange', updateState)

		updateState()

		return () => {
			instance.off('CurrentTimeChange', updateState)
			instance.off('DurationChange', updateState)
			instance.off('MutedChange', updateState)
			instance.off('VolumeChange', updateState)
			instance.on('StatusChange', updateState)

			setPlayer(null)

			if (element) {
				element.innerHTML = ''
			}
		}
	}, [ya, element, source])

	const play = useCallback(() => {
		if (player) return player.play()
	}, [player])

	const pause = useCallback(() => {
		if (player) {
			player.pause()
		}
	}, [player])

	const playback = useCallback(() => {
		if (player) {
			if (player.getState().status === 'play') {
				player.pause()
			} else {
				player.play()
			}
		}
	}, [player])

	const seek = useCallback(
		(time: YandexCloudVideo.Seconds) => {
			if (player) {
				player.seek(time)
			}
		},
		[player],
	)

	const forward = useCallback(() => {
		const newTime = Math.min(
			state?.currentTime + seekRange,
			state?.duration ?? 0,
		)
		seek(newTime)
	}, [state?.currentTime, seekRange, state?.duration, seek])

	const backward = useCallback(() => {
		const newTime = Math.max(state?.currentTime - seekRange, 0)
		seek(newTime)
	}, [state?.currentTime, seekRange, seek])

	const setMuted = useCallback(
		(muted: boolean) => {
			if (player) {
				player.setMuted(muted)
			}
		},
		[player],
	)

	const toggleMuted = useCallback(() => {
		if (player) {
			player.setMuted(!state?.muted)
		}
	}, [state?.muted, player])

	const setVolume = useCallback(
		(volume: YandexCloudVideo.Volume) => {
			if (player) {
				player.setVolume(volume)
			}
		},
		[player],
	)

	const setSource = useCallback(
		(sourceConfig: YandexCloudVideo.PlayerSdkSourceConfig) => {
			if (player) return player.setSource(sourceConfig)
		},
		[player],
	)

	const off = useCallback(
		(
			eventName: YandexCloudVideo.PlayerSdkEvents,
			callback: YandexCloudVideo.PlayerSdkEventHandlers[YandexCloudVideo.PlayerSdkEvents],
		) => {
			if (player) {
				player.off(eventName, callback)
			}
		},
		[player],
	)

	const on = useCallback(
		(
			eventName: YandexCloudVideo.PlayerSdkEvents,
			callback: YandexCloudVideo.PlayerSdkEventHandlers[YandexCloudVideo.PlayerSdkEvents],
		) => {
			if (player) {
				player.on(eventName, callback)
			}
		},
		[player],
	)

	const once = useCallback(
		(
			eventName: YandexCloudVideo.PlayerSdkEvents,
			callback: YandexCloudVideo.PlayerSdkEventHandlers[YandexCloudVideo.PlayerSdkEvents],
		) => {
			if (player) {
				player.once(eventName, callback)
			}
		},
		[player],
	)

	const destroy = useCallback(() => {
		if (player) return player.destroy()
	}, [player])

	const getState = useCallback(() => {
		if (player) return player.getState()
	}, [player])

	return {
		player,
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
