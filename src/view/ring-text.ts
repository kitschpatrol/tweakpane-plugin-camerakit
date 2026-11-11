import type { NumberTextView, View } from '@tweakpane/core'
import { ClassName } from '@tweakpane/core'
import type { RingView } from './ring'

type Config = {
	ringView: RingView
	textView: NumberTextView
}

const className = ClassName('ckrtxt')

export class RingTextView implements View {
	public readonly element: HTMLElement

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div')
		this.element.classList.add(className())

		const ringElement = doc.createElement('div')
		ringElement.classList.add(className('r'))
		ringElement.append(config.ringView.element)
		this.element.append(ringElement)

		const textElement = doc.createElement('div')
		textElement.classList.add(className('t'))
		textElement.append(config.textView.element)
		this.element.append(textElement)
	}
}
