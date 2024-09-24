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
					autogenerate: { directory: "obsidian/Articles" },
					collapsed: true,
				},
				{
					label: "Books",
					autogenerate: { directory: "obsidian/Books" },
					collapsed: true,
				},
				{
					label: "CSS",
					autogenerate: { directory: "css" },
					collapsed: true,
				},
				{
					label: "Go",
					autogenerate: { directory: "go" },
					collapsed: true,
				},
				{
					label: "HTML",
					autogenerate: { directory: "html" },
					collapsed: true,
				},
				{
					label: "Javascript",
					autogenerate: { directory: "javascript" },
					collapsed: true,
				},
				{
					label: "Leetcode",
					autogenerate: { directory: "obsidian/Leetcode" },
					collapsed: true,
				},
				{
					label: "Python",
					autogenerate: { directory: "python" },
					collapsed: true,
				},
				{
					label: "Rails",
					autogenerate: { directory: "rails" },
					collapsed: true,
				},
				{
					label: "Rust",
					autogenerate: { directory: "rust" },
					collapsed: true,
				},
				{
					label: "Tools",
					autogenerate: { directory: "obsidian/Tools" },
					collapsed: true,
				},
			],
			customCss: ["./src/tailwind.css"],
		}),
		tailwind({ applyBaseStyles: false }),
	],
});
