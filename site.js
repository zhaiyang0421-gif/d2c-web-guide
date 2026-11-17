const copy = document.querySelector('#copy-prompt');
const promptText = document.querySelector('#prompt-text');
const status = document.querySelector('#copy-status');

copy.hidden = false;
copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(promptText.textContent.trim());
    status.textContent = '已复制提示词。可以粘贴到你的 AI 编程工具。';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(promptText);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    promptText.focus();
    status.textContent = '已选中提示词，请使用系统复制快捷键。';
  }
});
