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
      title: "Docs with Tailwind",
      social: {
        github: "https://github.com/withastro/starlight",
      },
      sidebar: [
        {
          label: "Javascript",
          autogenerate: { directory: "javascript" },
        },
        {
          label: "Rails",
          autogenerate: { directory: "rails" },
        },
      ],
      customCss: ["./src/tailwind.css"],
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
