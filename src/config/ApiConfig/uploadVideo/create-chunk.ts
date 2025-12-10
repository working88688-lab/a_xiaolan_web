export function createChunk(
  file: File,
  chunkSize = 1024 * 1024 * 5
): Promise<{
  chunks: Array<Uint8Array>
  total: number
}> {
  return new Promise(resolve => {
    const chunks: any[] = []
    const chunkCount = Math.ceil(file.size / chunkSize)

    let finishCount = 0
    for (let i = 0; i < chunkCount; i++) {
      readFileAsBinary(file, i, chunkSize).then(binary => {
        chunks[i] = binary
        finishCount += 1
        if (finishCount === chunkCount) {
          resolve({
            chunks,
            total: chunkCount
          })
        }
      })
    }
  })
}

export function readFileAsBinary(file: File, startIndex: number, chunkSize: number): Promise<Uint8Array> {
  return new Promise(resolve => {
    const reader = new FileReader()

    const start = startIndex * chunkSize
    const end = start + chunkSize

    reader.onload = (e: ProgressEvent<FileReader>) => {
      resolve(new Uint8Array(e.target?.result as ArrayBuffer))
    }
    reader.readAsArrayBuffer(file.slice(start, end))
  })
}
