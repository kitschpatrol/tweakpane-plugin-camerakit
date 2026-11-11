import type { BaseInputParams, Constraint, NumberTextInputParams } from '@tweakpane/core'
import { CompositeConstraint, createRangeConstraint, createStepConstraint } from '@tweakpane/core'
import type { RingUnit } from './view/ring'

export type RingSeries = 0 | 1 | 2

export type RingInputParams = BaseInputParams &
	NumberTextInputParams & {
		series?: RingSeries
		unit?: RingUnit
		view: 'cameraring'
		wide?: boolean
	}

export type WheelInputParams = BaseInputParams &
	NumberTextInputParams & {
		amount?: number
		view: 'camerawheel'
		wide?: boolean
	}

/** Compose range and step constraints for ring and wheel values. */
export function createConstraint(params: RingInputParams | WheelInputParams): Constraint<number> {
	const constraints = []
	const cr = createRangeConstraint(params)
	if (cr) {
		constraints.push(cr)
	}

	const cs = createStepConstraint(params)
	if (cs) {
		constraints.push(cs)
	}

	return new CompositeConstraint(constraints)
}
