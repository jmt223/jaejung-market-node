// 쉼표로 된 문자열을 배열로 바꿔줌 (.env 값 읽을때 씀)
export function splitCsv(value?: string): string[] {
  const result: string[] = [];
  if (!value) {
    return result;
  }

  const items = value.split(',');
  for (let i = 0; i < items.length; i++) {
    const item = items[i].trim();
    if (item !== '') {
      result.push(item);
    }
  }
  return result;
}
