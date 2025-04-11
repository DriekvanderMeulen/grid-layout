document.addEventListener('DOMContentLoaded', () => {
	const gridToggle = document.getElementById('gridToggle')
	const gridSettings = document.getElementById('gridSettings')
	const gridType = document.getElementById('gridType')
	const count = document.getElementById('count')
	const color = document.getElementById('color')
	const colorHex = document.getElementById('colorHex')
	const opacity = document.getElementById('opacity')
	const type = document.getElementById('type')
	const size = document.getElementById('size')
	const sizeLabel = document.getElementById('sizeLabel')
	const sizeGroup = document.getElementById('sizeGroup')
	const margin = document.getElementById('margin')
	const marginGroup = document.getElementById('marginGroup')
	const offset = document.getElementById('offset')
	const offsetGroup = document.getElementById('offsetGroup')
	const gutter = document.getElementById('gutter')

	function updateTypeSpecificUI() {
		const isStretch = type.value === 'stretch'
		const currentGridType = gridType.value

		if (isStretch) {
			sizeGroup.style.display = 'none'
			size.value = 'auto'
		} else {
			sizeGroup.style.display = 'grid'
			if (currentGridType === 'rows') {
				sizeLabel.textContent = 'Height'
			} else {
				sizeLabel.textContent = 'Width'
			}
		}

		if (isStretch) {
			marginGroup.style.display = 'grid'
			offsetGroup.style.display = 'none'
			offset.value = '0'
		} else {
			marginGroup.style.display = 'none'
			offsetGroup.style.display = 'grid'
			margin.value = '0'
		}
	}

	chrome.storage.local.get(['gridSettings', 'isGridVisible'], (data) => {
		if (data.gridSettings) {
			const settings = data.gridSettings
			gridType.value = settings.gridType
			count.value = settings.count
			color.value = settings.color
			colorHex.value = settings.color.replace('#', '')
			opacity.value = settings.opacity
			type.value = settings.type
			size.value = settings.size
			margin.value = settings.margin
			offset.value = settings.offset
			gutter.value = settings.gutter

			updateTypeSpecificUI()
		}

		gridToggle.checked = data.isGridVisible || false
		gridSettings.style.display = gridToggle.checked ? 'block' : 'none'

		if (gridToggle.checked) {
			updateGrid()
		}
	})

	gridToggle.addEventListener('change', () => {
		const isVisible = gridToggle.checked
		gridSettings.style.display = isVisible ? 'block' : 'none'
		chrome.storage.local.set({ isGridVisible: isVisible })

		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {
				type: isVisible ? 'UPDATE_GRID' : 'HIDE_GRID',
				settings: getSettings()
			}).catch(() => {
				chrome.tabs.reload(tabs[0].id)
			})
		})
	})

	type.addEventListener('change', updateTypeSpecificUI)
	gridType.addEventListener('change', updateTypeSpecificUI)

	color.addEventListener('input', (e) => {
		colorHex.value = e.target.value.replace('#', '')
	})

	colorHex.addEventListener('input', (e) => {
		if (/^[0-9A-F]{6}$/i.test(e.target.value)) {
			color.value = '#' + e.target.value
		}
	})

	function getSettings() {
		const isStretch = type.value === 'stretch'
		return {
			gridType: gridType.value,
			count: parseInt(count.value),
			color: color.value,
			opacity: parseInt(opacity.value),
			type: type.value,
			size: isStretch ? 'auto' : parseInt(size.value),
			margin: isStretch ? parseInt(margin.value) : 0,
			offset: !isStretch ? parseInt(offset.value) : 0,
			gutter: parseInt(gutter.value)
		}
	}

	function updateGrid() {
		const settings = getSettings()
		chrome.storage.local.set({ gridSettings: settings })

		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {
				type: 'UPDATE_GRID',
				settings
			}).catch(() => {
				chrome.tabs.reload(tabs[0].id)
			})
		})
	}

	const inputs = [gridType, count, color, colorHex, opacity, type, size, margin, offset, gutter]
	inputs.forEach(input => {
		input.addEventListener('change', updateGrid)
		input.addEventListener('input', updateGrid)
	})
}) 