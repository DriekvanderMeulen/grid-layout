class GridOverlay {
	constructor() {
		this.isVisible = false
		this.container = null
		this.config = {
			size: 10,
			columns: 5,
			columnType: 'stretch',
			columnGutter: 20,
			rows: 5,
			rowType: 'stretch',
			rowGutter: 20,
			color: '#FF0000',
			opacity: 10
		}
		this.init()
	}

	init() {
		chrome.storage.sync.get(Object.keys(this.config), (settings) => {
			this.config = { ...this.config, ...settings }
		})
	}

	createContainer() {
		const container = document.createElement('div')
		container.id = 'figma-grid-overlay'
		container.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: 9999;
		`
		return container
	}

	createGrid() {
		const { columns, rows, columnGutter, rowGutter, color, opacity } = this.config
		const container = this.createContainer()

		// Create columns
		const columnContainer = document.createElement('div')
		columnContainer.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: grid;
			grid-template-columns: repeat(${columns}, 1fr);
			gap: 0 ${columnGutter}px;
		`

		for (let i = 0; i < columns; i++) {
			const column = document.createElement('div')
			column.style.cssText = `
				background-color: ${color};
				opacity: ${opacity / 100};
				height: 100%;
			`
			columnContainer.appendChild(column)
		}

		// Create rows
		const rowContainer = document.createElement('div')
		rowContainer.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: grid;
			grid-template-rows: repeat(${rows}, 1fr);
			gap: ${rowGutter}px 0;
		`

		for (let i = 0; i < rows; i++) {
			const row = document.createElement('div')
			row.style.cssText = `
				background-color: ${color};
				opacity: ${opacity / 100};
				width: 100%;
			`
			rowContainer.appendChild(row)
		}

		container.appendChild(columnContainer)
		container.appendChild(rowContainer)
		return container
	}

	show() {
		if (!this.container) {
			this.container = this.createGrid()
			document.body.appendChild(this.container)
		}
		this.container.style.display = 'block'
		this.isVisible = true
	}

	hide() {
		if (this.container) {
			this.container.style.display = 'none'
		}
		this.isVisible = false
	}

	toggle() {
		this.isVisible ? this.hide() : this.show()
	}

	update(newConfig) {
		this.config = { ...this.config, ...newConfig }
		if (this.container) {
			document.body.removeChild(this.container)
			this.container = null
		}
		if (this.isVisible) {
			this.show()
		}
	}
}

const gridOverlay = new GridOverlay()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === 'toggleGrid') {
		gridOverlay.toggle()
	} else if (message.action === 'updateGrid') {
		gridOverlay.update(message.config)
	}
}) 