export const sum = (objArr, prop, initialValue = 0) => {
  return objArr.reduce((sum, item) => sum + item[prop], initialValue);
};

export const isIn = (item, arr, prop) => {
  return arr.find((x) => x[prop] === item[prop]) !== undefined;
};

export const isPeriodDup = (lecture, timetableLectures) => {
  if (!lecture.period || lecture.period === 'EMPTY') return false;
  return timetableLectures.reduce(
    (isDup, { period: periods }) => {
      if (!periods || periods === 'EMPTY') return isDup;
      return (
        isDup ||
        lecture.period.split(',').reduce((isDup, period) => isDup || periods.includes(period), false)
      );
    },
    false,
  );
};

export const copyToClipboard = (text) => {
  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);

  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};
