export function timeAgo({
  timestamp,
  now = Date.now(),
  dontPad = false,
  fullUnitText = false,
}: {
  timestamp: number;
  now?: number;
  dontPad?: boolean;
  fullUnitText?: boolean;
}) {
  const secondsAgo = Math.floor((now - timestamp) / 1000);

  const minute = 60;
  const hour = 3600;
  const day = 86400;
  const month = 2592000; // 30 days
  const year = 31536000; // 365 days

  if (secondsAgo < minute) {
    return `${fullUnitText ? "" : dontPad ? "0m " : "00m "}${Math.floor(
      secondsAgo
    )
      .toString()
      .padStart(dontPad ? 0 : 2, "0")}${getUnitText({
      value: Math.floor(secondsAgo),
      unit: "s",
      fullUnitText,
    })}`;
  }

  if (secondsAgo < hour) {
    const minutes = Math.floor(secondsAgo / minute);
    const remainingSeconds = secondsAgo % minute;
    return `${minutes.toString().padStart(dontPad ? 0 : 2, "0")}${getUnitText({
      value: minutes,
      unit: "m",
      fullUnitText,
      addComma: true,
    })} ${remainingSeconds
      .toString()
      .padStart(dontPad ? 0 : 2, "0")}${getUnitText({
      value: remainingSeconds,
      unit: "s",
      fullUnitText,
    })}`;
  }

  if (secondsAgo < day) {
    const hours = Math.floor(secondsAgo / hour);
    const remainingMinutes = Math.floor((secondsAgo % hour) / minute);
    return `${hours.toString().padStart(dontPad ? 0 : 2, "0")}${getUnitText({
      value: hours,
      unit: "h",
      fullUnitText,
      addComma: true,
    })} ${remainingMinutes
      .toString()
      .padStart(dontPad ? 0 : 2, "0")}${getUnitText({
      value: remainingMinutes,
      unit: "m",
      fullUnitText,
    })}`;
  }

  if (secondsAgo < month) {
    const days = Math.floor(secondsAgo / day);
    const remainingHours = Math.floor((secondsAgo % day) / hour);
    return `${days.toString().padStart(dontPad ? 0 : 2, "0")}${getUnitText({
      value: days,
      unit: "d",
      fullUnitText,
      addComma: true,
    })} ${remainingHours
      .toString()
      .padStart(dontPad ? 0 : 2, "0")}${getUnitText({
      value: remainingHours,
      unit: "h",
      fullUnitText,
    })}`;
  }

  if (secondsAgo < year) {
    const months = Math.floor(secondsAgo / month);
    const remainingDays = Math.floor((secondsAgo % month) / day);
    return `${months.toString().padStart(dontPad ? 0 : 2, "0")}${getUnitText({
      value: months,
      unit: "M",
      fullUnitText,
      addComma: true,
    })} ${remainingDays.toString().padStart(dontPad ? 0 : 2, "0")}${getUnitText(
      {
        value: remainingDays,
        unit: "d",
        fullUnitText,
      }
    )}`;
  }

  const years = Math.floor(secondsAgo / year);
  const remainingMonths = Math.floor((secondsAgo % year) / month);
  return `${years.toString().padStart(dontPad ? 0 : 2, "0")}${getUnitText({
    value: years,
    unit: "Y",
    fullUnitText,
    addComma: true,
  })} ${remainingMonths.toString().padStart(dontPad ? 0 : 2, "0")}${getUnitText(
    {
      value: remainingMonths,
      unit: "M",
      fullUnitText,
    }
  )}`;
}

function getUnitText({
  value,
  unit,
  fullUnitText,
  addComma = false,
}: {
  value: number;
  unit: string;
  fullUnitText: boolean;
  addComma?: boolean;
}) {
  let newUnit = "";

  if (fullUnitText) {
    switch (unit) {
      case "s":
        newUnit = value === 1 ? " second" : " seconds";
        break;
      case "m":
        newUnit = value === 1 ? " minute" : " minutes";
        break;
      case "h":
        newUnit = value === 1 ? " hour" : " hours";
        break;
      case "d":
        newUnit = value === 1 ? " day" : " days";
        break;
      case "M":
        newUnit = value === 1 ? " month" : " months";
        break;
      case "Y":
        newUnit = value === 1 ? " year" : " years";
        break;
      default:
        newUnit = unit;
    }

    return newUnit + (addComma ? "," : "");
  }

  return unit;
}
