function timeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  }
  const diffHrs = Math.floor(diffMins / 60);
  return `${diffHrs} hours ago`;
}

module.exports = timeAgo;