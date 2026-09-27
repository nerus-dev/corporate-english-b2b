const DeckNavigation = {
  /** @param {number} index @param {number} count */
  clamp(index, count) { return Math.max(0, Math.min(Math.max(0, count - 1), index)); },
  /** @param {number} index @param {number} count @param {string} direction */
  target(index, count, direction) {
    if (direction === 'first') return 0;
    if (direction === 'last') return Math.max(0, count - 1);
    return this.clamp(index + (direction === 'next' ? 1 : direction === 'previous' ? -1 : 0), count);
  },
  /** @param {number} index */
  hash(index) { return `#scene-${String(index + 1).padStart(2, '0')}`; },
  /** @param {string} hash @param {number} count */
  fromHash(hash, count) {
    const match = /^#scene-(\d{2})$/.exec(hash);
    return match ? this.clamp(Number(match[1]) - 1, count) : 0;
  }
};
