//生成指定長度的唯一ID
export function GenNonDuplicateID(randomLength) {
  return Number(
    Math.random().toString().substr(3, randomLength) + Date.now()
  ).toString(36);
}
