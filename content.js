class GridOverlay {
	constructor() {
		this.overlay = null
		this.settings = null
		this.initialize()
	}

	initialize() {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.type === 'UPDATE_GRID') {
				this.settings = message.settings
				this.updateGrid()
			} else if (message.type === 'HIDE_GRID') {
				this.hideGrid()
			}
		})

		chrome.storage.local.get(['isGridVisible', 'gridSettings'], (data) => {
			if (data.isGridVisible && data.gridSettings) {
				this.settings = data.gridSettings
				this.updateGrid()
			}
		})
	}

	hideGrid() {
		if (this.overlay) {
			this.overlay.remove()
			this.overlay = null
		}
	}

	createOverlay() {
		this.hideGrid()

		this.overlay = document.createElement('div')
		this.overlay.id = 'figma-grid-overlay'
		this.overlay.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: 9999;
		`
		document.body.appendChild(this.overlay)
	}

	updateGrid() {
		this.createOverlay()
		
		const {
			gridType,
			count,
			color,
			opacity,
			type,
			size,
			margin,
			offset,
			gutter
		} = this.settings

		const colorWithOpacity = this.hexToRGBA(color, opacity / 100)

		if (gridType === 'columns') {
			this.createColumnGrid(count, colorWithOpacity, type, size, margin, offset, gutter)
		} else if (gridType === 'rows') {
			this.createRowGrid(count, colorWithOpacity, type, size, margin, offset, gutter)
		} else {
			this.createFullGrid(count, colorWithOpacity, type, size, margin, offset, gutter)
		}
	}

	hexToRGBA(hex, alpha) {
		const r = parseInt(hex.slice(1, 3), 16)
		const g = parseInt(hex.slice(3, 5), 16)
		const b = parseInt(hex.slice(5, 7), 16)
		return `rgba(${r}, ${g}, ${b}, ${alpha})`
	}

	getPositionStyles(type, size, margin, offset, isVertical = false) {
		const styles = []
		const dimension = isVertical ? 'height' : 'width'
		const offsetDir = isVertical ? 'top' : 'left'

		if (type === 'stretch') {
			styles.push(`${dimension}: calc(100% - ${margin * 2}px)`)
			styles.push(`${offsetDir}: ${margin}px`)
		} else {
			styles.push(`${dimension}: ${size}px`)
			
			if (type === 'center') {
				styles.push(`${offsetDir}: 50%`)
				styles.push('transform: ' + (isVertical ? 'translateY(-50%)' : 'translateX(-50%)'))
			} else if (type === 'right' || type === 'bottom') {
				styles.push(`${offsetDir}: calc(100% - ${size}px - ${offset}px)`)
			} else { // left or top
				styles.push(`${offsetDir}: ${offset}px`)
			}
		}

		return styles.join(';')
	}

	createColumnGrid(count, color, type, size, margin, offset, gutter) {
		const positionStyles = this.getPositionStyles(type, size, margin, offset)

		this.overlay.style.cssText += `
			display: grid;
			grid-template-columns: repeat(${count}, 1fr);
			gap: ${gutter}px;
			height: 100%;
			position: fixed;
			${positionStyles};
		`

		for (let i = 0; i < count; i++) {
			const column = document.createElement('div')
			column.style.cssText = `
				background-color: ${color};
				height: 100%;
				width: 100%;
			`
			this.overlay.appendChild(column)
		}
	}

	createRowGrid(count, color, type, size, margin, offset, gutter) {
		const positionStyles = this.getPositionStyles(type, size, margin, offset, true)

		this.overlay.style.cssText += `
			display: grid;
			grid-template-rows: repeat(${count}, 1fr);
			gap: ${gutter}px;
			width: 100%;
			position: fixed;
			${positionStyles};
		`

		for (let i = 0; i < count; i++) {
			const row = document.createElement('div')
			row.style.cssText = `
				background-color: ${color};
				width: 100%;
				height: 100%;
			`
			this.overlay.appendChild(row)
		}
	}

	createFullGrid(count, color, type, size, margin, offset, gutter) {
		const positionStyles = this.getPositionStyles(type, size, margin, offset)

		this.overlay.style.cssText += `
			display: grid;
			grid-template-columns: repeat(${count}, 1fr);
			grid-template-rows: repeat(${count}, 1fr);
			gap: ${gutter}px;
			aspect-ratio: 1;
			position: fixed;
			${positionStyles};
		`

		for (let i = 0; i < count * count; i++) {
			const cell = document.createElement('div')
			cell.style.cssText = `
				background-color: ${color};
				width: 100%;
				height: 100%;
			`
			this.overlay.appendChild(cell)
		}
	}
}

new GridOverlay() 