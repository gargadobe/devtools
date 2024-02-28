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
    editor.setValue(JSON.stringify(jsonObject, null, 2));
}

function showTree() {
    const formatView = document.getElementById('formatView');
    const treeView = document.getElementById('treeView');
    formatView.style.display = 'none';
    treeView.style.display = 'block';
    try {
        jsonObject = JSON.parse(editor.getValue());
        treeView.innerHTML = createTree(jsonObject);
        addEditableEventListeners();
    } catch (error) {
        alert('Invalid JSON input');
    }
}

function createTree(obj, path = '') {
    let html = '';
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            html += `<details open><summary>${key}</summary><ul>${createTree(obj[key], path + key + '.')}</ul></details>`;
        } else {
            html += `<li><span class="key">${key}:</span> <span class="value" contenteditable="true" data-path="${path + key}">${obj[key]}</span></li>`;
        }
    }
    return html;
}

function addEditableEventListeners() {
    const values = document.querySelectorAll('.value');
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