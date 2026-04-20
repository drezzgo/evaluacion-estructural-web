import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const servicios = defineCollection({
	loader: glob({ base: './src/content/servicios', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			icon: z.string().optional(), // Para mostrar un icono en el listado
			order: z.number().default(0), // Para controlar el orden en el grid
			heroImage: z.optional(image()),
		}),
});

const proyectos = defineCollection({
	loader: glob({ base: './src/content/proyectos', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			icon: z.string().optional(), // Para mostrar un icono en el listado
			order: z.number().default(0), // Para controlar el orden en el grid
			heroImage: z.optional(image()),
		}),
});

export const collections = { blog, servicios, proyectos };
