import type { Formatter, InputBindingPlugin } from '@tweakpane/core'
import {
	createNumberFormatter,
	createNumberTextInputParamsParser,
	createNumberTextPropsObject,
	createPlugin,
	getDecimalDigits,
	numberFromUnknown,
	parseNumber,
	parseRecord,
	ValueMap,
	writePrimitive,
} from '@tweakpane/core'
import type { RingInputParams, RingSeries } from './util'
import type { RingUnit } from './view/ring'
import { RingController } from './controller/ring'
import { RingTextController } from './controller/ring-text'
import { createConstraint } from './util'

function parseSeries(value: unknown): RingSeries | undefined {
	switch (value) {
		case 0:
		case 1:
		case 2: {
			return value
		}

		default: {
			return undefined
		}
	}
}

function getRingSeries(series: RingSeries | undefined): string {
	return series === undefined ? '0' : String(series)
}

function createRingFormatter(ringUnit: RingUnit): Formatter<number> {
	const f = createNumberFormatter(getDecimalDigits(ringUnit.value))
	return (value: number): string => {
		const text = f(value)
		const ch = text.slice(0, 1)
		const hasSign = ch === '-' || ch === '+'
		return text + (hasSign ? ' ' : '')
	}
}

export const RingInputPlugin: InputBindingPlugin<number, number, RingInputParams> = createPlugin({
	accept(exValue: unknown, params) {
		if (typeof exValue !== 'number') {
			return null
		}

		const result = parseRecord<RingInputParams>(params, (p) => ({
			...createNumberTextInputParamsParser(p),

			series: p.optional.custom(parseSeries),
			unit: p.optional.object({
				pixels: p.required.number,
				ticks: p.required.number,
				value: p.required.number,
			}),
			view: p.required.constant('cameraring'),
			wide: p.optional.boolean,
		}))
		return result
			? {
					initialValue: exValue,
					params: result,
				}
			: null
	},
	binding: {
		constraint: (args) => createConstraint(args.params),
		reader: (_args) => numberFromUnknown,
		writer: (_args) => writePrimitive,
	},
	controller(args) {
		const ringUnit = args.params.unit ?? {
			pixels: 40,
			ticks: 5,
			value: 10,
		}
		const ringFormatter = createRingFormatter(ringUnit)
		const textPropsObject = createNumberTextPropsObject(args.params, args.initialValue)

		if (args.params.wide) {
			return new RingController(args.document, {
				formatters: {
					ring: ringFormatter,
					text: textPropsObject.formatter,
				},
				seriesId: getRingSeries(args.params.series),
				tooltipEnabled: true,
				unit: ringUnit,
				value: args.value,
				viewProps: args.viewProps,
			})
		}

		const textProps = ValueMap.fromObject(textPropsObject)
		return new RingTextController(args.document, {
			parser: parseNumber,
			ringFormatter,
			ringUnit,
			seriesId: getRingSeries(args.params.series),
			textProps,
			value: args.value,
			viewProps: args.viewProps,
		})
	},
	id: 'input-ring',
	type: 'input',
})
