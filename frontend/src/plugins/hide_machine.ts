export function isHidden(id: string): boolean {
  const hidden = localStorage.getItem('hidden');
  const hiddenArray = hidden ? hidden.split(',') : [];
  return hiddenArray.includes(id);
}

export function hide(id: string): void {
  const hidden = localStorage.getItem('hidden');
  const hiddenArray = hidden ? hidden.split(',') : [];
  if (!hiddenArray.includes(id)) {
    hiddenArray.push(id);
    localStorage.setItem('hidden', hiddenArray.join(','));
  }
}

export function unHide(id: string): void {
  const hidden = localStorage.getItem('hidden');
  const hiddenArray = hidden ? hidden.split(',') : [];
  if (hiddenArray.includes(id)) {
    const index = hiddenArray.indexOf(id);
    hiddenArray.splice(index, 1);
    localStorage.setItem('hidden', hiddenArray.join(','));
  }
}

export function unHideAll(): void {
  localStorage.removeItem('hidden');
}
