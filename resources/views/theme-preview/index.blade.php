<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Xem thử giao diện</title>
    <style>
        * { box-sizing: border-box; }
        html, body { width: 100%; height: 100%; margin: 0; font-family: Arial, sans-serif; }
        body { overflow: hidden; background: #eef1f5; }
        #theme-preview-frame { display: block; width: 100%; height: 100%; border: 0; background: white; }
        .preview-toggle {
            position: fixed; z-index: 10001; top: 16px; left: 16px; border: 0; border-radius: 9px;
            padding: 11px 15px; color: white; background: #172033; box-shadow: 0 5px 18px #0003;
            font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .preview-panel {
            position: fixed; z-index: 10000; top: 66px; left: 16px; width: 250px; padding: 16px;
            border: 1px solid #e3e7ee; border-radius: 12px; background: white;
            box-shadow: 0 12px 36px #0003;
        }
        .preview-panel[hidden] { display: none; }
        .preview-panel h1 { margin: 0 0 12px; font-size: 16px; }
        .preview-choice {
            display: block; width: 100%; margin-top: 8px; padding: 10px 12px; border: 1px solid #e3e7ee;
            border-radius: 8px; color: #172033; background: white; text-align: left; cursor: pointer;
        }
        .preview-choice:hover, .preview-choice[aria-current="true"] { border-color: #536dfe; background: #f3f5ff; }
        .preview-note { margin: 10px 1px 0; color: #657086; font-size: 12px; line-height: 1.45; }
    </style>
</head>
<body>
    <iframe id="theme-preview-frame" title="Bản xem thử theme"></iframe>

    <button class="preview-toggle" id="preview-toggle" type="button" aria-expanded="true" aria-controls="preview-panel">
        Chọn giao diện
    </button>
    <aside class="preview-panel" id="preview-panel" aria-label="Chọn theme demo">
        <h1>Chọn theme để xem</h1>
        <div id="preview-theme-list"></div>
    </aside>

    <script>
        (() => {
            const themes = @json($themes);
            const frame = document.getElementById('theme-preview-frame');
            const list = document.getElementById('preview-theme-list');
            const panel = document.getElementById('preview-panel');
            const toggle = document.getElementById('preview-toggle');
            const note = document.createElement('p');
            note.className = 'preview-note';
            list.after(note);
            const params = new URLSearchParams(window.location.search);
            const requestedTheme = params.get('theme');
            let currentTheme = themes.find((theme) => theme.id === requestedTheme) || themes[0];

            function chooseTheme(theme) {
                currentTheme = theme;
                frame.src = theme.url;
                note.textContent = theme.note || '';
                list.querySelectorAll('button').forEach((button) => {
                    button.setAttribute('aria-current', button.dataset.theme === theme.id ? 'true' : 'false');
                });
                const nextUrl = new URL(window.location.href);
                nextUrl.searchParams.set('theme', theme.id);
                window.history.replaceState({}, '', nextUrl);
            }

            themes.forEach((theme) => {
                const button = document.createElement('button');
                button.className = 'preview-choice';
                button.type = 'button';
                button.textContent = theme.name;
                button.dataset.theme = theme.id;
                button.setAttribute('aria-current', theme.id === currentTheme.id ? 'true' : 'false');
                button.addEventListener('click', () => chooseTheme(theme));
                list.appendChild(button);
            });

            toggle.addEventListener('click', () => {
                panel.hidden = !panel.hidden;
                toggle.setAttribute('aria-expanded', String(!panel.hidden));
            });

            chooseTheme(currentTheme);
        })();
    </script>
</body>
</html>
