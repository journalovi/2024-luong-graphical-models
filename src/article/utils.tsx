const CONTRACTIONS = ["'m", "'s", "'re", "'ve", "'d", "'ll", "n't"]

export const tokenize = (string: string) => {
  const space_split = string.split(' ')
  let result = space_split

  for (const contraction of CONTRACTIONS) {
    result = result
      .map((token) => {
        if (token.endsWith(contraction)) {
          return [token.slice(0, -contraction.length), contraction]
        }
        return token
      })
      .flat()
  }

  result = result
    .map((token) => {
      // Skip already split contractions
      if (CONTRACTIONS.includes(token)) {
        return token
      }

      if (token.match(/[^a-zA-Z0-9]/)) {
        const split_token = []
        const regex = /[^a-zA-Z0-9]/g
        let match
        let lastIndex = 0

        while ((match = regex.exec(token)) !== null) {
          split_token.push(token.slice(lastIndex, match.index))
          split_token.push(match[0])

          lastIndex = match.index + 1
        }
        split_token.push(token.slice(lastIndex))

        return split_token
      }

      return token
    })
    .flat()

  return result
}

export const getTokenSpaces = (originalString: string, tokens: string[]) => {
  const spaces: boolean[] = []
  const splitString = originalString.split(' ')

  let currentSplitStringIndex = 0
  let currentString = splitString[currentSplitStringIndex]
  let reconstructedString = ''

  tokens.forEach((token) => {
    if (token === currentString) {
      spaces.push(true)
      currentSplitStringIndex += 1
      currentString = splitString[currentSplitStringIndex]
      return
    }

    reconstructedString += token
    if (reconstructedString === currentString) {
      spaces.push(true)

      reconstructedString = ''
      currentSplitStringIndex += 1
      currentString = splitString[currentSplitStringIndex]
      return
    }

    spaces.push(false)
  })

  return spaces
}
