# Social Media Preview Image Guide

Per migliorare ulteriormente la visualizzazione su Google e social media, crea un'immagine ottimizzata:

## Specifiche Tecniche:
- **Dimensioni**: 1200x630px (formato Open Graph ottimale)
- **Formato**: PNG o JPG
- **Peso**: < 300KB per caricamento veloce
- **Nome file**: `og-image.png` o `social-preview.png`

## Contenuto dell'immagine:
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [LOGO/FOTO]          GIACOMO REGGIANINI               │
│   a sinistra          AI Engineer                       │
│                                                         │
│                       Specializzato in:                 │
│                       🤖 RAG Systems                    │
│                       👁️ Computer Vision                │
│                       🧠 Enterprise AI                  │
│                                                         │
│                       📍 Modena, Italy                  │
│                       🎓 Master AI @ UNIMORE            │
│                       💼 E38                            │
│                                                         │
│                       reggianini.giacomo01@gmail.com    │
│                                                         │
│                       Background gradienti moderni      │
│                       Colori: nero/blu/verde tech       │
└─────────────────────────────────────────────────────────┘
```

## Tools consigliati per crearla:
1. **Canva**: Template "Open Graph" predefiniti
2. **Figma**: Design professionale
3. **Adobe Express**: Veloce e semplice
4. **Photopea**: Gratis come Photoshop

## Dopo aver creato l'immagine:
1. Salva come `og-image.png` nella cartella `/public`
2. Aggiorna i meta tag in `index.html`:

```html
<meta property="og:image" content="https://giacomoreggianini.it/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:image" content="https://giacomoreggianini.it/og-image.png" />
```

## Colori Brand consigliati:
- Primario: #0066FF (blu tech)
- Secondario: #00FF88 (verde neon)
- Sfondo: #0A0A0A (nero profondo)
- Testo: #FFFFFF (bianco)
- Accent: #FF0066 (rosa neon per highlights)

## Testa la preview:
- **Google**: Cerca "giacomoreggianini.it"
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: Condividi URL in anteprima
