/** Pure scene navigation, shared with regression tests. */
const StoryNavigation = {
  /** @param {number[]} anchors @param {number} position @param {string} key */
  target(anchors, position, key) {
    if (key === 'Home') return 0;
    if (key === 'End') return anchors.at(-1) ?? 0;
    if (key === 'ArrowDown' || key === 'PageDown') return anchors.find(value => value > position + 4) ?? anchors.at(-1) ?? 0;
    if (key === 'ArrowUp' || key === 'PageUp') return [...anchors].reverse().find(value => value < position - 4) ?? 0;
    return null;
  }
};
