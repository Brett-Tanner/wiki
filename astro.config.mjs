import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	image: {
		service: {
			entrypoint: "astro/assets/services/noop",
		},
	},
	integrations: [
		starlight({
			title: "Brett's Notes",
			social: {
				github: "https://github.com/Brett-Tanner/wiki",
			},
			sidebar: [
				{
					label: "Articles",
					autogenerate: { directory: "articles" },
				},
				{
					label: "Books",
					autogenerate: { directory: "books" },
				},
				{
					label: "CSS",
					autogenerate: { directory: "css" },
				},
				{
					label: "Go",
					autogenerate: { directory: "go" },
				},
				{
					label: "HTML",
					autogenerate: { directory: "html" },
				},
				{
					label: "Javascript",
					autogenerate: { directory: "javascript" },
				},
				{
					label: "Python",
					autogenerate: { directory: "python" },
				},
				{
					label: "Rails",
					autogenerate: { directory: "rails" },
				},
				{
					label: "Rust",
					autogenerate: { directory: "rust" },
				},
			],
			customCss: ["./src/tailwind.css"],
		}),
		tailwind({ applyBaseStyles: false }),
	],
});
