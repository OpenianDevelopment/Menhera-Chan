export function shorten(text: string, len: number) {
	if (typeof text !== "string") return "";
	if (text.length <= len) return text;
	return text.substr(0, len).trim() + "...";
}

export function ssn(n: number) {
	if (n <= 1e4) {
		return n;
	}
	if (n <= 1e6) {
		return (n / 1e3).toFixed(1) + "k";
	}
	if (n <= 1e9) {
		return (n / 1e6).toFixed(2) + "m";
	}

	return n;
}
