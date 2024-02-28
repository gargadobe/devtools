function formatJSON() {
    const input = document.getElementById('input').value;
    try {
        const formatted = JSON.stringify(JSON.parse(input), null, 4);
        document.getElementById('output').textContent = formatted;
    } catch (error) {
        document.getElementById('output').textContent = 'Invalid JSON input';
    }
}