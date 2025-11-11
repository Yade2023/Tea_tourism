// /src/assets/js/mergeDefault.ts
export function mergeDefault(defaultData: any, apiData: any): any {
  // 如果 API 是空的，直接回預設
  if (!apiData || typeof apiData !== 'object') return defaultData

  const result: any = Array.isArray(defaultData) ? [] : {}

  // 先把「預設的 key」都跑一遍
  for (const key in defaultData) {
    const defVal = defaultData[key]
    const apiVal = apiData[key]

    // 1. API 沒這個欄位 → 用預設的
    if (apiVal === undefined || apiVal === null || apiVal === '') {
      result[key] = defVal
      continue
    }

    // 2. 兩邊都是陣列 → 做「逐筆合併」
    if (Array.isArray(defVal) && Array.isArray(apiVal)) {
      const mergedArray: any[] = []
      const maxLen = Math.max(defVal.length, apiVal.length)

      for (let i = 0; i < maxLen; i++) {
        const dItem = defVal[i]
        const aItem = apiVal[i]

        if (dItem && aItem) {
          // 都有 → 再做一次物件合併（遞迴）
          mergedArray.push(mergeDefault(dItem, aItem))
        } else if (aItem) {
          // 只有 API 有 → 用 API 的
          mergedArray.push(aItem)
        } else {
          // 只有預設有 → 保留預設
          mergedArray.push(dItem)
        }
      }

      result[key] = mergedArray
      continue
    }

    // 3. 如果是物件 → 做遞迴合併
    if (
      typeof defVal === 'object' &&
      defVal !== null &&
      typeof apiVal === 'object' &&
      apiVal !== null &&
      !Array.isArray(defVal) &&
      !Array.isArray(apiVal)
    ) {
      result[key] = mergeDefault(defVal, apiVal)
      continue
    }

    // 4. 其他情況（字串、數字...） → 直接用 API 的
    result[key] = apiVal
  }

  // 5. 如果 API 多出一些 key，是預設沒有的，也可以帶進來
  for (const key in apiData) {
    if (result[key] === undefined) {
      result[key] = apiData[key]
    }
  }

  return result
}