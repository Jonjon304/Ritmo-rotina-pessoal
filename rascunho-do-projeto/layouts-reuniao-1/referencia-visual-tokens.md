# Referência Visual — MyFinance Hub

> Design tokens e direção visual para o projeto. Dark elegante com acentos coloridos por módulo.

## Paleta de Cores

### Base (Fundos)

| Token            | Hex       | Uso                                  |
|------------------|-----------|--------------------------------------|
| `bg-deepest`     | `#0a0a0a` | Fundo do body/html                   |
| `bg-deep`        | `#0f0f0f` | Fundo principal do Hub               |
| `bg-base`        | `#1a1a1a` | Fundo dos cards                      |
| `bg-raised`      | `#222222` | Fundo de elementos dentro do card    |
| `bg-hover`       | `#2a2a2a` | Hover em cards e elementos           |
| `border-subtle`  | `#1e1e1e` | Borda entre seções (quase invisível) |
| `border-default` | `#2a2a2a` | Borda padrão de cards                |

### Texto

| Token          | Hex       | Uso                          |
|----------------|-----------|------------------------------|
| `text-primary` | `#f5f5f5` | Títulos e texto principal    |
| `text-secondary`| `#a3a3a3`| Subtítulos e descrições      |
| `text-muted`   | `#525252` | Placeholders e hints         |

### Acentos por Módulo

| Módulo     | Cor       | Hex       | Hover/Bright |
|------------|-----------|-----------|--------------|
| 💰 Finanças| Roxo      | `#8b5cf6` | `#a78bfa`    |
| 📋 Tarefas | Azul      | `#3b82f6` | `#60a5fa`    |
| 🎯 Metas   | Âmbar     | `#f59e0b` | `#fbbf24`    |
| 📅 Cronograma| Verde   | `#10b981` | `#34d399`    |
| 📝 Notas   | Rosa      | `#ec4899` | `#f472b6`    |
| 🔄 Hábitos | Ciano     | `#06b6d4` | `#22d3ee`    |

### Semânticos (Finanças)

| Token         | Hex       | Uso                |
|---------------|-----------|--------------------|
| `success`     | `#22c55e` | Receita / Positivo |
| `danger`      | `#ef4444` | Despesa / Negativo |
| `warning`     | `#f59e0b` | Alerta / Atenção   |

## Tipografia

| Elemento      | Fonte       | Peso  | Tamanho  |
|---------------|-------------|-------|----------|
| Display       | Geist Sans  | 700   | 32px     |
| Heading 1     | Geist Sans  | 600   | 24px     |
| Heading 2     | Geist Sans  | 600   | 20px     |
| Body          | Inter       | 400   | 14px     |
| Body small    | Inter       | 400   | 12px     |
| Caption       | Inter       | 500   | 11px     |
| Mono (valores)| JetBrains Mono | 500 | 14px     |

> **Fallback:** Se Geist Sans não estiver disponível, usar `Inter` para tudo.
> **Mono:** JetBrains Mono para valores financeiros (R$ 4.230,00) — dá alinhamento visual.

## Espaçamento

| Token    | Valor | Uso                        |
|----------|-------|----------------------------|
| `xs`     | 4px   | Ícones ao lado de texto    |
| `sm`     | 8px   | Padding interno de badges  |
| `md`     | 16px  | Gap entre elementos        |
| `lg`     | 24px  | Gap entre cards            |
| `xl`     | 32px  | Seção padding              |
| `2xl`    | 48px  | Container padding          |

## Bordas e Raius

| Elemento      | Border Radius | Borda                 |
|---------------|---------------|-----------------------|
| Card Hub      | 16px          | 1px solid #2a2a2a     |
| Card interno  | 12px          | 1px solid #1e1e1e     |
| Botão         | 8px           | 1px solid #2a2a2a     |
| Input         | 8px           | 1px solid #2a2a2a     |
| Badge         | 6px           | none                  |
| Avatar        | 50%           | none                  |

## Sombras (sutil em dark)

```css
shadow-sm:  0 1px 2px rgba(0,0,0,0.3)
shadow-md:  0 4px 12px rgba(0,0,0,0.4)
shadow-lg:  0 8px 24px rgba(0,0,0,0.5)
shadow-glow: 0 0 20px rgba(accent, 0.15)  /* usada no hover de cards */
```

## Animações

| Elemento    | Propriedade          | Duração | Easing          |
|-------------|----------------------|---------|-----------------|
| Card hover  | translateY + shadow  | 200ms   | ease-out        |
| Card hover  | border-color (accent)| 300ms   | ease-in-out     |
| Page enter  | opacity + translateY | 250ms   | ease-out        |
| Modal open  | scale + opacity      | 200ms   | ease-out        |

## Ícones

- **Lib:** Lucide Icons (open source, leve, combina com dark theme)
- **Estilo:** Outline (1.5px stroke), não filled
- **Tamanho:** 20px padrão, 24px em cards do Hub
- **Cor:** Herda `text-secondary` por padrão, `accent` no hover/ativo

## Comparação de Estilo

```
LINEAR ───────────────────── MYFINANCE ───────────────────── SPOTIFY
                                                             
Fundo #0a0a0a                Fundo #0f0f0f                   Fundo #121212
Muito minimalista            Cards com acentos sutis         Cards com cores vibrantes
Sem cores, só cinza          Cada módulo = 1 cor             Cada playlist = 1 cor
Bordas quase invisíveis      Bordas discretas #2a2a2a        Sem bordas, sombras
Tipografia forte             Tipografia clara                Tipografia maior
Profissional / Frio          Pessoal / Elegante              Divertido / Quente
```
