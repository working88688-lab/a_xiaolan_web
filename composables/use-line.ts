const GITHUB_URL = '_github_url_'
export function useLine() {
  function checkLine() {
    const _github_url_ = localStorage.getItem(GITHUB_URL)
    return new Promise((resolve, reject) => {
      const app = useAppConfig()
      const lines = app.lines
      const trackers: AbortController[] = []
      let count = 0
      let hasLineAvailable = false
      for (let i = 0; i < lines.length; i++) {
        const base_url = lines[i]
        const abortController = new AbortController()

        trackers.push(abortController)
        setTimeout(() => {
          abortController.abort()
        }, 3000)
        fetch(base_url, {
          method: 'head',
          signal: abortController.signal
        })
          .then(() => {
            hasLineAvailable = true
            resolve(base_url)
            trackers.forEach(_tracker => {
              _tracker.abort()
            })
          })
          .catch(e => {
            if (!_github_url_) {
              reject(e)
            }
          })
          .finally(() => {
            count++
            if (count === lines.length && !hasLineAvailable) {
              if (_github_url_) {
                fetch(_github_url_)
                  .then(response => response.text())
                  .then(apiUrl => {
                    const realApiUrl = apiUrl.trim()
                    resolve(`${new URL(realApiUrl).origin}/pwa.php`)
                  })
                  .catch(reject)
              } else {
                resolve(lines[0])
              }
            } else {
              resolve(lines[0])
            }
          })
      }
    })
  }

  return {
    checkLine
  }
}
