const marked = require('marked');

const renderer = new marked.Renderer();

renderer.paragraph = (text) => {
    return `<p class="mb-4">${text}</p>`;
};

renderer.heading = (text, level) => {
    const sizes = ['text-xl', 'text-lg', 'text-md', 'text-sm', 'text-xs'];
    let size = sizes[level - 1] || 'text-base';
    return `<h${level} class="${size} font-bold my-4">${text}</h${level}>`;
};

renderer.code = (code) => {
    return `<code class="bg-gray-100 rounded p-1">${code}</code>`;
};

renderer.em = (text) => {
    return `<em class="italic">${text}</em>`;
};

module.exports = renderer
