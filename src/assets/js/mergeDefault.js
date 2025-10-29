export function mergeDefault(defaultData, apiData) {
  // 如果 API 給的不是物件或是空，就直接用預設資料
  if (
    apiData === null ||
    apiData === undefined ||
    typeof apiData !== 'object'
  ) {
    return defaultData
  }

  // 陣列處理：API 有內容就用 API，空陣列就保留原本
  if (Array.isArray(defaultData) && Array.isArray(apiData)) {
    return apiData.length > 0 ? apiData : defaultData
  }

  // 物件處理：逐欄位合併
  const result = { ...defaultData }

  for (const key in apiData) {
    const apiVal = apiData[key]
    const defVal = defaultData[key]

    // 不用 null / undefined / 空字串 覆蓋掉本來有漂亮內容的欄位
    if (
      apiVal === null ||
      apiVal === undefined ||
      (typeof apiVal === 'string' && apiVal.trim() === '')
    ) {
      continue
    }

    // 巢狀物件/陣列 -> 繼續遞迴合併
    if (
      typeof apiVal === 'object' &&
      apiVal !== null &&
      defVal !== null &&
      typeof defVal === 'object'
    ) {
      result[key] = mergeDefault(defVal, apiVal)
    } else {
      // 一般值直接覆蓋
      result[key] = apiVal
    }
  }

  return result
}
