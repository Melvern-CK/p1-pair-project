const Sentiment = require('sentiment');
const sentiment = new Sentiment();

function analyze(text) {
  const { score } = sentiment.analyze(text || '');
  let label = 'Neutral';
  if (score >  0) label = 'Positive';
  if (score <  0) label = 'Negative';
  return { score, label };
}

module.exports = analyze;
