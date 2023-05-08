import tailwindPlugin from 'tailwindcss/plugin';
import type { PluginAPI } from 'tailwindcss/types/config';
import base from './base';
import colors from './colors';
import injectThemes from './colors/injectThemes';

const mainFunction = ({ addBase, config }: PluginAPI) => {
  addBase(base);

  injectThemes(addBase, config);
};

export default tailwindPlugin(mainFunction, {
  theme: {
    extend: {
      colors,
    },
  },
});