let jsonObject = null;


CodeMirror.defineMode("json", function(config) {
    return CodeMirror.getMode(config, {name: "javascript", json: true});
});

CodeMirror.defineMIME("json", "json");

let editor = CodeMirror(document.getElementById('editor'), {
    lineNumbers: true,
    mode: "json",
    theme: "default",
    value: "{}",
    viewportMargin: Infinity,
    lineWrapping: true
});

function showFormat() {
    const formatView = document.getElementById('formatView');
    const treeView = document.getElementById('treeView');
    formatView.style.display = 'block';
    treeView.style.display = 'none';
    try {
        jsonObject = jsonObject === null ? JSON.parse(editor.getValue()) : jsonObject;
        editor.setValue(JSON.stringify(jsonObject, null, 2));
    } catch (error) {
        alert('Invalid JSON input');
    }
}

function showTree() {
    const formatView = document.getElementById('formatView');
    const treeView = document.getElementById('treeView');
    formatView.style.display = 'none';
    treeView.style.display = 'block';
    try {
        jsonObject = jsonObject === null ? JSON.parse(editor.getValue()) : jsonObject;
        treeView.innerHTML = createTree(jsonObject);
        addEditableEventListeners();
    } catch (error) {
        alert('Invalid JSON input');
    }
}

function createTree(obj, path = '') {
    let html = '<div class="json-brackets">{</div>';
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            html += `<details open class="json-object"><summary class="json-key">${key}</summary><div class="json-brackets"></div><ul class="json-object-content">${createTree(obj[key], path + key + '.')}</ul><div class="json-brackets"></div></details>`;
        } else {
            html += `<li class="json-item"><div class="json-key-value"><span class="json-key">${key}:</span> <span class="json-value" contenteditable="true" data-path="${path + key}">${obj[key]}</span></div></li>`;
        }
    }
    html += '<div class="json-brackets">}</div>';
    return html;
}

function addEditableEventListeners() {
    const values = document.querySelectorAll('.json-value');
    values.forEach(value => {
        value.addEventListener('blur', function() {
            const path = this.dataset.path.split('.');
            setValue(jsonObject, path, this.textContent);
        });
    });
}

function setValue(obj, path, value) {
    if (path.length > 1) {
        const key = path.shift();
        if (!(key in obj)) {
            obj[key] = {};
        }
        setValue(obj[key], path, value);
    } else {
        obj[path[0]] = value;
    }
}