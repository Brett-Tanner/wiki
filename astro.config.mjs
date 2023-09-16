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
          label: "HTML",
          autogenerate: { directory: "html" },
        },
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
