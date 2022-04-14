import { Pane } from 'tweakpane'
import * as THREE from 'three'
import Experience from '../experience'

export default class Debug {
	constructor() {
		this.experience = new Experience()

		this.ui = new Pane({
			title: 'Config',
		})
        if (window.location.hash !== '#debug') this.ui.dispose()
	}
}
