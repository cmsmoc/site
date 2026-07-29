import csv
import os

input_file = r"C:\Users\55389\Documents\CMS 2026\_NovoCMS2026\00_SECRETARIAEXEC\Incentivo CLS\Atualizar\Edital11\Catalogo-de-metas1.txt"
output_file = r"C:\Users\55389\Documents\CMS 2026\_NovoCMS2026\00_SECRETARIAEXEC\Incentivo CLS\Atualizar\Edital11\catalogo-de-metas.html"

# CMSMOC Design System v5.0 styling
html_template = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo de Metas - Edital 11/2026</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&family=Open+Sans:wght@400;600&display=swap');

        :root {{
            --navy: #0D2E5A;
            --blue: #1B6CB5;
            --off-white: #F7F8FA;
            --ink: #111827;
            --yellow: #F5C400;
            --font-d: 'Montserrat', sans-serif;
            --font-b: 'Open Sans', sans-serif;
        }}

        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }}

        body {{
            font-family: var(--font-b);
            color: var(--ink);
            background-color: var(--off-white);
            line-height: 1.6;
        }}

        .cms-stripe {{
            height: 6px;
            background: linear-gradient(90deg, var(--navy) 33.3%, var(--yellow) 33.3% 66.6%, var(--blue) 66.6%);
            width: 100%;
            position: fixed;
            top: 0;
            z-index: 1000;
        }}

        header {{
            background-color: var(--navy);
            color: white;
            padding: 4rem 2rem 2rem 2rem;
            text-align: center;
        }}

        header h1 {{
            font-family: var(--font-d);
            font-size: 2.5rem;
            font-weight: 900;
            margin-bottom: 0.5rem;
            color: var(--yellow);
        }}

        header p {{
            font-size: 1.1rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
        }}

        .container {{
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 2rem;
        }}

        .filters {{
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            justify-content: center;
            flex-wrap: wrap;
        }}

        .filter-btn {{
            background-color: white;
            border: 2px solid var(--border-color, #E5E7EB);
            color: var(--navy);
            padding: 0.5rem 1.5rem;
            border-radius: 99px;
            font-family: var(--font-d);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }}

        .filter-btn.active {{
            background-color: var(--navy);
            color: white;
            border-color: var(--navy);
        }}

        .filter-btn:hover:not(.active) {{
            border-color: var(--blue);
            color: var(--blue);
        }}

        .gallery {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
            margin-bottom: 4rem;
        }}

        .card {{
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border: 1px solid #E5E7EB;
            border-top: 4px solid var(--blue);
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            transition: transform 0.2s, box-shadow 0.2s;
        }}

        .card:hover {{
            transform: translateY(-4px);
            box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }}

        /* Cores de borda por eixo */
        .card[data-eixo="Articulação"] {{ border-top-color: var(--blue); }}
        .card[data-eixo="Comunicação"] {{ border-top-color: var(--yellow); }}
        .card[data-eixo="Eleição"] {{ border-top-color: var(--navy); }}
        .card[data-eixo="Formação"] {{ border-top-color: #10B981; }} /* Verde para formação */

        .meta-id {{
            font-family: var(--font-d);
            font-weight: 900;
            color: var(--navy);
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
        }}

        .meta-title {{
            font-family: var(--font-d);
            font-weight: 700;
            font-size: 1.1rem;
            color: var(--ink);
            margin-bottom: 1rem;
            line-height: 1.4;
        }}

        .meta-details {{
            flex-grow: 1;
        }}

        .detail-group {{
            margin-bottom: 0.75rem;
        }}

        .detail-label {{
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6B7280;
            font-weight: 700;
            display: block;
            margin-bottom: 0.25rem;
        }}

        .detail-value {{
            font-size: 0.95rem;
            color: #374151;
        }}

        .meta-price {{
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px dashed #E5E7EB;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .price-value {{
            font-family: var(--font-d);
            font-weight: 900;
            color: var(--navy);
            font-size: 1.25rem;
            background-color: var(--off-white);
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
        }}

    </style>
</head>
<body>
    <div class="cms-stripe"></div>
    
    <header>
        <h1>CATÁLOGO DE METAS</h1>
        <p>Projetos de Fortalecimento dos Conselhos Locais de Saúde (Edital 11/2026)</p>
    </header>

    <div class="container">
        <div class="filters">
            <button class="filter-btn active" data-filter="all">Todos os Eixos</button>
            <button class="filter-btn" data-filter="Articulação">Articulação</button>
            <button class="filter-btn" data-filter="Comunicação">Comunicação</button>
            <button class="filter-btn" data-filter="Eleição">Eleição</button>
            <button class="filter-btn" data-filter="Formação">Formação</button>
        </div>

        <div class="gallery" id="gallery">
            {cards}
        </div>
    </div>

    <script>
        document.querySelectorAll('.filter-btn').forEach(btn => {{
            btn.addEventListener('click', () => {{
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter cards
                const filter = btn.getAttribute('data-filter');
                const cards = document.querySelectorAll('.card');

                cards.forEach(card => {{
                    if (filter === 'all' || card.getAttribute('data-eixo') === filter) {{
                        card.style.display = 'flex';
                    }} else {{
                        card.style.display = 'none';
                    }}
                }});
            }});
        }});
    </script>
</body>
</html>
"""

cards_html = ""

with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f, delimiter=';')
    header = next(reader)
    
    for row in reader:
        if len(row) < 5 or not row[0].strip():
            continue
            
        eixo = row[0].strip()
        # Meta contains ID and Title (e.g. "A.01 Instituir o Programa...")
        meta_full = row[1].strip()
        
        # Split ID and Title
        parts = meta_full.split(' ', 1)
        if len(parts) == 2:
            meta_id = parts[0]
            meta_title = parts[1]
        else:
            meta_id = ""
            meta_title = meta_full
            
        acao = row[2].strip()
        objeto = row[3].strip()
        recurso = row[4].strip()
        
        card = f"""
            <div class="card" data-eixo="{eixo}">
                <div class="meta-id">{meta_id}</div>
                <div class="meta-title">{meta_title}</div>
                
                <div class="meta-details">
                    <div class="detail-group">
                        <span class="detail-label">Eixo Estratégico</span>
                        <span class="detail-value">{eixo}</span>
                    </div>
                    <div class="detail-group">
                        <span class="detail-label">Ação / Atividade</span>
                        <span class="detail-value">{acao}</span>
                    </div>
                    <div class="detail-group">
                        <span class="detail-label">Objeto de Gasto</span>
                        <span class="detail-value">{objeto}</span>
                    </div>
                </div>

                <div class="meta-price">
                    <span class="detail-label">Custo Estimado</span>
                    <span class="price-value">{recurso}</span>
                </div>
            </div>
        """
        cards_html += card

final_html = html_template.format(cards=cards_html)

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(final_html)

print(f"Catálogo HTML gerado com sucesso em: {output_file}")
