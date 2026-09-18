/**
 * Fuzzy Matcher
 * Computes token similarity and Levenshtein similarity between normalized strings
 */

function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function stringSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;

  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Jaccard token overlap ratio
 */
function tokenSimilarity(str1, str2) {
  const set1 = new Set(str1.toLowerCase().split(/\s+/).filter(Boolean));
  const set2 = new Set(str2.toLowerCase().split(/\s+/).filter(Boolean));

  if (set1.size === 0 || set2.size === 0) return 0;

  let intersection = 0;
  for (const token of set1) {
    if (set2.has(token)) intersection++;
  }

  const union = new Set([...set1, ...set2]).size;
  return intersection / union;
}

/**
 * Combined hybrid similarity score (0.0 to 1.0)
 */
function computeSimilarityScore(str1, str2) {
  const charScore = stringSimilarity(str1, str2);
  const tokenScore = tokenSimilarity(str1, str2);

  // 60% weight on token overlap + 40% weight on character distance
  return Number((tokenScore * 0.6 + charScore * 0.4).toFixed(3));
}

module.exports = {
  stringSimilarity,
  tokenSimilarity,
  computeSimilarityScore,
};
