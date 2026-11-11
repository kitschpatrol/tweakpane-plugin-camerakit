import { RingInputPlugin } from './plugin-ring'
import { WheelInputPlugin } from './plugin-wheel'
import pluginCss from './styles/plugin.scss?inline'

export const id = 'camerakit'
export const css: string = pluginCss
export const plugins = [RingInputPlugin, WheelInputPlugin]

export type { RingInputParams, RingSeries, WheelInputParams } from './util'
export type { RingUnit } from './view/ring'
