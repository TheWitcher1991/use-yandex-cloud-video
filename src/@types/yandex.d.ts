declare global {
	namespace YandexCloudVideo {
		interface Sdk {
			playerApi: PlayerApi
			playerSdk: PlayerSdk
			playerSkin: PlayerSkin
			streamPlayer: StreamPlayer
		}

		interface PlayerApi {
			METHODS: string[]
			timeAPIInit: number
		}

		interface PlayerSdk {
			init(playerSdkInitConfig: PlayerSdkInitConfig): PlayerSdkApi
			preloadScripts: Function
		}

		interface PlayerSkin {
			create: Function
			preloadScripts: Function
		}

		interface StreamPlayer {
			i18nLang: string
			i18nTranslateSandbox: Function
			i18nTranslateSkin: Function
			initDebugPanel: Function
			initErrorScreen: Function
			exp: {
				flags: Record<any, any>
				flagsInited: boolean
				onFlagsInit: Function[]
				slots: any
				testids: any
			}
		}

		interface PlayerSdkSourceParams {
			autoplay?: boolean
			startPosition?: Seconds
		}

		interface PlayerSdkInitConfig extends PlayerSdkSourceParams {
			element: string | HTMLElement
			muted?: boolean
			source: string
			volume?: Volume
			hiddenControls?: string | PlayerSdkHiddenControl[]
		}

		interface PlayerSdkApi {
			destroy(): Promise<void>
			getState(): PlayerSdkState

			off<EventName extends PlayerSdkEvents>(
				eventName: EventName,
				handler: PlayerSdkEventHandlers[EventName],
			): void

			on<EventName extends PlayerSdkEvents>(
				eventName: EventName,
				handler: PlayerSdkEventHandlers[EventName],
			): void

			once<EventName extends PlayerSdkEvents>(
				eventName: EventName,
				handler: PlayerSdkEventHandlers[EventName],
			): void

			pause(): void
			play(): Promise<void>
			seek(time: Seconds): void
			setMuted(muted: boolean): void
			setSource(sourceConfig: PlayerSdkSourceConfig): Promise<void>
			setVolume(volume: Volume): void
		}

		type PlayerSdkEventHandlers = {
			CurrentTimeChange(arg: { currentTime: Nullable<Seconds> }): unknown
			DurationChange(arg: { duration: Nullable<Seconds> }): unknown
			ErrorChange(arg: {
				error: Nullable<PublicIFrameApiErrorInterface>
			}): unknown
			MutedChange(arg: { muted: boolean }): unknown
			SourceChange(arg: { source: Nullable<string> }): unknown
			StatusChange(arg: { status: PlayerSdkStatus }): unknown
			UtcStartTimeChange(arg: { utcStartTime: Nullable<number> }): unknown
			VideoTypeChange(arg: {
				videoType: Nullable<PlayerSdkType>
			}): unknown
			VolumeChange(arg: { volume: Volume }): unknown
			UtcStartTimeChange(arg: { utcStartTime: Nullable<number> }): unknown
			SeekableRangeChange(arg: {
				seekableRange: PlayerSdkRanges[]
			}): unknown
			BufferedRangesChange(arg: {
				bufferedRanges: PlayerSdkRanges[]
			}): unknown
		}

		interface PlayerSdkState {
			currentTime: Nullable<Seconds>
			duration: Nullable<Seconds>
			error: Nullable<PublicIFrameApiErrorInterface>
			muted: boolean
			source: Nullable<string>
			status: Nullable<PlayerSdkStatus>
			utcStartTime: Nullable<number>
			videoType: Nullable<PlayerSdkType>
			volume: Volume
		}

		type PlayerSdkSourceConfig = string | PlayerSdkSourceObjectConfig

		type PlayerSdkSourceObjectConfig = Pick<
			PlayerSdkInitConfig,
			'source' | 'autoplay' | 'startPosition'
		>

		interface PublicIFrameApiErrorInterface {
			code: string
			message: string
		}

		interface PlayerSdkRanges {
			start: Seconds
			end: Seconds
		}

		type Seconds = number

		type Volume = number

		type Nullable<T> = T | null

		type PlayerSdkEvents = keyof PlayerSdkEventHandlers

		type PlayerSdkHiddenControl =
			| '*'
			| '!play'
			| '!contextMenu'
			| '!fullscreen'
			| '!live'
			| '!mobileSeekButtons'
			| '!nextAdInfo'
			| '!playbackRate'
			| '!poster'
			| '!preloader'
			| '!settings'
			| '!startScreen'
			| '!startScreenPlay'
			| '!subtitlesToggle'
			| '!timeline'
			| '!timelinePreview'
			| '!time'
			| '!title'
			| '!sound'
			| '!volumeSlider'
			| 'play'
			| 'contextMenu'
			| 'fullscreen'
			| 'live'
			| 'mobileSeekButtons'
			| 'nextAdInfo'
			| 'playbackRate'
			| 'poster'
			| 'preloader'
			| 'settings'
			| 'startScreen'
			| 'startScreenPlay'
			| 'subtitlesToggle'
			| 'timeline'
			| 'timelinePreview'
			| 'time'
			| 'title'
			| 'sound'
			| 'volumeSlider'

		type PlayerSdkStatus =
			| 'idle'
			| 'init'
			| 'buffering'
			| 'play'
			| 'pause'
			| 'end'
			| 'fatal'
			| 'broken'
			| 'destroyed'
			| 'cancelled'
			| 'preparing'
			| 'finished'

		type PlayerSdkType = undefined | 'VOD' | 'EVENT' | 'LIVE'
	}

	interface Window {
		Ya: YandexCloudVideo.Sdk
	}
}

export {}
