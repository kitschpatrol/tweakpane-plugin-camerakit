import type {
	Formatter,
	PointerHandlerEvent,
	Value,
	ValueController,
	ViewProps,
} from '@tweakpane/core'
import { createValue, PointerHandler } from '@tweakpane/core'
import type { RingUnit } from '../view/ring'
import { RingView } from '../view/ring'

type Config = {
	formatters: {
		ring: Formatter<number>
		text: Formatter<number>
	}
	seriesId: string
	tooltipEnabled: boolean
	unit: RingUnit
	value: Value<number>
	viewProps: ViewProps
}

export class RingController implements ValueController<number, RingView> {
	public readonly value: Value<number>
	public readonly view: RingView
	public readonly viewProps: ViewProps
	private ov_ = 0
	private ox_ = 0
	private readonly showsTooltip_: Value<boolean>
	private readonly tooltipEnabled_: boolean
	private readonly unit_: RingUnit

	constructor(doc: Document, config: Config) {
		this.onPointerDown_ = this.onPointerDown_.bind(this)
		this.onPointerMove_ = this.onPointerMove_.bind(this)
		this.onPointerUp_ = this.onPointerUp_.bind(this)

		this.value = config.value
		this.viewProps = config.viewProps
		this.tooltipEnabled_ = config.tooltipEnabled
		this.unit_ = config.unit

		this.showsTooltip_ = createValue<boolean>(false)
		this.view = new RingView(doc, {
			formatters: config.formatters,
			seriesId: config.seriesId,
			showsTooltip: this.showsTooltip_,
			unit: config.unit,
			value: this.value,
			viewProps: this.viewProps,
		})

		const ptHandler = new PointerHandler(this.view.element)
		ptHandler.emitter.on('down', this.onPointerDown_)
		ptHandler.emitter.on('move', this.onPointerMove_)
		ptHandler.emitter.on('up', this.onPointerUp_)
	}

	private onPointerDown_(event: PointerHandlerEvent) {
		const { data } = event
		if (!data.point) {
			return
		}

		this.ox_ = data.point.x
		this.ov_ = this.value.rawValue
		if (this.tooltipEnabled_) {
			this.showsTooltip_.rawValue = true
		}
	}

	private onPointerMove_(event: PointerHandlerEvent) {
		const { data } = event
		if (!data.point) {
			return
		}

		const dx = data.point.x - this.ox_
		const uw = this.unit_.pixels
		const uv = this.unit_.value
		this.value.setRawValue(this.ov_ - (dx / uw) * uv, {
			forceEmit: false,
			last: false,
		})
	}

	private onPointerUp_() {
		this.value.setRawValue(this.value.rawValue, {
			forceEmit: true,
			last: true,
		})
		this.showsTooltip_.rawValue = false
	}
}
