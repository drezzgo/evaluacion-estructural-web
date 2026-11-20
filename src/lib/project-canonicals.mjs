// These project entries are verified copies of guides in the blog collection.
export const duplicatedProjectSlugs = [
	'cuando-se-hace-un-estudio-estructural',
	'peligro-en-grietas-en-muros',
	'que-es-evaluacion-estructural',
];

/** @param {string} slug */
export function projectCanonical(slug) {
	return duplicatedProjectSlugs.includes(slug) ? '/blog/' + slug + '/' : undefined;
}
