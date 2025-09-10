// Chakra custom theme using provided color palette
import { extendTheme } from '@chakra-ui/react';

const colors = {
  primary: {
    500: 'rgb(237, 102, 49)', // Orange (Primary Accent)
  },
  orange: {
    500: 'rgb(237, 102, 49)',
  },
  lightGrey: {
    500: 'rgb(226, 221, 219)',
  },
  midGrey: {
    500: 'rgb(201, 196, 189)',
  },
  paleGrey: {
    500: 'rgb(242, 239, 236)',
  },
  yellow: {
    500: 'rgb(243, 190, 10)',
  },
  blue: {
    500: 'rgb(42, 115, 217)',
  },
  green: {
    500: 'rgb(26, 132, 92)',
  },
  softRed: {
    500: 'rgb(244, 181, 181)',
  },
  black: {
    500: 'rgb(0, 0, 0)',
  },
  white: {
    500: 'rgb(255, 255, 255)',
  },
  trafficGreen: {
    500: 'rgb(26, 132, 92)', // #1A845C
  },
  trafficRed: {
    500: 'rgb(231, 25, 57)', // #E71939
  },
  trafficYellow: {
    500: 'rgb(243, 190, 10)', // #F3BE0A
  },

};

const theme = extendTheme({
  colors,
  styles: {
    global: {
      body: {
        bg: colors.paleGrey[500],
        color: colors.black[500],
      },
    },
  },
});

export default theme;
