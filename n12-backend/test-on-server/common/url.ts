export const toAbsUrl = (route: string) => {
	return `http://localhost:3100/n12/${route.startsWith('/') ? route.substring(1) : route}`;
};
