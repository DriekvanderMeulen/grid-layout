document.addEventListener('DOMContentLoaded', () => {
	const fields = [
		'size',
		'columns',
		'columnType',
		'columnGutter',
		'rows',
		'rowType',
		'rowGutter',
		'color',
		'opacity'
	]

	// Load saved settings
	chrome.storage.sync.get(fields, (settings) => {
		fields.forEach(field => {
			const element = document.getElementById(field)
			if (settings[field] !== undefined) {
				if (element.type === 'number' || element.type === 'select-one') {
					element.value = settings[field]
				} else if (element.type === 'color') {
					element.value = settings[field]
				}
			}
		})
	})

	// Save settings on change
	fields.forEach(field => {
		document.getElementById(field).addEventListener('change', (e) => {
			const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
			chrome.storage.sync.set({ [field]: value })
			updateGrid()
		})
	})

	// Toggle grid
	document.getElementById('toggle').addEventListener('click', () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleGrid' })
		})
	})

	function updateGrid() {
		const config = {}
		fields.forEach(field => {
			const element = document.getElementById(field)
			config[field] = element.type === 'number' ? Number(element.value) : element.value
		})

		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {
				action: 'updateGrid',
				config
			})
		})
	}
}) 