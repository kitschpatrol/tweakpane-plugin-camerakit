import type { Formatter, Value, ValueEvents, View, ViewProps } from '@tweakpane/core'
import { ClassName, constrainRange, removeElement, SVG_NS } from '@tweakpane/core'

/**
 * A configuration of a ring unit.
 */
export type RingUnit = {
	/**
	 * The number of pixels for the unit.
	 */
	pixels: number
	/**
	 * The number of ticks for the unit.
	 */
	ticks: number
	/**
	 * The value for the unit.
	 */
	value: number
}

type Config = {
	formatters: {
		ring: Formatter<number>
		text: Formatter<number>
	}
	seriesId: string
	showsTooltip: Value<boolean>
	unit: RingUnit
	value: Value<number>
	viewProps: ViewProps
}

const className = ClassName('ckr')

export class RingView implements View {
	public readonly element: HTMLElement
	private boundsWidth_ = -1
	private readonly formatters_: {
		ring: Formatter<number>
		text: Formatter<number>
	}
	private labelElems_: HTMLElement[] = []
	private readonly offsetElem_: HTMLElement
	private readonly svgElem_: SVGElement
	private tickElems_: SVGLineElement[] = []
	private readonly tooltipElem_: HTMLElement
	private readonly unit_: RingUnit
	private readonly value_: Value<number>

	constructor(doc: Document, config: Config) {
		this.onShowsTooltipChange_ = this.onShowsTooltipChange_.bind(this)
		this.onValueChange_ = this.onValueChange_.bind(this)

		this.formatters_ = config.formatters
		this.unit_ = config.unit

		this.element = doc.createElement('div')
		this.element.classList.add(className(), className(undefined, `m${config.seriesId}`))
		config.viewProps.bindClassModifiers(this.element)

		this.value_ = config.value
		this.value_.emitter.on('change', this.onValueChange_)

		config.showsTooltip.emitter.on('change', this.onShowsTooltipChange_)

		const wrapperElement = doc.createElement('div')
		wrapperElement.classList.add(className('w'))
		this.element.append(wrapperElement)

		this.offsetElem_ = doc.createElement('div')
		this.offsetElem_.classList.add(className('o'))
		wrapperElement.append(this.offsetElem_)

		this.svgElem_ = doc.createElementNS(SVG_NS, 'svg')
		this.svgElem_.classList.add(className('g'))
		this.offsetElem_.append(this.svgElem_)

		this.tooltipElem_ = doc.createElement('div')
		this.tooltipElem_.classList.add(ClassName('tt')(), className('tt'))
		this.element.append(this.tooltipElem_)

		this.waitToBeAdded_()
	}

	public update(): void {
		const bw = this.element.getBoundingClientRect().width
		const uv = this.unit_.value
		const uw = this.unit_.pixels
		const v = this.value_.rawValue
		const halfUnitCount = Math.ceil(bw / 2 / uw) + 1
		const offsetFromCenter = ((v % uv) + uv * halfUnitCount) * (uw / uv)
		const offset = bw / 2 - offsetFromCenter
		this.offsetElem_.style.transform = `translateX(${offset}px)`

		this.tooltipElem_.textContent = this.formatters_.text(v)

		this.rebuildScaleIfNeeded_(bw)
		this.updateScale_(bw)
	}

	private onShowsTooltipChange_(event: ValueEvents<boolean>['change']) {
		if (event.rawValue) {
			this.element.classList.add(className(undefined, 'tt'))
		} else {
			this.element.classList.remove(className(undefined, 'tt'))
		}
	}

	private onValueChange_() {
		this.update()
	}

	private rebuildScaleIfNeeded_(bw: number): void {
		if (this.boundsWidth_ === bw) {
			return
		}

		this.boundsWidth_ = bw

		for (const element of this.tickElems_) {
			removeElement(element)
		}

		this.tickElems_ = []

		for (const element of this.labelElems_) {
			removeElement(element)
		}

		this.labelElems_ = []

		const doc = this.element.ownerDocument
		const tpu = this.unit_.ticks
		const uw = this.unit_.pixels
		const halfUnitCount = Math.ceil(bw / 2 / uw) + 1
		const unitCount = halfUnitCount * 2 + 1
		const tickCount = unitCount * tpu
		const tickWidth = uw / tpu
		for (let i = 0; i < tickCount; i++) {
			const x = i * tickWidth
			const isMajorTick = i % tpu === 0
			const lineElement = doc.createElementNS(SVG_NS, 'line')
			lineElement.classList.add(className(isMajorTick ? 'mjt' : 'mnt'))
			lineElement.setAttributeNS(null, 'x1', String(x))
			lineElement.setAttributeNS(null, 'y1', '0')
			lineElement.setAttributeNS(null, 'x2', String(x))
			lineElement.setAttributeNS(null, 'y2', '2')
			this.svgElem_.append(lineElement)
			this.tickElems_.push(lineElement)

			if (!isMajorTick) {
				continue
			}

			const labelElement = doc.createElement('div')
			labelElement.classList.add(className('l'))
			labelElement.style.left = `${x}px`
			this.offsetElem_.append(labelElement)
			this.labelElems_.push(labelElement)
		}
	}

	private updateScale_(bw: number): void {
		const uv = this.unit_.value
		const uw = this.unit_.pixels
		const v = this.value_.rawValue
		const halfUnitCount = Math.ceil(bw / 2 / uw) + 1
		const ov = v - (v % uv) - uv * halfUnitCount
		const opacity = (tv: number): number =>
			1 - constrainRange(Math.abs(v - tv) / ((bw / 2) * (uv / uw)), 0, 1) ** 10

		for (const [i, element] of this.labelElems_.entries()) {
			const lv = ov + i * uv
			element.textContent = this.formatters_.ring(lv)
			element.style.opacity = String(opacity(lv))
		}

		const tpu = this.unit_.ticks
		for (const [i, element] of this.tickElems_.entries()) {
			const lv = ov + (i / tpu) * uv
			element.style.opacity = String(opacity(lv))
		}
	}

	// Waits to be added to DOM tree to build initial scale elements
	private waitToBeAdded_(): void {
		const ob = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.target !== this.element || entry.intersectionRatio === 0) {
						continue
					}

					this.update()
					ob.disconnect()
				}
			},
			{
				root: null,
			},
		)
		ob.observe(this.element)
	}
}
