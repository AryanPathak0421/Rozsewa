import Vibrant from 'node-vibrant';
import fs from 'fs';

function toCSSHsl(hsl) {
    if (!hsl) return null;
    return `${Math.round(hsl[0] * 360)} ${Math.round(hsl[1] * 100)}% ${Math.round(hsl[2] * 100)}%`;
}

Vibrant.from('./public/RozSewa.png').getPalette()
  .then((palette) => {
    const data = {
        Vibrant: { hex: palette.Vibrant?.getHex(), hsl: toCSSHsl(palette.Vibrant?.getHsl()) },
        DarkVibrant: { hex: palette.DarkVibrant?.getHex(), hsl: toCSSHsl(palette.DarkVibrant?.getHsl()) },
        LightVibrant: { hex: palette.LightVibrant?.getHex(), hsl: toCSSHsl(palette.LightVibrant?.getHsl()) },
        Muted: { hex: palette.Muted?.getHex(), hsl: toCSSHsl(palette.Muted?.getHsl()) },
        DarkMuted: { hex: palette.DarkMuted?.getHex(), hsl: toCSSHsl(palette.DarkMuted?.getHsl()) },
        LightMuted: { hex: palette.LightMuted?.getHex(), hsl: toCSSHsl(palette.LightMuted?.getHsl()) }
    };
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => console.error(err));
