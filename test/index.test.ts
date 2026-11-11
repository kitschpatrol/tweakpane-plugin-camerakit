import type { BindingApi } from '@tweakpane/core'
import { Pane } from 'tweakpane'
import { afterEach, describe, expect, it } from 'vitest'
import * as plugin from '../src/index'
import { RingInputPlugin } from '../src/plugin-ring'
import { WheelInputPlugin } from '../src/plugin-wheel'

type Change = { last: boolean; value: number }

/**
 * Create a mouse event with a page position. happy-dom has no layout, so
 * `pageX` is not derived from the client position.
 */
function createMouseEvent(type: string, pageX: number): MouseEvent {
	const event = new MouseEvent(type, { bubbles: true })
	Object.defineProperty(event, 'pageX', { value: pageX })
	return event
}

/** Drag horizontally from one page position to another. */
function drag(element: HTMLElement, fromX: number, toX: number): void {
	element.dispatchEvent(createMouseEvent('mousedown', fromX))
	element.ownerDocument.dispatchEvent(createMouseEvent('mousemove', toX))
	element.ownerDocument.dispatchEvent(createMouseEvent('mouseup', toX))
}

/** Record the change events a binding emits. */
function recordChanges(binding: BindingApi<unknown, number>): Change[] {
	const changes: Change[] = []
	binding.on('change', (event) => {
		changes.push({ last: event.last, value: event.value })
	})
	return changes
}

