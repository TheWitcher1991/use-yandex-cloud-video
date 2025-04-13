import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react'
import { YandexCloudVideoService } from './yandex.service.ts'
import { loadAsyncDynamicScript } from './yandex.utils.ts'

export interface YandexCloudVideoSdkContextValue {
	ya: YandexCloudVideo.Nullable<YandexCloudVideo.Sdk>
	isReady: boolean
}

export const YandexCloudVideoSdkContext =
	createContext<YandexCloudVideo.Nullable<YandexCloudVideoSdkContextValue>>(
		null,
	)

export function YandexCloudVideoSdkProvider({ children }: PropsWithChildren) {
	const [ya, setYa] =
		useState<YandexCloudVideo.Nullable<YandexCloudVideo.Sdk>>(null)
	const [isReady, setIsReady] = useState<boolean>(false)

	useEffect(() => {
		const init = async () => {
			if (YandexCloudVideoService.isReady) {
				setYa(YandexCloudVideoService.ya)
				setIsReady(true)
				return
			}

			try {
				await loadAsyncDynamicScript({
					id: YandexCloudVideoService.YANDEX_RUNTIME_ID,
					src: YandexCloudVideoService.YANDEX_RUNTIME_URL,
				})
				setYa(YandexCloudVideoService.ya)
				setIsReady(true)
			} catch {
				setYa(null)
				setIsReady(false)
			}
		}

		init()

		return () => {
			YandexCloudVideoService.destroy()
			setYa(null)
			setIsReady(false)
		}
	}, [])

	return (
		<YandexCloudVideoSdkContext
			value={{
				ya,
				isReady,
			}}
		>
			{children}
		</YandexCloudVideoSdkContext>
	)
}

export const useYandexCloudVideoSdk = (): YandexCloudVideoSdkContextValue => {
	const context = useContext(YandexCloudVideoSdkContext)
	if (!context) {
		throw new Error(
			'useYandexCloudVideoSdk must be used within a YandexCloudVideoSdkProvider',
		)
	}
	return context
}
