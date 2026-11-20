export const CONTACT_PATH = '/#cotizar';

export function whatsappChatUrl(number: string | undefined): string | null {
	const digits = number?.trim().replace(/^\+/, '');
	if (!digits || digits === '573000000000' || !/^[1-9]\d{10,14}$/.test(digits)) return null;
	return 'https://wa.me/' + digits;
}

export function buildContactMessage(data: FormData): string | null {
	const fields = [
		['name', 'Nombre'],
		['phone', 'Teléfono'],
		['city', 'Ciudad o proyecto'],
		['service', 'Servicio'],
		['details', 'Detalles'],
	];
	const lines = ['Hola, quisiera solicitar una consulta de ingeniería estructural.'];
	for (const [key, label] of fields) {
		const value = data.get(key);
		if (typeof value !== 'string' || !value.trim()) return null;
		lines.push(label + ': ' + value.trim());
	}
	return lines.join('\n');
}