describe('camerakit plugin', () => {
	let pane: Pane | undefined

	afterEach(() => {
		pane?.dispose()
		pane = undefined
	})

	function setup(options: Record<string, unknown>) {
		pane = new Pane()
		pane.registerPlugin(plugin)
		const params = { value: 0 }
		const binding = pane.addBinding(params, 'value', options)
		const ring = binding.element.querySelector<HTMLElement>('.tp-ckrv')
		if (!ring) {
			throw new Error('The ring view was not created')
		}

		const input = binding.element.querySelector('input')
		return { binding, input, pane, params, ring }
	}

	describe('accept', () => {
		it('accepts numbers with the ring view and valid parameters', () => {
			expect(RingInputPlugin.accept(10, { view: 'cameraring' })?.initialValue).toBe(10)
			expect(
				RingInputPlugin.accept(10, {
					max: 20,
					min: 0,
					series: 2,
					step: 1,
					unit: { pixels: 20, ticks: 4, value: 0.5 },
					view: 'cameraring',
					wide: true,
				})?.params,
			).toMatchObject({ series: 2, unit: { pixels: 20, ticks: 4, value: 0.5 }, wide: true })
			expect(RingInputPlugin.accept('10', { view: 'cameraring' })).toBeNull()
			expect(RingInputPlugin.accept(10, {})).toBeNull()
			expect(RingInputPlugin.accept(10, { view: 'camerawheel' })).toBeNull()
			expect(RingInputPlugin.accept(10, { series: 3, view: 'cameraring' })).toBeNull()
			expect(RingInputPlugin.accept(10, { series: '1', view: 'cameraring' })).toBeNull()
			expect(
				RingInputPlugin.accept(10, { unit: { pixels: 20, value: 1 }, view: 'cameraring' }),
			).toBeNull()
			expect(RingInputPlugin.accept(10, { view: 'cameraring', wide: 'yes' })).toBeNull()
			expect(RingInputPlugin.accept(10, { step: '1', view: 'cameraring' })).toBeNull()
		})

		it('accepts numbers with the wheel view and valid parameters', () => {
			expect(WheelInputPlugin.accept(10, { view: 'camerawheel' })?.initialValue).toBe(10)
			expect(
				WheelInputPlugin.accept(10, { amount: 0.5, view: 'camerawheel', wide: true })?.params,
			).toMatchObject({ amount: 0.5, wide: true })
			expect(WheelInputPlugin.accept('10', { view: 'camerawheel' })).toBeNull()
			expect(WheelInputPlugin.accept(10, { view: 'cameraring' })).toBeNull()
			expect(WheelInputPlugin.accept(10, { amount: '1', view: 'camerawheel' })).toBeNull()
			expect(WheelInputPlugin.accept(10, { max: '1', view: 'camerawheel' })).toBeNull()
		})
	})

	it('registers the bundle and installs its compiled styles', () => {
		setup({ view: 'cameraring' })
		expect(plugin.css).toContain('.tp-ckrv')
		expect(plugin.css).toContain('.tp-ckrtxtv')
		expect(plugin.css).not.toContain('@use')
		expect(document.head.textContent).toContain('.tp-ckrv')
	})

	describe('ring', () => {
		it('writes dragged values and emits a final event on release', () => {
			const { binding, params, ring } = setup({ view: 'cameraring' })
			const changes = recordChanges(binding)
			// The default unit is 10 per 40 pixels, and dragging left increases the value
			drag(ring, 100, 60)
			expect(params.value).toBe(10)
			expect(changes).toEqual([
				{ last: false, value: 10 },
				{ last: true, value: 10 },
			])
			drag(ring, 100, 120)
			expect(params.value).toBe(5)
		})

		it('respects step, min, and max while dragging', () => {
			const { params, ring } = setup({ max: 24, min: -15, step: 3, view: 'cameraring' })
			drag(ring, 100, 60)
			expect(params.value).toBe(9)
			drag(ring, 100, 0)
			expect(params.value).toBe(24)
			drag(ring, 0, 400)
			expect(params.value).toBe(-15)
		})

		it('writes values entered in the text input', () => {
			const { binding, input, params } = setup({ view: 'cameraring' })
			if (!input) {
				throw new Error('The text input was not created')
			}

			const changes = recordChanges(binding)
			input.value = '42'
			input.dispatchEvent(new Event('change', { bubbles: true }))
			expect(params.value).toBe(42)
			expect(changes).toEqual([{ last: true, value: 42 }])
		})

		it('shows external changes after refresh', () => {
			const { binding, input, params } = setup({ view: 'cameraring' })
			params.value = 25
			binding.refresh()
			expect(Number(input?.value)).toBe(25)
		})

		it('hides the text input and shows a drag tooltip when wide', () => {
			const { binding, input, ring } = setup({ view: 'cameraring', wide: true })
			expect(input).toBeNull()
			expect(binding.element.querySelector('.tp-ckrtxtv')).toBeNull()

			const tooltip = ring.querySelector('.tp-ckrv_tt')
			ring.dispatchEvent(createMouseEvent('mousedown', 100))
			expect(ring.classList.contains('tp-ckrv-tt')).toBe(true)
			document.dispatchEvent(createMouseEvent('mousemove', 60))
			expect(Number(tooltip?.textContent)).toBe(10)
			document.dispatchEvent(createMouseEvent('mouseup', 60))
			expect(ring.classList.contains('tp-ckrv-tt')).toBe(false)
		})

		it('keeps the tooltip hidden while dragging with a text input', () => {
			const { ring } = setup({ view: 'cameraring' })
			ring.dispatchEvent(createMouseEvent('mousedown', 100))
			expect(ring.classList.contains('tp-ckrv-tt')).toBe(false)
			document.dispatchEvent(createMouseEvent('mouseup', 100))
		})

		it('applies the series modifier class', () => {
			expect(setup({ view: 'cameraring' }).ring.classList.contains('tp-ckrv-m0')).toBe(true)
			pane?.dispose()
			expect(setup({ series: 2, view: 'cameraring' }).ring.classList.contains('tp-ckrv-m2')).toBe(
				true,
			)
		})

		it('builds the scale from the unit option', () => {
			const { binding, params, ring } = setup({
				unit: { pixels: 20, ticks: 4, value: 0.5 },
				view: 'cameraring',
			})
			params.value = 10
			binding.refresh()
			// Without layout the ring spans three units
			expect(ring.querySelectorAll('.tp-ckrv_mjt')).toHaveLength(3)
			expect(ring.querySelectorAll('.tp-ckrv_mnt')).toHaveLength(9)
			expect(
				[...ring.querySelectorAll('line')].slice(0, 5).map((line) => line.getAttribute('x1')),
			).toEqual(['0', '5', '10', '15', '20'])
			expect(Array.from(ring.querySelectorAll('.tp-ckrv_l'), (label) => label.textContent)).toEqual(
				['9.5', '10.0', '10.5'],
			)

			drag(ring, 100, 60)
			expect(params.value).toBe(11)
		})

		it('pads signed scale labels to keep them centered', () => {
			const { binding, params, ring } = setup({
				unit: { pixels: 20, ticks: 4, value: 0.5 },
				view: 'cameraring',
			})
			params.value = 0.5
			binding.refresh()
			params.value = 0
			binding.refresh()
			expect(Array.from(ring.querySelectorAll('.tp-ckrv_l'), (label) => label.textContent)).toEqual(
				['-0.5 ', '0.0', '0.5'],
			)
		})
	})

	describe('wheel', () => {
		it.each([false, true])(
			'writes dragged values scaled by the amount option (wide: %s)',
			(wide) => {
				const { binding, params, ring } = setup({ amount: 0.5, view: 'camerawheel', wide })
				expect(ring.classList.contains('tp-ckrv-mw')).toBe(true)
				const changes = recordChanges(binding)
				drag(ring, 100, 60)
				expect(params.value).toBe(20)
				expect(changes).toEqual([
					{ last: false, value: 20 },
					{ last: true, value: 20 },
				])
			},
		)

		it('respects step, min, and max while dragging', () => {
			const { params, ring } = setup({ amount: 1, max: 28, min: -12, step: 4, view: 'camerawheel' })
			drag(ring, 100, 89)
			expect(params.value).toBe(12)
			drag(ring, 100, 0)
			expect(params.value).toBe(28)
			drag(ring, 0, 400)
			expect(params.value).toBe(-12)
		})

		it('writes values entered in the text input unless wide', () => {
			const { input, params } = setup({ view: 'camerawheel' })
			if (!input) {
				throw new Error('The text input was not created')
			}

			input.value = '7'
			input.dispatchEvent(new Event('change', { bubbles: true }))
			expect(params.value).toBe(7)
			pane?.dispose()
			expect(setup({ view: 'camerawheel', wide: true }).input).toBeNull()
		})
	})

	it('inherits the pane disabled state', () => {
		const { input, pane: currentPane, ring } = setup({ view: 'cameraring' })
		currentPane.disabled = true
		expect(input?.disabled).toBe(true)
		expect(ring.classList.contains('tp-v-disabled')).toBe(true)
		currentPane.disabled = false
		expect(input?.disabled).toBe(false)
		expect(ring.classList.contains('tp-v-disabled')).toBe(false)
	})

	it.each(['cameraring', 'camerawheel'])('removes %s elements when disposed', (view) => {
		const { binding, pane: currentPane, ring } = setup({ view })
		binding.dispose()
		expect(binding.element.isConnected).toBe(false)
		expect(ring.isConnected).toBe(false)
		expect(currentPane.children).not.toContain(binding)
	})
})
