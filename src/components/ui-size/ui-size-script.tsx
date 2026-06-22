const UI_SIZE_SCRIPT = `
(function() {
  try {
    var allowed = ['original', 'subtle', 'large'];
    var query = new URLSearchParams(window.location.search).get('size');
    var stored = sessionStorage.getItem('ui-size');
    var size = allowed.indexOf(query) >= 0
      ? query
      : allowed.indexOf(stored) >= 0 ? stored : 'original';
    document.documentElement.dataset.uiSize = size;
    sessionStorage.setItem('ui-size', size);
  } catch (e) {
    document.documentElement.dataset.uiSize = 'original';
  }
})();
`;

export function UiSizeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: UI_SIZE_SCRIPT }} />;
}
