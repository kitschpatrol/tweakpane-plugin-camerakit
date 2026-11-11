import type { InputBindingPlugin } from '@tweakpane/core'
import {
	createNumberFormatter,
	createNumberTextInputParamsParser,
	createNumberTextPropsObject,
	createPlugin,
	numberFromUnknown,
	parseNumber,
	parseRecord,
	ValueMap,
	writePrimitive,
} from '@tweakpane/core'
import type { WheelInputParams } from './util'
import { RingController } from './controller/ring'
import { RingTextController } from './controller/ring-text'
import { createConstraint } from './util'

export const WheelInputPlugin: InputBindingPlugin<number, number, WheelInputParams> = createPlugin({
	accept(exValue: unknown, params) {
		if (typeof exValue !== 'number') {
			return null
		}

		const result = parseRecord<WheelInputParams>(params, (p) => ({
			...createNumberTextInputParamsParser(p),

			amount: p.optional.number,
			view: p.required.constant('camerawheel'),
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
		const ringFormatter = createNumberFormatter(0)
		const textPropsObject = createNumberTextPropsObject(args.params, args.initialValue)

		if (args.params.wide) {
			return new RingController(args.document, {
				formatters: {
					ring: ringFormatter,
					text: textPropsObject.formatter,
				},
				seriesId: 'w',
				tooltipEnabled: true,
				unit: {
					pixels: 40,
					ticks: 10,
					value: (args.params.amount ?? textPropsObject.pointerScale) * 40,
				},
				value: args.value,
				viewProps: args.viewProps,
			})
		}

		return new RingTextController(args.document, {
			parser: parseNumber,
			ringFormatter,
			ringUnit: {
				pixels: 40,
				ticks: 10,
				value: (args.params.amount ?? textPropsObject.pointerScale) * 40,
			},
			seriesId: 'w',
			textProps: ValueMap.fromObject(textPropsObject),
			value: args.value,
			viewProps: args.viewProps,
		})
	},
	id: 'input-wheel',
	type: 'input',
})
