export function* parseNDJSON(input: string) {
  const lines = input.split('\n')
  for (const line of lines) {
    if (!line.trim()) continue
    try { yield JSON.parse(line) } catch { /* ignore */ }
  }
}
