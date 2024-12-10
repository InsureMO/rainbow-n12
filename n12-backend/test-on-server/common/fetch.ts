export const postNoHeader = async <D extends any = any>(url: string, body: D) => {
	return await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
};
